// check-leaf.js
//es. node check-leaf-def.js 612857382954e884f508a22f556f34cf6ab1b37725a8cde53efe489702cee77e --json
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const { RPC_URL, CONTRACT_ADDRESS } = process.env;

if (!RPC_URL || !CONTRACT_ADDRESS) {
  console.error("Manca RPC_URL o CONTRACT_ADDRESS nel .env");
  process.exit(1);
}

// ABI per la versione "metadati in chiaro"
const ABI = [
  // leaves ora ritorna stringhe + exists
  "function leaves(bytes32) view returns (bytes32 treeId,uint32 leafIndex,string user_id,uint64 created,string provider,string model,bytes32 vectorCommit,bool exists)",
  "function trees(bytes32) view returns (bytes32 root, uint8 algo, uint8 canon, bool exists)",
  // getter comodo opzionale (se hai incluso getLeaf nel contratto)
  "function getLeaf(bytes32 leaf) view returns (bool exists, bytes32 treeIdHash, uint32 leafIndex, string user_id, uint64 created, string provider, string model, bytes32 vectorCommit)"
];

// Normalizzazione robusta di bytes32
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

// parsing argomenti
function parseArgs(argv) {
  // Uso: node check-leaf.js <leafHex> [--json]
  const args = { leaf: null, json: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") args.json = true;
    else if (!args.leaf) args.leaf = a;
  }
  if (!args.leaf) {
    console.error("Uso: node check-leaf.js <content_hash_hex> [--json]");
    process.exit(1);
  }
  return args;
}

async function main() {
  const { leaf, json } = parseArgs(process.argv);

  let leafBytes32;
  try {
    leafBytes32 = parseBytes32(leaf, "content_hash");
  } catch (e) {
    console.error(`Errore: ${e.message}`);
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  // Preferisco getLeaf (se presente); fallback su leaves()
  let exists, treeIdHash, leafIndex, user_id, created, providerStr, model, vectorCommit;
  try {
    const r = await c.getLeaf(leafBytes32);
    exists       = r[0];
    treeIdHash   = r[1];
    leafIndex    = Number(r[2]);
    user_id      = r[3];
    created      = r[4];
    providerStr  = r[5];
    model        = r[6];
    vectorCommit = r[7];
  } catch {
    const li = await c.leaves(leafBytes32);
    // (treeId, leafIndex, user_id, created, provider, model, vectorCommit, exists)
    treeIdHash   = li[0];
    leafIndex    = Number(li[1]);
    user_id      = li[2];
    created      = li[3];
    providerStr  = li[4];
    model        = li[5];
    vectorCommit = li[6];
    exists       = li[7];
  }

  // Se non esiste, esci con codice 1 (utile in CI)
  if (!exists) {
    const out = { exists: false, leaf: leafBytes32 };
    if (json) console.log(JSON.stringify(out, null, 2));
    else console.log(`❌ Leaf NON ancorata: ${leafBytes32}`);
    process.exit(1);
  }

  // Tree info
  const treeInfo = await c.trees(treeIdHash);

  const result = {
    exists: true,
    leaf: leafBytes32,
    leafIndex,
    metadata: {
      user_id,
      created: created.toString(),
      provider: providerStr,
      model,
    },
    vectorCommit,
    tree: {
      treeIdHash,
      registered: Boolean(treeInfo.exists),
      root: treeInfo.root,
      algo: Number(treeInfo.algo),   // 0 = SHA256
      canon: Number(treeInfo.canon), // 0 = JCS_LIKE
    },
  };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("✅ Leaf ancorata on-chain:");
    console.log(`  leaf          : ${result.leaf}`);
    console.log(`  leafIndex     : ${result.leafIndex}`);
    console.log("  Metadati (in chiaro):");
    console.log(`    user_id     : ${result.metadata.user_id}`);
    console.log(`    created     : ${result.metadata.created}`);
    console.log(`    provider    : ${result.metadata.provider}`);
    console.log(`    model       : ${result.metadata.model}`);
    console.log(`  vectorCommit  : ${result.vectorCommit}`);
    console.log("  Tree:");
    console.log(`    treeIdHash  : ${result.tree.treeIdHash}`);
    console.log(`    registered  : ${result.tree.registered}`);
    console.log(`    root        : ${result.tree.root}`);
    console.log(`    algo/canon  : ${result.tree.algo}/${result.tree.canon}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
