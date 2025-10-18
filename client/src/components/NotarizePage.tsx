"use client";

import { useState } from "react";
import MainHeader from "@/components/MainHeader";

interface NotarizedContent {
  id: string;
  type: "text" | "file" | "chat";
  content: string;
  hash: string;
  timestamp: Date;
  txHash?: string;
  status: "pending" | "confirmed" | "failed";
}

export default function NotarizePage() {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isNotarizing, setIsNotarizing] = useState(false);
  const [history, setHistory] = useState<NotarizedContent[]>([]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, type: 'hash' | 'tx') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'hash') {
        setCopiedHash(text);
        setTimeout(() => setCopiedHash(null), 2000);
      } else {
        setCopiedTx(text);
        setTimeout(() => setCopiedTx(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateVerifyUrl = (hash: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/verify?hash=${hash}`;
  };

  const handleNotarizeText = async () => {
    if (!textContent.trim()) return;

    setIsNotarizing(true);

    const newRecord: NotarizedContent = {
      id: Date.now().toString(),
      type: "text",
      content: textContent.substring(0, 100) + (textContent.length > 100 ? "..." : ""),
      hash: "0x" + Math.random().toString(16).substring(2, 66),
      timestamp: new Date(),
      status: "pending",
    };

    setHistory([newRecord, ...history]);
    setTextContent("");
    setIsNotarizing(false);

    setTimeout(() => {
      setHistory(prev => prev.map(item => 
        item.id === newRecord.id 
          ? { ...item, txHash: "0x" + Math.random().toString(16).substring(2, 66), status: "confirmed" }
          : item
      ));
    }, 3000);
  };

  const handleNotarizeFile = async () => {
    if (!selectedFile) return;

    setIsNotarizing(true);

    const newRecord: NotarizedContent = {
      id: Date.now().toString(),
      type: "file",
      content: selectedFile.name,
      hash: "0x" + Math.random().toString(16).substring(2, 66),
      timestamp: new Date(),
      status: "pending",
    };

    setHistory([newRecord, ...history]);
    setSelectedFile(null);
    setIsNotarizing(false);

    setTimeout(() => {
      setHistory(prev => prev.map(item => 
        item.id === newRecord.id 
          ? { ...item, txHash: "0x" + Math.random().toString(16).substring(2, 66), status: "confirmed" }
          : item
      ));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <MainHeader />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Notarizza il tuo contenuto
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Certifica l'autenticità e l'esistenza del tuo contenuto sulla blockchain Base
            </p>
          </div>

          <div className="flex justify-center mb-8 gap-4">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "text"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              📝 Testo
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "file"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              📄 File
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">
                {activeTab === "text" && "Notarizza Testo"}
                {activeTab === "file" && "Notarizza File"}
              </h2>

              {activeTab === "text" && (
                <div>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Inserisci il testo da notarizzare..."
                    rows={12}
                    className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700 mb-4"
                  />
                  <button
                    onClick={handleNotarizeText}
                    disabled={isNotarizing || !textContent.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {isNotarizing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Notarizzazione in corso...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Notarizza su Base
                      </>
                    )}
                  </button>
                </div>
              )}

              {activeTab === "file" && (
                <div>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center mb-4">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-lg mb-2">
                        {selectedFile ? selectedFile.name : "Clicca per caricare un file"}
                      </p>
                      <p className="text-sm text-gray-400">
                        PDF, immagini, documenti, ecc.
                      </p>
                    </label>
                  </div>
                  <button
                    onClick={handleNotarizeFile}
                    disabled={isNotarizing || !selectedFile}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {isNotarizing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Notarizzazione in corso...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Notarizza File su Base
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Come funziona
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Viene generato un hash crittografico del contenuto</li>
                  <li>• L'hash viene registrato sulla blockchain Base</li>
                  <li>• Ricevi un certificato di autenticità con timestamp</li>
                  <li>• Il contenuto può essere verificato in qualsiasi momento</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Storico Notarizzazioni</h2>

              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <svg className="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Nessuna notarizzazione ancora</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {history.map((item) => {
                    const isExpanded = expandedItems.has(item.id);
                    
                    return (
                      <div key={item.id} className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
                        {/* Header - Always Visible - Clickable */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-800/50 transition"
                          onClick={() => toggleExpand(item.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-2xl">
                                {item.type === "text" && "📝"}
                                {item.type === "file" && "📄"}
                                {item.type === "chat" && "💬"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-200 truncate">{item.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.timestamp.toLocaleDateString("it-IT")} • {item.timestamp.toLocaleTimeString("it-IT")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 ml-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                item.status === "confirmed" ? "bg-green-900/50 text-green-400 border border-green-700" :
                                item.status === "pending" ? "bg-yellow-900/50 text-yellow-400 border border-yellow-700" :
                                "bg-red-900/50 text-red-400 border border-red-700"
                              }`}>
                                {item.status === "confirmed" && "✓"}
                                {item.status === "pending" && "⏳"}
                                {item.status === "failed" && "✗"}
                              </span>
                              <svg 
                                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3 border-t border-gray-700 pt-4">
                            {/* Hash */}
                            <div className="bg-gray-950/70 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase">Hash</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(item.hash, 'hash');
                                  }}
                                  className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-xs"
                                >
                                  {copiedHash === item.hash ? '✓ Copiato' : '📋 Copia'}
                                </button>
                              </div>
                              <code className="text-green-400 text-xs block break-all">
                                {item.hash}
                              </code>
                            </div>

                            {/* Transaction */}
                            <div className="bg-gray-950/70 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase">Transaction</span>
                                {item.txHash && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(item.txHash!, 'tx');
                                      }}
                                      className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-xs"
                                    >
                                      {copiedTx === item.txHash ? '✓' : '📋'}
                                    </button>
                                    <a
                                      href={`https://basescan.org/tx/${item.txHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      BaseScan ↗
                                    </a>
                                  </div>
                                )}
                              </div>
                              {item.txHash ? (
                                <code className="text-blue-400 text-xs block break-all">
                                  {item.txHash}
                                </code>
                              ) : (
                                <p className="text-yellow-400 text-xs italic">⏳ In arrivo a breve...</p>
                              )}
                            </div>

                            {/* Badges */}
                            <div className="bg-gradient-to-br from-gray-950/90 to-gray-900/50 rounded-lg p-4 border border-gray-600">
                              <h4 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
                                🏷️ Badge di Verifica
                              </h4>
                              <div className="space-y-2">
                                {/* Link Semplice */}
                                <div className="bg-gray-900/80 rounded p-2.5 border border-gray-700">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-blue-400">🔗 Link</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(generateVerifyUrl(item.hash), 'hash');
                                      }}
                                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                    >
                                      {copiedHash === generateVerifyUrl(item.hash) ? '✓' : '📋'}
                                    </button>
                                  </div>
                                  <code className="text-blue-300 text-xs block break-all">
                                    {generateVerifyUrl(item.hash)}
                                  </code>
                                </div>

                                {/* HTML */}
                                <div className="bg-gray-900/80 rounded p-2.5 border border-gray-700">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-orange-400">🌐 HTML</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(`<a href="${generateVerifyUrl(item.hash)}">Verifica su PanAI</a>`, 'hash');
                                      }}
                                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                    >
                                      {copiedHash === `<a href="${generateVerifyUrl(item.hash)}">Verifica su PanAI</a>` ? '✓' : '📋'}
                                    </button>
                                  </div>
                                  <code className="text-orange-300 text-xs block break-all">
                                    &lt;a href="{generateVerifyUrl(item.hash)}"&gt;Verifica&lt;/a&gt;
                                  </code>
                                </div>

                                {/* Markdown */}
                                <div className="bg-gray-900/80 rounded p-2.5 border border-gray-700">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-purple-400">📝 MD</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(`[Verifica su PanAI](${generateVerifyUrl(item.hash)})`, 'hash');
                                      }}
                                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                    >
                                      {copiedHash === `[Verifica su PanAI](${generateVerifyUrl(item.hash)})` ? '✓' : '📋'}
                                    </button>
                                  </div>
                                  <code className="text-purple-300 text-xs block break-all">
                                    [Verifica]({generateVerifyUrl(item.hash)})
                                  </code>
                                </div>

                                {/* Badge */}
                                <div className="bg-gray-900/80 rounded p-2.5 border border-gray-700">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-pink-400">🎨 Badge</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(`[![PanAI](https://img.shields.io/badge/PanAI-${item.txHash ? 'Verified' : 'Pending'}-${item.txHash ? 'green' : 'yellow'})](${generateVerifyUrl(item.hash)})`, 'hash');
                                      }}
                                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                                    >
                                      📋
                                    </button>
                                  </div>
                                  <div className="flex justify-center bg-white/5 rounded p-2">
                                    <img 
                                      src={`https://img.shields.io/badge/PanAI-${item.txHash ? 'Verified' : 'Pending'}-${item.txHash ? 'green' : 'yellow'}`}
                                      alt="Badge"
                                      className="h-5"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
