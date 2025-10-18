export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Perché PAN
        </h2>
        
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <p className="text-lg text-gray-300 mb-6">
            L'AI rende facile creare e modificare contenuti. È difficile dimostrare chi ha scritto cosa, se un testo è stato alterato, o se due messaggi dicono la stessa cosa.
          </p>
          <p className="text-lg text-gray-300">
            PAN risolve il problema con uno standard semplice: <span className="text-green-400 font-semibold">normalizzazione → hash → Merkle → radice on-chain</span>. Così puoi provare l'integrità e l'ordine dei messaggi senza rivelarne il contenuto.
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-4 text-green-400">Mission</h3>
          <p className="text-lg text-gray-300">
            Rendere verificabile e privato l'intero ciclo di vita dei contenuti digitali, con strumenti aperti, portabili e a prova di audit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-xl font-bold mb-2 text-green-400">Privacy-first</h3>
            <p className="text-gray-300">Nessun testo in chiaro sul server; solo blob cifrati client-side.</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-xl font-bold mb-2 text-green-400">Verificabile</h3>
            <p className="text-gray-300">Prova pubblica su Base (eventi RootSigned).</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-green-400">Semplice</h3>
            <p className="text-gray-300">Badge e proof in un clic, verifica anche con solo l'hash.</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-xl font-bold mb-2 text-green-400">Aperto</h3>
            <p className="text-gray-300">Formati e API pubblici, verifica da CLI/SDK.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
