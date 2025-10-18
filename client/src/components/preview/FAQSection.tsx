export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Domande frequenti (FAQ)</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li><strong>PAN salva i miei contenuti?</strong> No. Salviamo solo hash, metadati e puntatori a blob cifrati lato client.</li>
          <li><strong>Cosa pubblicate on-chain?</strong> Solo eventi con le root (sessione/batch). Mai testi o PII.</li>
          <li><strong>Posso verificare con il solo hash?</strong> Sì. Lookup by hash → prova → radice → evento su Base.</li>
          <li><strong>E se il testo è stato leggermente modificato?</strong> Puoi usare fuzzy/semantica per verificare near-duplicate o “stesso significato”. In modalità Privacy+, l’esito può essere un bit (pass/fail) calcolato su dati cifrati.</li>
          <li><strong>È vendor-lock-in?</strong> No. Formati aperti, verifiche da CLI, contratti minimi event-only. Puoi auto-ospitare l’API.</li>
          <li><strong>Serve un wallet?</strong> Per pubblicare root on-chain sì (wallet su Base). Per verificare hash-only, no.</li>
          <li><strong>Posso integrarlo nella mia app?</strong> Sì. Offriamo API/SDK e Mini-App “drop-in” per Base.</li>
        </ul>
      </div>
    </section>
  );
}