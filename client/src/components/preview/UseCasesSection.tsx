export default function UseCasesSection() {
  return (
    <section id="usecases" className="py-24 bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Casi d’uso</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Media & Giornalismo: prova che un articolo/post non è stato alterato; verifica con hash-only</li>
          <li>Team legali & compliance: attestazione di contenuti sensibili senza condividerli</li>
          <li>Piattaforme UGC: prevenzione duplicati e plagio con controlli privati</li>
          <li>Ricerca & AI labs: provenance di dataset e prompt, riproducibilità degli esperimenti</li>
          <li>Sviluppo software: notarizzazione commit/snippet, prove di integrità su release</li>
        </ul>
      </div>
    </section>
  );
}