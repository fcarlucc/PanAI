// upload.js
import { readFileSync, writeFileSync } from "fs";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const {
  RPC_URL,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
  VECTOR_COMMIT_MODE = "hash", // "hash" | "zero"
  OPENAI_API_KEY,
  EMBEDDING_MODEL = "text-embedding-3-small",
} = process.env;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("Manca RPC_URL / PRIVATE_KEY / CONTRACT_ADDRESS nel .env");
  process.exit(1);
}

// === ABI per la versione con content bytes ===
const ABI = [
  // state
  "function owner() view returns (address)",
  "function trees(bytes32) view returns (bytes32 root, uint8 algo, uint8 canon, bool exists)",

  // mapping getter (ordine dei campi come nella struct LeafInfo)
  // bytes content aggiunto in coda
  "function leaves(bytes32) view returns (bytes32 treeId,uint32 leafIndex,string user_id,uint64 created,string provider,string model,bytes32 vectorCommit,bool exists,bytes content)",

  // write con content bytes
  "function registerTree(string treeId, bytes32 root) external",
  "function registerLeafPlain(bytes32 leaf,string treeId,uint32 leafIndex,(string user_id,uint64 created,string provider,string model) meta,bytes32 vectorCommit,bytes content) external",

  // helpers
  "function verifyInclusion(bytes32 leaf,string treeId,bytes32[] siblings,bool[] isLeft) view returns (bool)",
  "function getLeaf(bytes32 leaf) view returns (tuple(bytes32 treeId,uint32 leafIndex,string user_id,uint64 created,string provider,string model,bytes32 vectorCommit,bool exists,bytes content))",
  "function verifyInclusionAndGet(bytes32 leaf,string treeId,bytes32[] siblings,bool[] isLeft) view returns (bool,tuple(bytes32 treeId,uint32 leafIndex,string user_id,uint64 created,string provider,string model,bytes32 vectorCommit,bool exists,bytes content))",
];

// === Helpers robusti per bytes32 ===
function parseBytes32(hexLike, label = "bytes32") {
  if (hexLike === undefined || hexLike === null) {
    throw new Error(`${label} assente`);
  }
  const h = String(hexLike).trim().replace(/^0x/i, "");
  if (!/^[0-9a-fA-F]{64}$/.test(h)) {
    throw new Error(`${label} non valido: ${hexLike}`);
  }
  return "0x" + h.toLowerCase();
}

function tryParseBytes32(hexLike) {
  try { return parseBytes32(hexLike); } catch { return null; }
}

function treeIdHash(treeId) {
  return ethers.keccak256(ethers.toUtf8Bytes(treeId));
}

// Calcola commit dai byte del content (embedding serializzato)
function commitFromContentBytes(contentBytes) {
  if (VECTOR_COMMIT_MODE === "hash") {
    return ethers.keccak256(contentBytes);
  }
  return ethers.ZeroHash;
}

// Serializza `content` in bytes:
// - se stringa: prova a calcolare embedding via OpenAI (se chiave presente)
// - se array numeri: serializza in Float32LE
// - se Buffer/Uint8Array: passa-through
async function toContentBytes(content) {
  if (content == null) return null;

  // Se è già bytes
  if (Buffer.isBuffer(content)) return content;
  if (content instanceof Uint8Array) return Buffer.from(content);

  // Se è array numerico -> Float32 LE
  if (Array.isArray(content) && content.every(x => typeof x === "number")) {
    const f32 = new Float32Array(content.map(Number));
    return Buffer.from(f32.buffer);
  }

  // Se è stringa -> prova a generare embedding
  if (typeof content === "string") {
    const text = content.trim();
    if (!text) return Buffer.alloc(0);
    const embedding = await embedIfPossible(text);
    if (embedding) {
      const f32 = new Float32Array(embedding);
      return Buffer.from(f32.buffer);
    }
    // fallback: se niente embedding, salviamo UTF-8 bytes
    return Buffer.from(text, "utf8");
  }

  // Tipo non gestito
  throw new Error("content: tipo non supportato (usa stringa o array numerico)");
}

// ======= OpenAI Embeddings (opzionale) =======
async function embedIfPossible(text) {
  if (!OPENAI_API_KEY) return null;
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.warn(`Embeddings API error: ${res.status} ${res.statusText} ${t}`);
    return null;
  }
  const json = await res.json();
  const arr = json?.data?.[0]?.embedding;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.map(Number);
}

