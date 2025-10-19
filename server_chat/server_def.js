import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// === CONFIG ===
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const CHATS_DIR = path.join(__dirname, "..", "chats"); // Directory condivisa per i file utente
const LOG_JSON_PATH = path.join(__dirname, "..", "chats", "responses.json"); // Log globale nella stessa dir

// Crea la cartella se non esiste
if (!fs.existsSync(CHATS_DIR)) {
  fs.mkdirSync(CHATS_DIR);
}

// ========== UTIL: Canonicalizzazione (JCS-like) ==========
function canonicalize(value) {
  // JSON Canonicalization Scheme-like: chiavi ordinate, niente spazi
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  const sorted = {};
  for (const k of Object.keys(value).sort()) {
    sorted[k] = canonicalize(value[k]);
  }
  return sorted;
}
function toCanonicalJSONString(obj) {
  const canon = canonicalize(obj);
  // stringify senza spazi: separators = (",", ":")
  return JSON.stringify(canon);
}

// ========== UTIL: Hash ==========
const DOMAIN_PREFIX = Buffer.from("MSGv1|"); // domain separation
function sha256HexFromCanonical(canonicalJSONString) {
  const h = crypto.createHash("sha256");
  h.update(DOMAIN_PREFIX);
  h.update(Buffer.from(canonicalJSONString, "utf8"));
  return h.digest("hex");
}

// ========== UTIL: FHE placeholder ==========
function fheEncryptPlaceholder(hashHex) {
  // Placeholder leggibile/deterministico (NON sicuro!) per integrazione end-to-end.
  // In produzione: usa TFHE/Concrete con chiavi reali del cliente.
  const salt = crypto.createHash("sha256").update("tfhe-demo").digest();
  const x = Buffer.from(hashHex, "hex");
  const xor = Buffer.alloc(x.length);
  for (let i = 0; i < x.length; i++) xor[i] = x[i] ^ salt[i % salt.length];
  return "FHE_CTXT_" + xor.toString("hex").slice(0, 64);
}

// ========== UTIL: Merkle Tree (SHA-256 su concat left||right) ==========
function merkleParentHex(leftHex, rightHex) {
  const h = crypto.createHash("sha256");
  const left = Buffer.from(leftHex, "hex");
  const right = Buffer.from((rightHex ?? leftHex), "hex"); // se dispari, duplica l'ultima
  h.update(Buffer.concat([left, right]));
  return h.digest("hex");
}
function buildMerkleTree(leavesHex) {
  if (leavesHex.length === 0) {
    return { root: null, levels: [] };
  }
  let level = [...leavesHex];
  const levels = [level];
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = i + 1 < level.length ? level[i + 1] : null;
      next.push(merkleParentHex(left, right ?? left));
    }
    level = next;
    levels.push(level);
  }
  return { root: levels[levels.length - 1][0], levels };
}
function merkleProofForIndex(levels, index) {
  // levels[0] = foglie, levels[last] = root level
  const proof = [];
  let idx = index;
  for (let depth = 0; depth < levels.length - 1; depth++) {
    const level = levels[depth];
    const isRight = idx % 2 === 1;
    const siblingIndex = isRight ? idx - 1 : idx + 1;
    const siblingHash = level[siblingIndex] ?? level[idx]; // duplica se manca
    proof.push({ pos: isRight ? "left" : "right", h: siblingHash });
    idx = Math.floor(idx / 2);
  }
  return proof;
}

