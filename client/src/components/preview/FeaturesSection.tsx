export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Cosa puoi fare con PAN</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg mb-8">
          <li>Notarizzare messaggi, articoli, post, codice e asset multimediali</li>
          <li>Firmare in batch conversazioni intere con un solo evento on-chain</li>
          <li>Verificare post-hoc con hash-only (anche se il contenuto non è pubblico)</li>
          <li>Dimostrare originalità e “stesso significato?” con controlli fuzzy/semantici</li>
          <li>Integrare nei tuoi prodotti via API/SDK, Mini-App e CLI</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-4">Caratteristiche principali</h3>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Exact Verify (istantaneo): ricalcolo hash → leaf → prova di inclusione → root on-chain</li>
          <li>Batch notarization: firma di sessioni intere (riduzione gas e UX semplice)</li>
          <li>MessageReceipt: ricevuta firmata off-chain per ogni messaggio (foglia)</li>
          <li>Storage zero-trust: blob cifrati client-side (AES-GCM con AAD = contentHash) su S3/IPFS</li>
          <li>Mini-App su Base: interfaccia “Sign / Verify” integrabile nel social di Base</li>
          <li>Open & portable: standard di hashing/merkle documentati, contratti event-only</li>
          <li>KB opzionale: indice vettoriale (pgvector) senza plaintext per ricerche interne</li>
        </ul>
      </div>
    </section>
  );
}