// Ricalcolo Merkle root (SHA-256) dalle leaves bytes32
async function computeMerkleRootSha256(leaves) {
  if (!Array.isArray(leaves) || leaves.length === 0) throw new Error("computeMerkleRootSha256: leaves vuote");
  if (leaves.length === 1) return leaves[0];

  let level = leaves.slice();
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? level[i];
      const combined = ethers.concat([left, right]);
      next.push(ethers.sha256(combined));
    }
    level = next;
  }
  return level[0];
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Uso: node upload.js ./file.json");
    process.exit(1);
  }

  // === Carica JSON ===
  const raw = readFileSync(jsonPath, "utf8");
  const data = JSON.parse(raw);

  // === Deduce treeId ===
  let treeId = data?.messages?.[0]?.tree_id;
  if (!treeId && data?.trees && typeof data.trees === "object") {
    const keys = Object.keys(data.trees);
    if (keys.length !== 1) {
      throw new Error("Impossibile dedurre treeId: specifica messages[].tree_id o un solo albero in data.trees");
    }
    treeId = keys[0];
  }
  if (!treeId) throw new Error("treeId non trovato nel JSON");

  // === Root Merkle: normalizza o ricalcola ===
  let rootHex = data?.trees?.[treeId]?.root;
  let root = tryParseBytes32(rootHex);
  if (!root) {
    const leavesRaw = data?.trees?.[treeId]?.leaves;
    if (!Array.isArray(leavesRaw) || leavesRaw.length === 0) {
      throw new Error(`Root mancante/non valida e impossibile ricalcolarla (leaves assenti) per treeId ${treeId}`);
    }
    const leaves = leavesRaw.map((x, i) => parseBytes32(x, `leaf[${i}]`));
    root = await computeMerkleRootSha256(leaves);
    console.log(`Root ricalcolata dalle leaves: ${root}`);
  }

  // === Setup ethers ===
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  // === Verifica owner ===
  const owner = await c.owner();
  if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
    console.warn(`ATTENZIONE: il wallet ${wallet.address} NON è l'owner (${owner}). Le chiamate onlyOwner falliranno.`);
  }

  // === Registra tree se necessario ===
  const thash = treeIdHash(treeId);
  const tInfo = await c.trees(thash);
  if (!tInfo.exists) {
    console.log(`Registrazione treeId="${treeId}" root=${root} ...`);
    const tx = await c.registerTree(treeId, root);
    const rc = await tx.wait();
    console.log(`✓ Tree registrato. tx=${rc.hash}`);
  } else {
    if (String(tInfo.root).toLowerCase() !== root.toLowerCase()) {
      console.warn(
        `Tree già presente ma root differente on-chain:\n on-chain: ${tInfo.root}\n locale  : ${root}\n(continuerò comunque con le leaf)`
      );
    } else {
      console.log(`Tree già registrato on-chain per "${treeId}".`);
    }
  }

  // === Itera i messaggi e ancora le leaf ===
  const msgs = data?.messages || [];
  if (!Array.isArray(msgs) || msgs.length === 0) throw new Error("Nessun elemento in data.messages");

  // Opzionale: salviamo un file con i content serializzati effettivamente inviati
  const sentDump = [];

  for (const m of msgs) {
    // 1) Normalizza leaf (content_hash)
    let leaf;
    try {
      leaf = parseBytes32(m.content_hash, "content_hash");
    } catch (e) {
      console.warn(`Salto leaf: ${e.message}`);
      continue;
    }

    // 2) Prepara meta + content bytes
    const leafIndex = Number(m.leaf_index ?? 0);
    const meta = {
      user_id: m.user_id || "",
      created: BigInt(m.created ?? 0), // uint64
      provider: m.provider || "",
      model: m.model || "",
    };

    const contentBytes = await toContentBytes(m.content ?? null);
    const vectorCommit = contentBytes ? commitFromContentBytes(contentBytes) : ethers.ZeroHash;

    // Skip se già ancorata
    const li = await c.leaves(leaf);
    const alreadyExists = li?.exists ?? (li?.length ? li[7] : false);
    if (alreadyExists) {
      const idx = Number(li.leafIndex ?? li[1] ?? leafIndex);
      console.log(`Leaf già ancorata: leaf=${leaf} (index=${idx})`);
      continue;
    }

    console.log(
      `Ancoraggio leaf=${leaf} index=${leafIndex} user_id=${meta.user_id} created=${meta.created.toString()} provider=${meta.provider} model=${meta.model} vectorCommit=${vectorCommit} bytes=${contentBytes?.length ?? 0} ...`
    );

    const tx = await c.registerLeafPlain(leaf, treeId, leafIndex, meta, vectorCommit, contentBytes ?? "0x");
    const rc = await tx.wait();
    console.log(`  ✓ Leaf ancorata. tx=${rc.hash}`);

    sentDump.push({
      leaf,
      leafIndex,
      user_id: meta.user_id,
      created: String(meta.created),
      provider: meta.provider,
      model: meta.model,
      vectorCommit,
      content_len: contentBytes?.length ?? 0,
    });
  }

  // Dump diagnostico (facoltativo)
  try {
    const outPath = jsonPath.replace(/\.json$/i, ".sent.json");
    writeFileSync(outPath, JSON.stringify({ treeId, sent: sentDump }, null, 2), "utf8");
    console.log(`File diagnostico scritto in: ${outPath}`);
  } catch (e) {
    console.warn(`Impossibile scrivere il file .sent.json: ${e.message}`);
  }

  console.log("Fatto ✅");
}

// Esecuzione
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
