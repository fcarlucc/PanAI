export default function HeroSection() {
  return (
    <section id="hero" className="pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          PAN — Protocol for AI Notarization
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Lo standard aperto per certificare, ancorare e verificare contenuti (umani o AI) con privacy by design.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <div className="text-3xl mb-3">⛓️</div>
            <h3 className="font-semibold mb-2 text-green-400">Hash → Merkle → root on-chain</h3>
            <p className="text-sm text-gray-400">Radici pubblicate su Base</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="font-semibold mb-2 text-green-400">Firma automatica e manuale</h3>
            <p className="text-sm text-gray-400">Chat AI e qualsiasi contenuto</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2 text-green-400">Verifica istantanea</h3>
            <p className="text-sm text-gray-400">Con il solo hash (opz. semantica)</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/chat"
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg"
          >
            Prova la demo
          </a>
          <a
            href="#come-funziona"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Leggi come funziona
          </a>
        </div>
      </div>
    </section>
  );
}
