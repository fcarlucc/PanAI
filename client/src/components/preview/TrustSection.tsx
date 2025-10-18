export default function TrustSection() {
  return (
    <section id="trust" className="py-24 bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Fiducia & Sicurezza</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Privacy first: il backend non vede mai i contenuti in chiaro</li>
          <li>Determinismo: regole di normalizzazione/hash pubbliche e testate</li>
          <li>Verificabilità pubblica: ancoraggio su Base (eventi RootSigned)</li>
          <li>No lock-in: formati e API aperti, verifica anche da CLI</li>
          <li>Compatibile ENS: identità leggibile (ENS reverse / TXT record per provider)</li>
        </ul>
      </div>
    </section>
  );
}