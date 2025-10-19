"use client";
import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuth";
import { ConnectKitButton } from "connectkit";

/* ===========================
   NAV
=========================== */
const nav = [
  { id: "about", label: "About" },
  { id: "come-funziona", label: "How it works" },
  { id: "token-dynamics", label: "Token Dynamics" }, // NEW
  { id: "features", label: "Product" },
  { id: "usecases", label: "Use Cases" },
  { id: "roadmap", label: "Roadmap" },
  { id: "faq", label: "FAQ" },
];

/* ===========================
   CUSTOM CONNECT BUTTON
=========================== */
function CustomConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            className="rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg shadow-indigo-900/20 transition hover:brightness-110"
          >
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

/* ===========================
   HEADER
=========================== */
function Header() {
  const [open, setOpen] = useState(false);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      const previous = root.style.overflow;
      root.style.overflow = "hidden";
      return () => {
        root.style.overflow = previous || "";
      };
    }
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gray-950/70 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6" aria-label="Global">
        {/* Logo */}
        <a href="#hero" className="group inline-flex items-center gap-3">
          <img src="/logopansenza.png" alt="Logo" className="h-10 w-15 object-contain" />
          <span className="text-base font-bold tracking-tight text-gray-300 sm:inline">Protocol for AI Notarization</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {nav.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              {s.label}
            </a>
          ))}
          <div className="ml-2">
            <CustomConnectButton />
          </div>
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden rounded-md p-2 text-gray-300 hover:bg-white/5"
          aria-label="Open menu"
        >
          <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-md" />
          <div className="absolute inset-0 mx-auto flex max-w-md flex-col">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-semibold text-white">PAN</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-gray-300 hover:bg-white/5"
                aria-label="Close menu"
              >
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="grid gap-2">
                {nav.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-medium text-white hover:bg-white/10"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="px-5 pb-6">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ===========================
   HERO
=========================== */
function Hero() {
  return (
    <section id="hero" className="relative isolate flex min-h-[86dvh] items-center justify-center overflow-hidden pt-24 sm:pt-28">
      {/* Background */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[74rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,91,255,.25),rgba(0,0,0,0))] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[24rem] w-[50rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(33,230,161,.18),rgba(0,0,0,0))] blur-2xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-300 sm:text-xs">
          Open Standard • Base • Privacy by Design
        </p>
        <h1 className="mt-5 bg-gradient-to-br from-white via-white to-gray-300 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-6xl">
          The world’s first<br></br>Protocol for AI Notarization
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
          Notarize any message—human or AI—on-chain with privacy. PAN makes provenance free, smart and autonomous with AI-driven notarization that costs near zero.
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
          <span className="text-white font-semibold">Craft it. Sign it. Prove it on-chain.</span>
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
          Your words, forever verifiable.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <CustomConnectButton />
          <a
            href="#come-funziona"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
          >
            See how it works
          </a>
        </div>

        {/* Highlights */}
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "⛓️", title: "Roots on Base", desc: "Public events, no texts/PII on-chain" },
            { icon: "✍️", title: "Auto-signing", desc: "AI chat or manual content, everything notarized." },
            { icon: "🔏", title: "Private checks", desc: "Semantic comparisons privacy-preserving (FHE-ready)." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5">
              <div className="text-2xl">{c.icon}</div>
              <h3 className="mt-2 text-base font-semibold text-white">{c.title}</h3>
              <p className="text-sm text-gray-300">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   ABOUT
=========================== */
function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-gray-950/40 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            A tamper-evident truth layer for every message
          </h2>
          <p className="mx-auto mt-3 text-base text-gray-300 sm:text-lg">
            AI speeds up creation and remix. With PAN you can prove <span className="font-semibold text-white">who authored what</span>, <span className="font-semibold text-white">if and how it changed</span>, and whether two texts <span className="font-semibold text-white">mean the same</span>.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { title: "Open standard", desc: "Public normalization & hashing rules; SDK & CLI." },
            { title: "Event-only on-chain", desc: "Only Merkle roots are public. Transparency without exposure." },
            { title: "Privacy by design", desc: "No plaintext on the server. FHE add-on path ready (ZK optional in the future)." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   HOW IT WORKS
=========================== */
function How() {
  const [tab, setTab] = useState<"chat" | "sign" | "verify">("chat");
  return (
    <section id="come-funziona" className="scroll-mt-24 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl mt-4">How it works</h2>
        {/* Tabs */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {(["chat", "sign", "verify"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                tab === t
                  ? "bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 text-gray-900"
                  : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
              }`}
            >
              {t === "chat" ? "💬 AI Chat" : t === "sign" ? "✍️ Notarize content" : "✅ Verify"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {tab === "chat" && (
            <div className="space-y-2 text-gray-300 sm:space-y-3">
              <h3 className="text-xl font-bold text-white sm:text-2xl">AI Chat (multi-model) with auto-signing</h3>
              <ul className="list-disc pl-5 text-sm sm:text-base">
                <li>Pick a model or use smart routing.</li>
                <li>Each message is normalized, hashed and added to the session Merkle.</li>
                <li><span className="font-semibold text-white">Finalize</span> publishes the root on Base (public event).</li>
                <li>Copy the message badge from the “three dots”.</li>
              </ul>
            </div>
          )}
          {tab === "sign" && (
            <div className="space-y-2 text-gray-300 sm:space-y-3">
              <h3 className="text-xl font-bold text-white sm:text-2xl">Notarize any content (no AI)</h3>
              <ul className="list-disc pl-5 text-sm sm:text-base">
                <li>Paste text or upload a file: client-side encryption (AES-GCM) + binding hash.</li>
                <li>Get the <span className="font-semibold text-white">Creator Badge</span> and history in the sidebar.</li>
                <li>Optional: signed metadata (author/model/timestamp) in the session.</li>
              </ul>
            </div>
          )}
          {tab === "verify" && (
            <div className="space-y-2 text-gray-300 sm:space-y-3">
              <h3 className="text-xl font-bold text-white sm:text-2xl">Exact or same-meaning verification</h3>
              <ul className="list-disc pl-5 text-sm sm:text-base">
                <li><span className="font-semibold text-white">Hash-only</span>: proof of existence/integrity via Merkle root.</li>
                <li><span className="font-semibold text-white">Hash + text</span>: exact / minor edits / partial / different. Optional privacy-preserving comparison using encrypted summaries (FHE).</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   TOKEN DYNAMICS (NEW)
=========================== */
function TokenDynamics() {
  return (
    <section id="token-dynamics" className="scroll-mt-24 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Token Dynamics</h2>
        <p className="mx-auto mt-2 max-w-3xl text-center text-sm text-gray-300 sm:text-base">
          Two tokens power the network: <span className="font-semibold text-white">PANAI (ERC-20)</span> for utility/rewards and <span className="font-semibold text-white">PanSoul (SBT NFT)</span> for reputation. Rewards are earned for honest, useful notarization and reduced for spam or abuse.
        </p>

        <div className="mt-8 flex flex-col gap-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">PANAI — Utility & Rewards</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-300">
              <li><span className="text-white font-semibold">Earn</span>: on <em>Finalize</em>, based on unique messages notarized and later verified (deduped per hash/session).</li>
              <li><span className="text-white font-semibold">Claim</span>: pending rewards accrue off-chain and can be claimed on-chain; gasless meta-tx planned.</li>
              <li><span className="text-white font-semibold">Anti-abuse</span>: zero reward for duplicates, bot-like bursts, or failed proofs; cooldown on repeated offenses.</li>
              <li><span className="text-white font-semibold">Costs</span>: AI-assisted aggregation makes notarization near-zero cost for users.</li>
            </ul>
            <div className="flex justify-center mt-6">
              <img src="/chartpanai.png" alt="PANAI Token Diagram" style={{maxHeight:'320px'}} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-base font-semibold text-white">PanSoul — Reputation (SBT)</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-300">
              <li><span className="text-white font-semibold">Increase</span>: when your content is verified by others, or referenced in certified sessions.</li>
              <li><span className="text-white font-semibold">Decay / Slash</span>: reports confirmed, mass spam, or fraudulent attestations reduce score; NFT metadata is updated on-chain.</li>
              <li><span className="text-white font-semibold">Fairness</span>: daily caps per wallet, similarity-based dedupe, optional identity signals (ENS/Civic) to limit sybil.</li>
              <li><span className="text-white font-semibold">Transparency</span>: all updates are emitted as events; appeals window for disputes.</li>
            </ul>
            <div className="flex justify-center mt-6">
              <img src="/chartsoul.png" alt="PanSoul Token Diagram" style={{maxHeight:'320px'}} />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 sm:text-sm">
          Future: optional <span className="text-white font-semibold">ZK add-on</span> for private exact-match proofs (when feasible). Governance for emissions/decay is planned post-MVP.
        </div>
      </div>
    </section>
  );
}

/* ===========================
   PRODUCT (Features)
=========================== */
function GradientCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="relative rounded-2xl p-[1px] min-h-[220px] flex flex-col justify-center">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-cyan-300/30 to-emerald-300/30 blur-sm" />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex flex-col items-center justify-center h-full">
        <div className="text-xl sm:text-2xl mb-1">{icon}</div>
        <h3 className="text-sm font-semibold text-white sm:text-base text-center mb-1">{title}</h3>
        <p className="text-xs text-gray-300 sm:text-sm text-center leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function Features() {
  const blocks = [
    { icon: "🧩", title: "Batch notarization", desc: "Sign entire conversations with one on-chain event." },
    { icon: "🏷️", title: "Badges & certificates", desc: "Shareable manifest/ZIP, publicly verifiable." },
    { icon: "🔎", title: "Verify anywhere", desc: "Web, CLI or API: same proofs, same results." },
    { icon: "🔒", title: "Privacy-first", desc: "Only encrypted blobs and minimal metadata. No plaintext server-side." },
    { icon: "🧪", title: "Deterministic", desc: "Public normalization/hash rules with cross-platform tests." },
    { icon: "🧾", title: "Auditable", desc: "RootSigned events on Base; reproducible proofs." },
    { icon: "⚙️", title: "Modern stack", desc: "Next.js, Fastify, viem/wagmi, Postgres, S3/IPFS." },
    { icon: "🤖", title: "OpenRouter", desc: "Multi-model with smart routing." },
    { icon: "🧠", title: "FHE-ready", desc: "Private similarity checks via encrypted summaries. (ZK possible in future.)" },
  ];
  return (
    <section id="features" className="scroll-mt-24 bg-gray-950 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-center mb-8">
          <img src="/chart.png" alt="PAN schema" style={{maxHeight:'700px'}} />
        </div>
        <TokenDynamics />
        <h2 className="text-3xl font-bold text-white mt-16 mb-6">Product</h2>
        <p className="mt-1 max-w-3xl text-sm text-gray-300 sm:text-base mb-8">
          Notarize content, anchor roots on Base, and verify anywhere. Privacy by design, open APIs and a clear path to private comparisons with FHE.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((b) => (
            <GradientCard key={b.title} icon={b.icon} title={b.title} desc={b.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   USE CASES
=========================== */
function UseCases() {
  const cases = [
    { t: "Media & Journalism", d: "Integrity/alteration proofs, debunking, editorial chains." },
    { t: "Legal & Compliance", d: "Verifiable attestations without sharing plaintext." },
    { t: "UGC Platforms", d: "Anti-plagiarism/abuse with public checks and reputation badges." },
    { t: "Research & AI Labs", d: "Dataset/prompt provenance and audit trails." },
    { t: "Software", d: "Notarize commits/snippets; proofs on releases/binaries." },
    { t: "Enterprise", d: "Policy-grade notarization for documents, email and contracts." },
  ];
  return (
    <section id="usecases" className="scroll-mt-24 bg-gray-950/40 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-white">Use Cases</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <div key={c.t} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-white sm:text-base">{c.t}</h3>
              <p className="mt-2 text-xs text-gray-300 sm:text-sm">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   ROADMAP (ZK only as future)
=========================== */
function Roadmap() {
  const items: {
    when: string;
    color: "indigo" | "cyan" | "emerald" | "violet" | "rose";
    title: string;
    points: string[];
  }[] = [
    {
      when: "Now (MVP)",
      color: "indigo",
      title: "Protocol foundation live",
      points: [
        "Mini-App: Chat, Sign, Verify (exact with hash) — live",
        "Merkle roots on Base Sepolia (RootSigned events)",
        "Client-side encryption; no plaintext on server",
        "Verify CLI + SDK (hashing/frames documented)",
      ],
    },
    {
      when: "Next 30 days",
      color: "cyan",
      title: "Open spec & verifiable profiles",
      points: [
        "PAN v1 spec + test vectors (NFC/CRLF, even/odd, batch)",
        "Profiles with PANAI rewards & PanSoul reputation (testnet)",
        "ENS reverse + “Verified with PAN” certificates",
      ],
    },
    {
      when: "60–90 days",
      color: "emerald",
      title: "Mainnet & useful partners",
      points: [
        "Base Mainnet: Registry v1 + RewardsDistributor",
        "1inch API integration for metadata/balances in profile",
        "FHE pilot (Zama): private near-duplicate/partial checks",
      ],
    },
    {
      when: "Q3",
      color: "violet",
      title: "From draft to adoption",
      points: [
        "Public “PAN Core” draft (community/partner feedback)",
        "Provider Kit: SDK for third-party platforms (publish/verify, no lock-in)",
        "Base mini-app + PanSoul leaderboard",
      ],
    },
    {
      when: "Q4",
      color: "rose",
      title: "Standard 1.0 + privacy extras",
      points: [
        "PAN 1.0: spec freeze + reference implementation",
        "Optional ZK add-on for private exact-match (when feasible)",
        "Interoperability program: providers/models signing PAN",
      ],
    },
  ];

  const dotColor = {
    indigo: "bg-indigo-400 ring-indigo-400/30",
    cyan: "bg-cyan-300 ring-cyan-300/30",
    emerald: "bg-emerald-300 ring-emerald-300/30",
    violet: "bg-violet-300 ring-violet-300/30",
    rose: "bg-rose-300 ring-rose-300/30",
  } as const;

  return (
    <section id="roadmap" className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-white">Roadmap</h2>
        <p className="mt-2 max-w-3xl text-sm text-gray-300 sm:text-base">
          Concrete steps toward an <span className="font-semibold text-white">open notarization standard</span> for human and AI content, anchored on Base and verifiable by anyone.
        </p>

        {/* Line + dots */}
        <div className="relative mt-8 sm:mt-10">
          <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-gradient-to-b from-indigo-400/40 via-cyan-300/30 to-emerald-300/30" />
          <ol className="space-y-6 sm:space-y-8">
            {items.map((it) => (
              <li key={it.when} className="relative pl-12">
                <span
                  className={`absolute left-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full ${dotColor[it.color]} ring-8 ring-gray-950`}
                  aria-hidden
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                </span>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                  <div className="mb-1 text-[11px] uppercase tracking-wide text-gray-400 sm:text-xs">{it.when}</div>
                  <h3 className="text-base font-semibold text-white sm:text-lg">{it.title}</h3>
                  <ul className="mt-2 list-disc pl-5 text-xs text-gray-300 sm:text-sm">
                    {it.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 sm:text-sm">
          <span className="font-semibold text-white">In practice:</span> today you can sign and verify with just the hash. Next we add profiles, rewards and private checks; by PAN 1.0 it becomes an open, interoperable standard for platforms and AI models.
        </div>
      </div>
    </section>
  );
}

/* ===========================
   FAQ
=========================== */
function FAQ() {
  const qs = [
    { q: "Do you store content?", a: "No. Only hashes/metadata and pointers to client-side encrypted blobs. No plaintext server-side." },
    { q: "What goes on-chain?", a: "Only Merkle roots (session/batch). No text or PII." },
    { q: "Can I verify with just the hash?", a: "Yes. Lookup → inclusion proof → root → event on Base." },
    { q: "What if the text slightly changes?", a: "Compact summaries (SimHash/Bloom) and optional privacy-preserving comparison (FHE)." },
  ];
  return (
    <section id="faq" className="scroll-mt-24 bg-gray-950/40 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-bold text-white">FAQ</h2>
        <div className="mt-6 space-y-3">
          {qs.map((x) => (
            <details key={x.q} className="group rounded-xl border border-white/10 bg-white/5 p-5">
              <summary className="cursor-pointer select-none text-base font-semibold text-white marker:hidden">
                {x.q}
              </summary>
              <p className="mt-2 text-sm text-gray-300">{x.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   CTA
=========================== */
function CTA() {
  return (
    <section id="cta" className="relative scroll-mt-24 overflow-hidden py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,91,255,.18),rgba(0,0,0,0))] blur-2xl" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <h2 className="bg-gradient-to-r from-indigo-200 via-cyan-100 to-emerald-200 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl md:text-4xl">
          Notarize your first message
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">
          One click for proof of existence. One event for history. One verification for everyone.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <CustomConnectButton />
          <a
            href="/docs"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
          >
            Docs & SDK
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   PAGE
=========================== */
export default function PreviewPage() {
  // Redirect to / when the user connects
  useAuthRedirect();

  return (
    <div className="min-h-screen scroll-smooth bg-gray-950 text-white antialiased">
      <Header />
      <main>
        <Hero />
        <About />
  <How />
  <Features />
        <UseCases />
        <Roadmap />
        <FAQ />
        <CTA />
      </main>
      <footer className="border-t border-white/10 py-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} PAN — Protocol for AI Notarization
      </footer>
    </div>
  );
}