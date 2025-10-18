"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MainHeader from "@/components/MainHeader";

interface VerificationResult {
  found: boolean;
  hash: string;
  content?: string;
  type?: "text" | "file" | "chat";
  timestamp?: Date;
  txHash?: string;
  status?: "confirmed" | "pending" | "failed";
  blockNumber?: number;
  notarizedBy?: string;
}

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const hashFromUrl = searchParams?.get("hash") || "";
  
  const [hash, setHash] = useState(hashFromUrl);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [activeTab, setActiveTab] = useState<"hash" | "file">("hash");

  // Se c'è un hash nell'URL, verifica automaticamente
  useEffect(() => {
    if (hashFromUrl) {
      handleVerifyHash(hashFromUrl);
    }
  }, [hashFromUrl]);

  const handleVerifyHash = async (hashToVerify?: string) => {
    const targetHash = hashToVerify || hash;
    if (!targetHash.trim()) return;

    setIsVerifying(true);

    // TODO: Implementare verifica reale su Base blockchain
    // Payload da inviare all'API:
    // {
    //   hash: targetHash,
    //   text: text || undefined  // Campo opzionale
    // }
    // L'API può usare il testo per:
    // 1. Validare che l'hash corrisponda al testo fornito
    // 2. Fornire informazioni aggiuntive
    // 3. Verificare l'integrità del contenuto

    console.log('Verifica con:', { hash: targetHash, text: text || null });

    // Simulazione
    setTimeout(() => {
      // Simula che alcuni hash esistono
      const exists = Math.random() > 0.3;
      
      if (exists) {
        setResult({
          found: true,
          hash: targetHash,
          content: text || "Documento di esempio notarizzato",
          type: "text",
          timestamp: new Date(Date.now() - Math.random() * 10000000000),
          txHash: "0x" + Math.random().toString(16).substring(2, 66),
          status: "confirmed",
          blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
          notarizedBy: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        });
      } else {
        setResult({
          found: false,
          hash: targetHash,
        });
      }

      setIsVerifying(false);
    }, 2000);
  };

  const handleVerifyFile = async () => {
    if (!file) return;

    setIsVerifying(true);

    // TODO: Implementare verifica file
    // 1. Calcolare hash del file
    // 2. Verificare l'hash on-chain

    setTimeout(() => {
      const fileHash = "0x" + Math.random().toString(16).substring(2, 66);
      const exists = Math.random() > 0.5;

      if (exists) {
        setResult({
          found: true,
          hash: fileHash,
          content: file.name,
          type: "file",
          timestamp: new Date(Date.now() - Math.random() * 10000000000),
          txHash: "0x" + Math.random().toString(16).substring(2, 66),
          status: "confirmed",
          blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
          notarizedBy: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        });
      } else {
        setResult({
          found: false,
          hash: fileHash,
        });
      }

      setIsVerifying(false);
    }, 2000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <MainHeader />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Verifica Contenuto
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Controlla se un contenuto è stato notarizzato sulla blockchain Base
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 gap-4">
            <button
              onClick={() => setActiveTab("hash")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "hash"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              🔍 Verifica per Hash/Testo
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              📄 Verifica File
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 mb-8">
              {activeTab === "hash" ? (
                <div className="space-y-6">
                  {/* Hash Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Inserisci Hash del Contenuto
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        placeholder="0x..."
                        className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 font-mono text-sm"
                      />
                      <button
                        onClick={() => handleVerifyHash()}
                        disabled={isVerifying || !hash.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition flex items-center gap-2 whitespace-nowrap"
                      >
                        {isVerifying ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Verifica...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Verifica
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    </div>
                  </div>

                  {/* Text Input - Optional */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Testo Originale <span className="text-xs text-gray-500 font-normal">(opzionale)</span>
                    </label>
                    <p className="text-xs text-gray-400 mb-3">
                      Se fornisci il testo originale, verificheremo anche che corrisponda all'hash
                    </p>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Inserisci il testo originale per una verifica più completa..."
                      rows={6}
                      className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Carica File da Verificare
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4">
                    <input
                      type="file"
                      id="verify-file-upload"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="verify-file-upload" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-lg mb-2">
                        {file ? file.name : "Clicca per caricare un file"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Caricheremo il file, calcoleremo il suo hash e verificheremo
                      </p>
                    </label>
                  </div>
                  <button
                    onClick={handleVerifyFile}
                    disabled={isVerifying || !file}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Calcolo hash e verifica...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verifica File
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Come funziona la verifica
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {activeTab === "hash" && (
                    <>
                      <li>• Inserisci l'hash del contenuto da verificare (obbligatorio)</li>
                      <li>• Opzionalmente, fornisci anche il testo originale</li>
                      <li>• Se fornisci il testo, verificheremo che corrisponda all'hash</li>
                      <li>• Controlliamo se l'hash esiste sulla blockchain Base</li>
                    </>
                  )}
                  {activeTab === "file" && (
                    <>
                      <li>• Carica il file originale da verificare</li>
                      <li>• Calcoliamo automaticamente l'hash del file</li>
                      <li>• Verifichiamo se l'hash è presente on-chain</li>
                    </>
                  )}
                  <li>• Mostriamo i dettagli della notarizzazione se trovata</li>
                  <li>• Puoi verificare data, ora e autore della notarizzazione</li>
                </ul>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className={`rounded-xl p-8 border-2 ${
                result.found 
                  ? "bg-green-900/20 border-green-700" 
                  : "bg-red-900/20 border-red-700"
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  {result.found ? (
                    <>
                      <div className="bg-green-600 rounded-full p-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-green-400">✓ Contenuto Verificato</h2>
                        <p className="text-gray-300">Questo contenuto è stato notarizzato su Base blockchain</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-600 rounded-full p-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-red-400">✗ Contenuto Non Trovato</h2>
                        <p className="text-gray-300">Questo contenuto non risulta notarizzato</p>
                      </div>
                    </>
                  )}
                </div>

                {result.found && (
                  <div className="space-y-4">
                    {/* Content Info */}
                    {result.content && (
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-400 uppercase">Contenuto</span>
                          <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-400 rounded">
                            {result.type === "text" && "📝 Testo"}
                            {result.type === "file" && "📄 File"}
                            {result.type === "chat" && "💬 Chat"}
                          </span>
                        </div>
                        <p className="text-gray-200">{result.content}</p>
                      </div>
                    )}

                    {/* Hash */}
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-400 uppercase">Content Hash</span>
                        <button
                          onClick={() => copyToClipboard(result.hash)}
                          className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
                        >
                          📋 Copia
                        </button>
                      </div>
                      <code className="text-green-400 text-sm block break-all font-mono">
                        {result.hash}
                      </code>
                    </div>

                    {/* Transaction */}
                    {result.txHash && (
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-400 uppercase">Transaction Hash</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(result.txHash!)}
                              className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
                            >
                              📋 Copia
                            </button>
                            <a
                              href={`https://basescan.org/tx/${result.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded transition"
                            >
                              🔗 BaseScan
                            </a>
                          </div>
                        </div>
                        <code className="text-blue-400 text-sm block break-all font-mono">
                          {result.txHash}
                        </code>
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.timestamp && (
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <span className="text-sm font-semibold text-gray-400 uppercase block mb-2">Data Notarizzazione</span>
                          <p className="text-gray-200">
                            {result.timestamp.toLocaleDateString("it-IT", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {result.timestamp.toLocaleTimeString("it-IT")}
                          </p>
                        </div>
                      )}

                      {result.blockNumber && (
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <span className="text-sm font-semibold text-gray-400 uppercase block mb-2">Block Number</span>
                          <p className="text-gray-200 font-mono">#{result.blockNumber.toLocaleString()}</p>
                        </div>
                      )}

                      {result.status && (
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <span className="text-sm font-semibold text-gray-400 uppercase block mb-2">Status</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            result.status === "confirmed" ? "bg-green-900/50 text-green-400" :
                            result.status === "pending" ? "bg-yellow-900/50 text-yellow-400" :
                            "bg-red-900/50 text-red-400"
                          }`}>
                            {result.status === "confirmed" && "✓ Confermato"}
                            {result.status === "pending" && "⏳ In attesa"}
                            {result.status === "failed" && "✗ Fallito"}
                          </span>
                        </div>
                      )}

                      {result.notarizedBy && (
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <span className="text-sm font-semibold text-gray-400 uppercase block mb-2">Notarizzato da</span>
                          <code className="text-gray-200 text-sm font-mono break-all">
                            {result.notarizedBy.substring(0, 10)}...{result.notarizedBy.substring(result.notarizedBy.length - 8)}
                          </code>
                        </div>
                      )}
                    </div>

                    {/* Certificate Badge */}
                    <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg p-6 border border-green-700">
                      <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                        🏆 Certificato di Autenticità
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Questo contenuto è stato ufficialmente notarizzato sulla blockchain Base.
                        Puoi condividere questo certificato per provare l'autenticità e il timestamp del contenuto.
                      </p>
                      <div className="flex items-center justify-center bg-white/10 rounded p-3">
                        <img 
                          src="https://img.shields.io/badge/PanAI-Verified_on_Base-green?logo=ethereum&logoColor=white"
                          alt="Verified Badge"
                          className="h-6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!result.found && (
                  <div className="mt-6">
                    <p className="text-gray-300 mb-4">
                      L'hash fornito non corrisponde a nessun contenuto notarizzato nel nostro sistema.
                    </p>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">Hash verificato:</p>
                      <code className="text-gray-300 text-sm block break-all font-mono">
                        {result.hash}
                      </code>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                      <p>Possibili motivi:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Il contenuto non è mai stato notarizzato</li>
                        <li>L'hash fornito è errato</li>
                        <li>Il file è stato modificato dopo la notarizzazione</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
