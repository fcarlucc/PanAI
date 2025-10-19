# 🧬 PanAI — Protocol for AI Notarization

> **The world’s first protocol for AI notarization.**  
> Notarize any message — human or AI — on-chain with privacy.  
> PanAI makes provenance free, smart, and autonomous with AI-driven notarization that costs near zero.

**Craft it. Sign it. Prove it on-chain.**  
Your words, forever verifiable.

---

## ⛓️ Overview

PanAI (PAN) is an **open standard for AI provenance and verification**.  
Every message is normalized, hashed, added to a **session Merkle tree**, and finalized on **Base** as a **RootSigned event** — with **no plaintext or PII on-chain**.  

Using **Zama FHE**, messages and embeddings can be **encrypted**, compared privately, and verified without revealing their content.

---

## ✨ Core Principles

| Concept | Description |
|----------|--------------|
| **Roots on Base** | Public verification via events; no plaintext or user data on-chain. |
| **Auto-signing** | Every message (AI or manual) is automatically notarized and added to the session Merkle. |
| **Private checks** | Semantic similarity runs fully encrypted under FHE. |

A **tamper-evident truth layer** for every message.

---

## 💡 How It Works

### 🧠 AI Chat (Multi-model)
- Choose your model or use **smart routing** via OpenRouter.  
- Each message is **normalized, hashed, and added** to the session Merkle tree.  
- On “Finalize”, the **Merkle root** is published on Base (event only).  
- Copy your **message badge** (three dots → “Copy Proof”).

### 🔗 PAN Schema
```
Normalize → Hash → Leaf → Merkle Root → RootSigned(Base)
```

All proofs are **reproducible, verifiable, and privacy-preserving**.


## 📊 Notarization Flow Diagram

Below is a placeholder for the **PanAI Notarization Flow**, illustrating the process from message creation to on-chain proof and verification.

<img width="2161" height="862" alt="notarization_flow" src="https://github.com/user-attachments/assets/894dbab1-705b-4e8e-9c79-414aa4ad3d88" />

---

## 🪙 Token Dynamics

Two tokens power the network:

| Token | Type | Purpose |
|--------|------|----------|
| **PANAI** | ERC-20 | Utility & rewards |
| **PanSoul** | ERC-721 (Soulbound) | Reputation & trust |


## 💰 PANAI Token Utility Diagram

This section visualizes how the **PANAI token** is earned, distributed, and used within the ecosystem.

<img width="3309" height="654" alt="panai_token" src="https://github.com/user-attachments/assets/289f6b46-f1d8-40ab-a35e-05617eb8033e" />

### 🪙 PANAI — Utility & Rewards

- **Earn:** on `Finalize`, based on unique notarized messages later verified.  
- **Claim:** pending rewards accrue off-chain; claimable on-chain (meta-tx planned).  
- **Anti-abuse:** no reward for duplicates, bot-like bursts, or failed proofs.  
- **Efficiency:** AI aggregation makes notarization near-zero cost for users.

---

### 🧬 PanSoul — Reputation (SBT)

- **Increase:** when content is verified or referenced in certified sessions.  
- **Decay/Slash:** confirmed reports or fraudulent attestations reduce score.  
- **Fairness:** daily caps, deduplication, and optional ENS/Civic identity checks.  
- **Transparency:** all updates are emitted as events; dispute window available.  

🧩 *Future:* Optional **ZK add-on** for private exact-match proofs.  
🗳️ Governance for emissions and decay is planned post-MVP.

## 🧬 PanSoul — Reputation Diagram

<img width="3256" height="658" alt="pansoul_reputation" src="https://github.com/user-attachments/assets/b3d6d626-1902-4c8e-ab50-7e367f6e0e26" />

---

## 🧩 Product

PanAI lets you notarize content, anchor Merkle roots on Base, and verify them anywhere — **with privacy by design** and **open APIs**.

| Feature | Description |
|----------|--------------|
| **Batch notarization** | Sign entire conversations with one on-chain event. |
| **Badges & certificates** | Shareable proof ZIPs, publicly verifiable. |
| **Verify anywhere** | Web, CLI, or API — same proofs, same results. |
| **Privacy-first** | AES-GCM + FHE; no plaintext stored. |
| **Deterministic** | Canonical normalization + cross-platform hashing tests. |
| **Auditable** | Reproducible proofs via RootSigned events. |
| **Modern stack** | Next.js · Fastify · viem/wagmi · Postgres · S3/IPFS. |
| **FHE-ready** | Encrypted semantic checks; ZK in future. |

