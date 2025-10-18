export default function CTASection() {
  return (
    <section id="cta" className="py-24 bg-gradient-to-r from-green-500 to-blue-600 text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Prova la demo — notarizza il tuo primo messaggio in 30 secondi</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <a href="#" className="bg-white text-green-600 font-semibold py-3 px-6 rounded-lg text-lg transition hover:bg-gray-100">Prova la demo</a>
          <a href="#" className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg text-lg transition hover:bg-gray-100">Leggi la doc API/SDK</a>
          <a href="#" className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg transition hover:bg-gray-100">Partecipa — GitHub / Discord</a>
        </div>
        <p className="text-sm text-gray-200">Protocollo: specifiche hashing/Merkle | Contratti: address su Base (Sepolia/Mainnet) | SDK & CLI: pacchetti npm @panai/* | Privacy: whitepaper “Storage zero-trust & verifiche private” | Brand: logo kit + palette (Deep Space, Aurora Cyan, Ultramarine…)</p>
      </div>
    </section>
  );
}