// ========== UTIL: Data windows ==========
function yyyymmddUTCFromUnixSeconds(sec) {
  const d = new Date(sec * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// === FUNZIONI DI SUPPORTO ===

// Carica il file JSON completo dell'utente (chat + log + archivio)
function loadUserFile(user_id) {
  const userFile = path.join(CHATS_DIR, `chats_${user_id}.json`);
  if (fs.existsSync(userFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(userFile, "utf8"));
      
      // MIGRAZIONE: converti vecchio formato (chats flat) in conversations
      if (parsed.chats && !parsed.conversations) {
        const conversations = [];
        if (parsed.chats.length > 0) {
          // Strategia di separazione intelligente:
          // Separa conversazioni solo quando ci sono "pause" logiche
          // Indizi di nuova conversazione:
          // 1. Due messaggi user consecutivi (significa che non c'è stata risposta)
          // 2. Cambio drastico di topic (difficile da rilevare, quindi usiamo euristica)
          
          let currentConv = { 
            id: '1', 
            title: '', 
            messages: [], 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
          };
          let convId = 1;
          
          for (let i = 0; i < parsed.chats.length; i++) {
            const msg = parsed.chats[i];
            const prevMsg = currentConv.messages[currentConv.messages.length - 1];
            
            // Nuova conversazione SOLO se:
            // - È un messaggio user
            // - E il messaggio precedente era anche user (no risposta in mezzo)
            const shouldStartNewConv = 
              msg.role === 'user' && 
              prevMsg && 
              prevMsg.role === 'user';
            
            if (shouldStartNewConv) {
              // Salva conversazione corrente
              if (currentConv.messages.length > 0) {
                const firstUserMsg = currentConv.messages.find(m => m.role === 'user');
                currentConv.title = firstUserMsg ? 
                  firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '') : 
                  'Chat ' + convId;
                conversations.push(currentConv);
              }
              // Inizia nuova conversazione
              convId++;
              currentConv = { 
                id: String(convId), 
                title: '', 
                messages: [], 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString() 
              };
            }
            
            currentConv.messages.push(msg);
          }
          
          // Aggiungi l'ultima conversazione
          if (currentConv.messages.length > 0) {
            const firstUserMsg = currentConv.messages.find(m => m.role === 'user');
            currentConv.title = firstUserMsg ? 
              firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '') : 
              'Chat ' + convId;
            conversations.push(currentConv);
          }
        }
        
        parsed.conversations = conversations;
        delete parsed.chats;
        saveUserFile(user_id, parsed);
      }
      
      // garantisci campi
      return {
        conversations: parsed.conversations ?? [],
        logs: parsed.logs ?? [],
        messages: parsed.messages ?? [],       // archivio per messaggi indicizzati
        trees: parsed.trees ?? {}              // per tree_id -> { leaves, root, algo, canon_rules }
      };
    } catch (err) {
      console.warn(`⚠️ Errore caricando file chat per ${user_id}:`, err.message);
      return { conversations: [], logs: [], messages: [], trees: {} };
    }
  } else {
    return { conversations: [], logs: [], messages: [], trees: {} };
  }
}

// Salva il file JSON completo dell’utente
function saveUserFile(user_id, data) {
  const userFile = path.join(CHATS_DIR, `chats_${user_id}.json`);
  fs.writeFileSync(userFile, JSON.stringify(data, null, 2), "utf8");
}

// Gestione log globale (responses.json)
let logs = [];
if (fs.existsSync(LOG_JSON_PATH)) {
  try {
    logs = JSON.parse(fs.readFileSync(LOG_JSON_PATH, "utf8"));
  } catch {
    logs = [];
  }
}
function saveGlobalLog(entry) {
  logs.push(entry);
  fs.writeFileSync(LOG_JSON_PATH, JSON.stringify(logs, null, 2), "utf8");
}

// ========== PIPE: costruzione archivio + merkle ==========
function createMessageArchiveEntry({ user_id, created, provider, model, content, system_fingerprint, content_type }) {
  const nonce = crypto.randomBytes(5).toString("hex");

  // payload minimo + nonce + (opzionale) content_type per distinguere user/assistant
  const payload = {
    user_id,
    created,
    provider,
    model,
    content,
    system_fingerprint,
    nonce
  };
  if (content_type) payload.content_type = content_type; // opzionale ma utile

  const canonical_json = toCanonicalJSONString(payload);
  const content_hash = sha256HexFromCanonical(canonical_json);
  const content_hash_fhe = fheEncryptPlaceholder(content_hash);

  return {
    user_id,
    created,
    provider,
    model,
    content,
    system_fingerprint,
    nonce,
    ...(content_type ? { content_type } : {}),
    content_hash,
    content_hash_fhe,
    canonical_json
  };
}

function upsertMerkleAndAnnotate(userData, archiveEntry) {
  const tree_id = yyyymmddUTCFromUnixSeconds(archiveEntry.created);
  if (!userData.trees[tree_id]) {
    userData.trees[tree_id] = {
      algo: "SHA-256",
      canon_rules: "JCS-like",
      leaves: [],   // array di content_hash in ordine d’inserimento
      root: null
    };
  }
  const tree = userData.trees[tree_id];

  // Append nuova foglia
  const leaf_index = tree.leaves.length;
  tree.leaves.push(archiveEntry.content_hash);

  // Ricostruisci l’albero (semplice e robusto)
  const { root, levels } = buildMerkleTree(tree.leaves);

  tree.root = root;

  // Calcola la proof per questa foglia
  const proof = merkleProofForIndex(levels, leaf_index);

  // Oggetto completo come da specifica
  const stored = {
    content_hash: archiveEntry.content_hash,
    content_hash_fhe: archiveEntry.content_hash_fhe,
    canonical_json: archiveEntry.canonical_json,
    tree_id,
    leaf_index,
    proof
  };

  return { stored, tree_id };
}

