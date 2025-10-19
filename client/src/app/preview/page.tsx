"use client";
import { useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuth";
import { ConnectKitButton } from "connectkit";

/* ===========================
   NAV
=========================== */
const nav = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "come-funziona", label: "Come funziona" },
  { id: "features", label: "Prodotto" },
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
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gray-950/70 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6" aria-label="Global">
        {/* Logo */}
        <a href="#hero" className="group inline-flex items-center gap-3">
          <div className="size-8 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 shadow-md shadow-indigo-700/20" />
          <span className="text-base font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              PAN
            </span>
            <span className="ml-1 text-gray-300 hidden sm:inline">— Protocol for AI Notarization</span>
          </span>
        </a>

        {/* Desktop nav - visibile solo su schermi grandi */}
        <div className="hidden lg:flex items-center gap-1">
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

        {/* Mobile - solo Connect Wallet */}
        <div className="lg:hidden">
          <CustomConnectButton />
        </div>
      </nav>
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
          Certifica l'AI. <span className="whitespace-nowrap">Verifica la realtà.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
          PAN è lo strato di <span className="text-white font-semibold">provenance</span> per ogni messaggio:
          normalizza, <span className="font-semibold">hash → Merkle → root on-chain</span>, certifica e verifica — anche
          senza rivelare il contenuto.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <CustomConnectButton />
          <a
            href="#come-funziona"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
          >
            Scopri come funziona
          </a>
        </div>

        {/* Highlights */}
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "⛓️", title: "Radici su Base", desc: "Eventi pubblici, mai testi/PII on-chain." },
            { icon: "✍️", title: "Firma automatica", desc: "Chat AI o contenuti manuali, tutto notarizzato." },
            { icon: "🔏", title: "Verifica privata", desc: "Confronti semantici privacy-preserving (FHE-ready)." },
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
    <section id="about" className="scroll-mt-24 bg-gray-950/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            La fotografia della verità, per ogni messaggio
          </h2>
          <p className="mx-auto mt-3 text-base text-gray-300 sm:text-lg">
            L'AI accelera tutto: creazione, remix, diffusione. Con PAN puoi dimostrare{" "}
            <span className="font-semibold text-white">chi ha scritto cosa</span>,{" "}
            <span className="font-semibold text-white">se e come è cambiato</span>, e se due testi{" "}
            <span className="font-semibold text-white">dicono la stessa cosa</span>.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { title: "Standard aperto", desc: "Normalizzazione e hashing pubblici; SDK & CLI." },
            { title: "Event-only on-chain", desc: "Pubbliche solo le root Merkle. Trasparenza senza esporre." },
            { title: "Privacy by design", desc: "Il backend non vede plaintext. FHE/ZK pronti come add-on." },
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
   COME FUNZIONA
