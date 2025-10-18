"use client";
import { useState } from "react";

export default function HowSection() {
  const [activeTab, setActiveTab] = useState<"chat" | "sign" | "verify">("chat");

  return (
    <section id="come-funziona" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Come funziona
        </h2>
        <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Tre modalità in un'unica interfaccia: AI Chat, Signa contenuto, Verifica. Sotto il cofano: <span className="text-green-400">Unicode NFC + LF, SHA-256, Merkle per sessione, root on-chain</span>.
        </p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "chat"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            💬 AI Chat
          </button>
          <button
            onClick={() => setActiveTab("sign")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "sign"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            ✍️ Signa contenuto
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "verify"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            ✅ Verifica
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8">
          {activeTab === "chat" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Tab 1 — AI Chat (multi-modello, con firma automatica)</h3>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  <span className="font-semibold text-white">Come GPT:</span> scegli il modello dal dropdown (o "Smart routing") e chatta.
                </p>
                <p>
                  <span className="font-semibold text-white">Firma automatica:</span> ogni messaggio (tuo e del modello) viene hashato e aggiunto al Merkle della sessione.
                </p>
                <p>
                  <span className="font-semibold text-white">Finalize:</span> con un clic, pubblichi la radice su Base (evento on-chain).
                </p>
                <p>
                  <span className="font-semibold text-white">Badge messaggio:</span> dai tre puntini accanto a ogni messaggio → "Copia badge" con hash, timestamp, sessione.
                </p>
              </div>

              <div className="mt-6 bg-gray-800/50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold mb-2 text-white">Microcopy UI</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Bottone: <span className="text-green-400">Nuova chat</span></li>
                  <li>• Dropdown: <span className="text-green-400">Modello (Auto / GPT / Llama / …)</span></li>
                  <li>• Tooltip (3 puntini): <span className="text-green-400">"Copia il badge (hash certificato) del messaggio."</span></li>
                  <li>• CTA sessione: <span className="text-green-400">Finalize & Publish (radice su Base)</span></li>
                </ul>
              </div>

              <div className="mt-6 bg-gray-800/50 p-4 rounded">
                <h4 className="font-semibold mb-2 text-white">Esempio Badge</h4>
                <pre className="text-xs text-green-400 font-mono">
{`PAN Badge — msg
hash: 0xABCD…1234
session: 7f2a…e9
ts: 2025-10-18T12:03Z`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "sign" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Tab 2 — Signa un contenuto (senza AI)</h3>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  Incolla un testo o carica un file.
                </p>
                <p>
                  Il contenuto viene cifrato lato client (AES-GCM, AAD = contentHash) e salvato come blob cifrato.
                </p>
                <p>
                  Ottieni il <span className="font-semibold text-white">Badge del creatore</span>; il contenuto entra nella tua storia (sidebar sinistra).
                </p>
              </div>

              <div className="mt-6 bg-gray-800/50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold mb-2 text-white">Microcopy UI</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Campo: <span className="text-green-400">"Incolla qui il tuo testo" / "Carica file"</span></li>
                  <li>• Checkbox: <span className="text-green-400">"Aggiungi alla mia storia"</span></li>
                  <li>• Bottone: <span className="text-green-400">Signa & ottieni badge</span></li>
                  <li>• Toast: <span className="text-green-400">"Contenuto certificato. Badge copiato."</span></li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "verify" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Tab 3 — Verifica</h3>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  <span className="font-semibold text-white">Solo hash →</span> esito Exact/On-chain con link alla tx su Base.
                </p>
                <p>
                  <span className="font-semibold text-white">Hash + testo →</span> oltre a exact/no, facciamo:
                </p>
                <ul className="ml-6 space-y-1">
                  <li>• Edit minori → <span className="text-yellow-400">Near-duplicate</span></li>
                  <li>• Stesso significato → <span className="text-blue-400">Same meaning</span></li>
                  <li>• Non corrisponde → <span className="text-red-400">No match</span></li>
                </ul>
              </div>

              <div className="mt-6 bg-gray-800/50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold mb-2 text-white">Microcopy UI</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Campo 1: <span className="text-green-400">"Incolla l'hash (0x…)"</span></li>
                  <li>• Campo 2 (opzionale): <span className="text-green-400">"Incolla il contenuto"</span></li>
                  <li>• Bottone: <span className="text-green-400">Verifica</span></li>
                  <li>• Esiti: <span className="text-green-400">✅ Esatto / 🟡 Editato / 🔵 Stesso significato / ❌ Non corrisponde</span></li>
                  <li>• Link: <span className="text-green-400">Vedi evento su Base</span></li>
                </ul>
              </div>

              <div className="mt-6 bg-yellow-900/20 border border-yellow-700/50 p-4 rounded">
                <p className="text-sm text-yellow-200">
                  <span className="font-semibold">Nota Privacy:</span> La verifica esatta usa gli hash (nessun testo salvato). Se incolli un testo per la verifica semantica, il confronto avviene senza memorizzare il plaintext.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