// === FUNZIONE PRINCIPALE INVIO AI ===
async function sendToAI(user_id, provider, model, newMessage, conversation_id = null) {
  const userData = loadUserFile(user_id);

  console.log('🔵 sendToAI - Ricevuto conversation_id:', conversation_id);
  console.log('🔵 sendToAI - Conversazioni esistenti:', userData.conversations.map(c => ({ id: c.id, messages: c.messages.length })));

  // Trova o crea la conversazione
  let conversation;
  if (conversation_id) {
    conversation = userData.conversations.find(c => c.id === conversation_id);
    if (!conversation) {
      // Conversazione non trovata, crea nuova con l'ID specificato
      console.log('⚠️  Conversation ID non trovato, creo nuova conversazione con ID:', conversation_id);
      conversation = {
        id: conversation_id,
        title: newMessage.slice(0, 40) + (newMessage.length > 40 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      userData.conversations.push(conversation);
    } else {
      console.log('✅ Trovata conversazione esistente:', conversation_id, '- Messaggi attuali:', conversation.messages.length);
    }
  } else {
    // Nessun ID fornito, crea nuova conversazione con timestamp
    const newId = Date.now().toString();
    console.log('🆕 Nessun conversation_id fornito, creo nuova con ID:', newId);
    conversation = {
      id: newId,
      title: newMessage.slice(0, 40) + (newMessage.length > 40 ? '...' : ''),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    userData.conversations.push(conversation);
  }

  // Aggiungi messaggio utente alla conversazione
  console.log('📝 Aggiunto messaggio utente alla conversazione:', conversation.id);
  conversation.messages.push({ role: "user", content: newMessage });
  conversation.updatedAt = new Date().toISOString();

  const response = await axios.post(
    OPENROUTER_URL,
    { model, messages: conversation.messages },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": provider,
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data;
  const aiMessage = data.choices?.[0]?.message?.content || "";
  const created = (typeof data.created === "number" ? data.created : Math.floor(Date.now() / 1000)); // UNIX sec
  const system_fingerprint = data.system_fingerprint || "none";

  // Aggiungi risposta AI alla conversazione
  conversation.messages.push({ role: "assistant", content: aiMessage });
  conversation.updatedAt = new Date().toISOString();

  // Log "classico"
  const logEntry = {
    user_id,
    created,
    provider,
    model,
    message: newMessage,
    response: aiMessage,
    system_fingerprint,
  };

  // === Archivio: indicizza MESSAGGIO UTENTE ===
  const archiveUser = createMessageArchiveEntry({
    user_id,
    created,
    provider,
    model,
    content: newMessage,
    system_fingerprint,
    content_type: "user"
  });
  const { stored: storedUsr, tree_id: treeIdUsr } = upsertMerkleAndAnnotate(userData, archiveUser);

  userData.messages.push({
    ...archiveUser,
    tree_id: treeIdUsr,
    leaf_index: storedUsr.leaf_index,
    proof: storedUsr.proof
  });

  // === Archivio: indicizza RISPOSTA ASSISTENTE ===
  const archiveAssistant = createMessageArchiveEntry({
    user_id,
    created, // puoi anche usare Date.now()/1000 se vuoi distinguere temporalmente
    provider,
    model,
    content: aiMessage,
    system_fingerprint,
    content_type: "assistant"
  });
  const { stored: storedAsst, tree_id: treeIdAsst } = upsertMerkleAndAnnotate(userData, archiveAssistant);

  userData.messages.push({
    ...archiveAssistant,
    tree_id: treeIdAsst,
    leaf_index: storedAsst.leaf_index,
    proof: storedAsst.proof
  });

  // Salvataggi
  userData.logs.push(logEntry);
  saveUserFile(user_id, userData);
  saveGlobalLog(logEntry);

  console.log('💾 Salvata conversazione:', conversation.id, '- Totale messaggi:', conversation.messages.length);
  console.log('📊 Totale conversazioni utente:', userData.conversations.length);

  // Risultato per il client
  return {
    aiMessage,
    full_response: data,
    created,
    system_fingerprint,
    conversation_id: conversation.id  // Restituisci l'ID conversazione
  };
}

// === ENDPOINT CHAT ===
app.post("/api/chat", async (req, res) => {
  try {
    const {
      user_id = "anonymous",
      provider = "OpenAI",
      model = "gpt-4o-mini",
      message,
      conversation_id = null,  // Nuovo: ID conversazione opzionale
    } = req.body;

    console.log('🔵 /api/chat - Ricevuto dal frontend:', {
      user_id,
      conversation_id,
      conversation_id_type: typeof conversation_id,
      message: message?.substring(0, 30)
    });

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Campo 'message' mancante o non valido" });
    }

    const result = await sendToAI(user_id, provider, model, message, conversation_id);

    res.json({
      success: true,
      provider,
      model,
      content: result.aiMessage,
      created: result.created,
      system_fingerprint: result.system_fingerprint,
      conversation_id: result.conversation_id,  // Restituisci l'ID conversazione
    });
  } catch (err) {
    console.error("❌ Errore generico chat:", err.response?.data || err.message);
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

// === ENDPOINT PER OTTENERE LE CHAT/LOG/ARCHIVI E TREES DI UN UTENTE ===
app.get("/api/chats/:user_id", (req, res) => {
  const { user_id } = req.params;
  const userData = loadUserFile(user_id);

  // Calcola “view” sintetica per l’albero più recente (opzionale)
  let latestTree = null;
  const treeIds = Object.keys(userData.trees).sort();
  if (treeIds.length > 0) {
    const lastId = treeIds[treeIds.length - 1];
    const t = userData.trees[lastId];
    latestTree = {
      tree_id: lastId,
      root_hash: t.root,
      algo: t.algo,
      canon_rules: t.canon_rules,
      total_leaves: t.leaves.length
    };
  }

  res.json({
    user_id,
    conversations: userData.conversations,  // Nuovo formato
    logs: userData.logs,
    // archivio dei messaggi con hash, ciphertext FHE (placeholder), proof, ecc.
    messages: userData.messages,
    // stato dei merkle tree (per ogni finestra giornaliera)
    trees: Object.fromEntries(
      Object.entries(userData.trees).map(([id, t]) => [
        id,
        {
            root: t.root,
            root_hash: t.root, 
            algo: t.algo, 
            canon_rules: t.canon_rules,
            leaves: t.leaves,               //per ricpotruire la proof lato client
            leaves_count: t.leaves.length 
        }
      ])
    ),
    latest_tree: latestTree
  });
});

// === ENDPOINT: proof on-demand per una leaf ===
app.get("/api/proof/:user_id/:hash", (req, res) => {
  const { user_id, hash } = req.params;
  const userData = loadUserFile(user_id);

  // cerca in quale albero sta questa leaf
  for (const [tree_id, t] of Object.entries(userData.trees)) {
    const idx = t.leaves.indexOf(hash);
    if (idx !== -1) {
      // ricostruisci livelli e proof
      const { root, levels } = buildMerkleTree(t.leaves);
      const proof = merkleProofForIndex(levels, idx);
      return res.json({
        user_id,
        tree_id,
        leaf_hash: hash,
        leaf_index: idx,
        root_hash: root,
        algo: t.algo,
        canon_rules: t.canon_rules,
        domain_prefix: "MSGv1|",
        proof
      });
    }
  }
  res.status(404).json({ error: "hash non trovato in nessun albero" });
});

// === ENDPOINT SPECIFICI PER PROVIDER ===
const providerConfigs = {
  openai: "openai/gpt-4o-mini",
  anthropic: "anthropic/claude-haiku-4.5",
  xai: "x-ai/grok-4-fast",
  google: "google/gemini-2.5-flash-preview-09-2025",
  meta: "meta-llama/llama-3.1-70b-instruct",
};

Object.entries(providerConfigs).forEach(([providerName, model]) => {
  app.post(`/api/${providerName}`, async (req, res) => {
    try {
      const { 
        user_id = "anonymous", 
        message,
        conversation_id = null  // ⬅️ AGGIUNTO: supporto conversation_id
      } = req.body;

      console.log(`🔵 /api/${providerName} - Ricevuto:`, {
        user_id,
        conversation_id,
        message: message?.substring(0, 30)
      });

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Campo 'message' mancante o non valido" });
      }

      const result = await sendToAI(user_id, providerName, model, message, conversation_id);  // ⬅️ PASSA conversation_id
      res.json({
        success: true,
        provider: providerName,
        model,
        content: result.aiMessage,
        created: result.created,
        system_fingerprint: result.system_fingerprint,
        conversation_id: result.conversation_id,  // ⬅️ AGGIUNTO: restituisci conversation_id
      });
    } catch (err) {
      console.error(`❌ Errore ${providerName}:`, err.response?.data || err.message);
      res.status(500).json({ error: err.message, details: err.response?.data });
    }
  });
});

// === ENDPOINT: Recupera lo storico chat dell'utente ===
app.get('/api/user-chats/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Carica il file JSON dell'utente
    const userData = loadUserFile(userId);
    
    // Restituisci le conversazioni
    res.json({
      conversations: userData.conversations || [],
      success: true
    });
  } catch (err) {
    console.error(`❌ Error loading chats for user ${req.params.userId}:`, err);
    res.status(500).json({ 
      error: 'Failed to load chat history',
      details: err.message 
    });
  }
});

// === SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server AI multi-utente avviato su http://localhost:${PORT}`)
);