=========================== */
function How() {
  const [tab, setTab] = useState<"chat" | "sign" | "verify">("chat");
  return (
    <section id="come-funziona" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Come funziona</h2>
        <p className="mx-auto mt-2 max-w-3xl text-center text-sm text-gray-300 sm:text-base">
          Pipeline deterministica: <span className="font-semibold">Unicode NFC + LF</span> →{" "}
          <span className="font-semibold">SHA-256</span> → <span className="font-semibold">Merkle per sessione</span> →{" "}
          <span className="font-semibold">root on-chain</span>. Verifica con hash-only o check semantico.
        </p>

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
              {t === "chat" ? "💬 AI Chat" : t === "sign" ? "✍️ Signa contenuto" : "✅ Verifica"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {tab === "chat" && (
            <div className="space-y-2 text-gray-300 sm:space-y-3">
              <h3 className="text-xl font-bold text-white sm:text-2xl">AI Chat (multi-modello) con firma automatica</h3>
              <ul className="list-disc pl-5 text-sm sm:text-base">
                <li>Scegli il modello o usa il routing intelligente.</li>
                <li>Ogni messaggio viene normalizzato, hashato e inserito nel Merkle della sessione.</li>
                <li>Con <span className="font-semibold text-white">Finalize</span> pubblichi la root su Base (evento pubblico).</li>
                <li>Badge del messaggio dai "3 puntini" accanto alla bubble.</li>
              </ul>
            </div>
          )}
          {tab === "sign" && (
            <div className="space-y-2 text-gray-300 sm:space-y-3">
              <h3 className="text-xl font-bold text-white sm:text-2xl">Signa qualsiasi contenuto (senza AI)</h3>
              <ul className="list-disc pl-5 text-sm sm:text-base">
                <li>Incolla testo o carica un file: cifratura client-side (AES-GCM) + hash vincolante.</li>
                <li>Ricevi il <span className="font-semibold text-white">Badge creatore</span> e lo storico nel pannello laterale.</li>
                <li>Opzionale: metadati (autore/modello/ts) firmati nella sessione.</li>
              </ul>
            </div>
          )}
          {tab === "verify" && (
            <div className="space-y-2 text-gray-300 sm:space-y-3">
              <h3 className="text-xl font-bold text-white sm:text-2xl">Verifica esatta o "stesso significato"</h3>
              <ul className="list-disc pl-5 text-sm sm:text-base">
                <li><span className="font-semibold text-white">Solo hash</span>: prova di esistenza/integrità via root on-chain.</li>
                <li>
                  <span className="font-semibold text-white">Hash + testo</span>: esatto / piccoli edit / parziale / diverso.
                  Opzionale: confronto privacy-preserving con riassunti cifrati (FHE).
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   PRODOTTO (Caratteristiche + Fiducia + Tech)
=========================== */
function GradientCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="relative rounded-2xl p-[1px]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-cyan-300/30 to-emerald-300/30 blur-sm" />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="text-xl sm:text-2xl">{icon}</div>
        <h3 className="mt-2 text-sm font-semibold text-white sm:text-base">{title}</h3>
        <p className="text-xs text-gray-300 sm:text-sm">{desc}</p>
      </div>
    </div>
  );
}

function Features() {
  const blocks = [
    { icon: "🧩", title: "Batch notarization", desc: "Firma conversazioni intere con un solo evento." },
    { icon: "🏷️", title: "Badge & certificati", desc: "ZIP/manifest verificabili, pronti da condividere." },
    { icon: "🔎", title: "Verify ovunque", desc: "Web, CLI o API: stessa prova, stessi risultati." },
    { icon: "🔒", title: "Privacy-first", desc: "Solo blob cifrati e metadati minimi. Nessun plaintext sul server." },
    { icon: "🧪", title: "Determinismo", desc: "Regole pubbliche di normalizzazione/hash e test cross-platform." },
    { icon: "🧾", title: "Verificabilità", desc: "Eventi RootSigned su Base; prove riproducibili." },
    { icon: "⚙️", title: "Stack moderno", desc: "Next.js, Fastify, viem/wagmi, Postgres, S3/IPFS." },
    { icon: "🤖", title: "OpenRouter", desc: "Multi-modello + routing intelligente." },
    { icon: "🧠", title: "FHE/ZK ready", desc: "Percorso chiaro per confronti confidenziali e prove zero-knowledge." },
  ];
  return (
    <section id="features" className="scroll-mt-24 bg-gray-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-bold text-white">Prodotto</h2>
          <div className="hidden items-center gap-2 text-[11px] text-gray-400 sm:flex">
            {["Base", "OpenRouter", "Civic", "Zama", "ENS", "1inch"].map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-2 max-w-3xl text-sm text-gray-300 sm:text-base">
          Notarizza contenuti, pubblica radici su Base, verifica ovunque. Privacy by design, API aperte e upgrade path
          verso FHE/ZK.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((b) => (
            <GradientCard key={b.title} icon={b.icon} title={b.title} desc={b.desc} />
          ))}
        </div>

        {/* Strip on-chain */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-[11px] text-gray-300 sm:text-xs">
          onchain: base-sepolia • contract: Registry • event: RootSigned(root=<span className="text-emerald-300">0x…ab</span>, author=<span className="text-emerald-300">0x…9f</span>, kind="session", version=1, ts=1712345678)
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
    { t: "Media & Giornalismo", d: "Prove di integrità/alterazione, debunk e catene editoriali." },
    { t: "Legale & Compliance", d: "Attestazioni verificabili senza condividere il plaintext." },
    { t: "Piattaforme UGC", d: "Anti-plagio/abuso con verifiche pubbliche e badge reputazione." },
    { t: "Ricerca & AI Labs", d: "Provenance di dataset/prompt e audit dei risultati." },
    { t: "Software", d: "Notarizza commit/snippet; prove su release/binari." },
    { t: "Impresa", d: "Policy-grade notarization per documenti, email e contratti." },
  ];
  return (
    <section id="usecases" className="scroll-mt-24 bg-gray-950/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-white">Casi d'uso</h2>
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
   ROADMAP (fix pallini + copy chiaro)
=========================== */
function Roadmap() {
  const items: {
    when: string;
    color: "indigo" | "cyan" | "emerald" | "violet" | "rose";
    title: string;
    points: string[];
  }[] = [
    {
      when: "Ora (MVP)",
      color: "indigo",
      title: "Online la base del protocollo",
      points: [
        "Mini-App: Chat, Sign, Verify (exact con hash) — live",
        "Root Merkle pubbliche su Base Sepolia (eventi RootSigned)",
        "Storage cifrato client-side; nessun plaintext sul server",
        "Verify CLI + SDK (regole di hashing/frames documentate)",
      ],
    },
    {
      when: "Prossimi 30 giorni",
      color: "cyan",
      title: "Spec aperta e profili verificabili",
      points: [
        "Spec PAN v1 (open) + test vectors (NFC/CRLF, pari/dispari, batch)",
        "Profili con PAN & PanSoul (SBT reputazione) + Rewards (testnet)",
        "ENS reverse + badge 'Verificato con PAN' nei certificati",
      ],
    },
    {
      when: "60–90 giorni",
      color: "emerald",
      title: "Mainnet & partner utili",
      points: [
        "Base Mainnet: Registry v1 + RewardsDistributor",
        "Integrazione 1inch API per metadati/balances nel profilo",
        "Pilot FHE (Zama): confronto privato per near-duplicate/partial",
      ],
    },
    {
      when: "Q3",
      color: "violet",
      title: "Dallo standard draft all'adozione",
      points: [
        "Draft 'PAN Core' pubblico (call per feedback community/partners)",
        "Provider Kit: SDK per piattaforme terze (publish/verify senza lock-in)",
        "Mini-App Social su Base + leaderboard reputazione PanSoul",
      ],
    },
    {
      when: "Q4",
      color: "rose",
      title: "Standard 1.0 + privacy avanzata",
      points: [
        "PAN 1.0: freeze della spec + reference implementation",
        "ZK add-on: exact-match privata (senza rivelare il testo)",
        "Programma interoperabilità: provider/modelli che firmano PAN",
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
    <section id="roadmap" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-white">Roadmap</h2>
        <p className="mt-2 max-w-3xl text-sm text-gray-300 sm:text-base">
          Passi concreti verso uno <span className="font-semibold text-white">standard aperto</span> di notarizzazione
          dei contenuti (umani o AI) con ancoraggio su Base, verificabile da chiunque.
        </p>

        {/* Linea + pallini allineati */}
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
          <span className="font-semibold text-white">In pratica:</span> oggi firmi e verifichi con l'hash. Nei prossimi
          rilasci aggiungiamo profili, reputazione e verifiche private; a fine percorso, "PAN 1.0" sarà uno standard
          adottabile da piattaforme e modelli AI per firmare/verificare in modo interoperabile.
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
    { q: "Salvate i contenuti?", a: "No. Solo hash/metadati e puntatori a blob cifrati lato client. Nessun plaintext sul server." },
    { q: "Cosa va on-chain?", a: "Solo eventi con le root Merkle di sessione/batch. Nessun testo o PII." },
    { q: "Posso verificare con il solo hash?", a: "Sì. Lookup → prova di inclusione → root → evento su Base." },
    { q: "E se il testo cambia poco?", a: "Riassunti compatti (SimHash/Bloom) e, opzionalmente, FHE per confronto privato." },
  ];
  return (
    <section id="faq" className="scroll-mt-24 bg-gray-950/40 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-bold text-white">Domande frequenti</h2>
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
    <section id="cta" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,91,255,.18),rgba(0,0,0,0))] blur-2xl" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <h2 className="bg-gradient-to-r from-indigo-200 via-cyan-100 to-emerald-200 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl md:text-4xl">
          Notarizza il tuo primo messaggio in 30 secondi
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">
          Un click per la prova di esistenza. Un evento per la storia. Una verifica per tutti.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <CustomConnectButton />
          <a
            href="/docs"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
          >
            Doc API/SDK
          </a>
        </div>
        <p className="mt-5 text-[11px] text-gray-400 sm:text-xs">
          Protocollo: hashing/Merkle • Chain: Base • SDK/CLI: @panai/* • Privacy: FHE-ready
        </p>
      </div>
    </section>
  );
}

/* ===========================
   PAGE
=========================== */
export default function PreviewPage() {
  // Questo hook gestisce il redirect automatico a / quando l'utente si connette
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