---

## 🔐 Security & Privacy

- **No plaintext** server-side (AES-GCM encrypted blobs).  
- **FHE keys:** public key for encrypt/evaluate; secret key stays client-side.  
- **On-chain:** only hashes, commitments, and Merkle roots.  
- **Zero PII** ever stored or emitted.

---

## 🧮 FHE Pipeline (Zama)

1. Client computes embeddings/summaries.  
2. Encrypt (FHE) both vectors.  
3. FHE worker fetches ciphertexts (CID/IPFS/S3).  
4. Computes encrypted cosine similarity.  
5. Returns encrypted score → client decrypts → optional signed verdict.

---

## ⚙️ Architecture Overview

```
[Client]  → Normalize + Hash
           → Build Merkle
           → Encrypt (optional FHE)
           ↓
[Base Sepolia]  RootSigned(root, sessionId)
           ↓
[Verifier/FHE Worker]
           → Compare encrypted summaries
           → Return encrypted score
```

---

## 🌍 Use Cases

| Domain | Application |
|--------|--------------|
| **Media & Journalism** | Integrity and alteration proofs; source verification. |
| **Legal & Compliance** | Attestations without exposing content. |
| **UGC Platforms** | Anti-plagiarism and trust badges. |
| **Research & AI Labs** | Prompt/data provenance and audit trails. |
| **Software** | Notarize commits or binaries. |
| **Enterprise** | Policy-grade document and email notarization. |

---

## 🧭 Roadmap

### **Now (MVP)**
- Chat · Sign · Verify (hash match)
- Merkle roots on Base Sepolia (`RootSigned` events)
- Client-side encryption
- Verify CLI + SDK documented

### **Next 30 Days**
- Open PAN spec + test vectors  
- Profiles with PANAI rewards & PanSoul reputation  
- ENS reverse + "Verified with PAN" certificates

### **60–90 Days**
- Base Mainnet deployment  
- 1inch API integration for balance/metadata  
- FHE pilot (Zama) for private near-duplicate checks

### **Q3**
- Public **PAN Core** draft and SDK for third-party providers  
- Base Miniapp + PanSoul leaderboard

### **Q4**
- **PAN 1.0** spec freeze + reference implementation  
- Optional ZK add-on for private exact-match  
- Interoperability program for providers/models

---

## 🧩 Integrations (Bounties)

### 🟦 Base
Miniapp with **PanSoul Trust Badge**, ENS, and RootSigned timeline.  
“Verify with PanAI” action pulls on-chain proofs and session status.

### 🔐 Zama FHE
Encrypted similarity checks for “is this what I said?” verification.

### 🤖 AI × Web3
Multi-model chat with deterministic hashing, public verification, and FHE privacy.

### 🦄 1inch
Login via 1inch Extension + SIWE.  
Fetch PANAI balance/price from 1inch API (shown in miniapp profile).

### 🧬 ENS
ENS reverse resolution for author display in certificates and UI.

### 🧱 Chainbound
PanSoul trust increases after finalization; optional publication of verdicts as metadata.

---

## ⛓️ Contracts

### **Base Mainnet**
| Contract | Type | Address |
|-----------|-------|----------|
| **PANAI** | ERC-20 (cap 1B) | `0x6b3F666806Fb0F79D23E6668e90D5DE2675E9cCc` |
| **PanSoul** | ERC-721 (Soulbound) | `0xe3aCCDA4B18D797feDD687b884B3d2b95580FFF2` |
| **Rewards Distributor** | Contract | `0x879E7BB5a35d9C702F11B81443FD13233bE89809` |

### **Base Sepolia**
| Contract | Type | Address |
|-----------|-------|----------|
| **Verifier** | Data anchoring + hash verification | `0x3A59756F5272124f46d01779Afa21F0851fec408` |

---

## 🧾 License

MIT License © 2025 — PanAI Project

---

## 💬 Contact

**Author:** [@cripsbo](https://t.me/cripsbo)  
**Repository:** [https://github.com/fcarlucc/PanAI](https://github.com/fcarlucc/PanAI)  
**Demo:** [https://pan-fawn.vercel.app](https://pan-fawn.vercel.app)

---

> “PanAI makes AI provenance verifiable, privacy-preserving, and interoperable — from model output to on-chain proof.”
