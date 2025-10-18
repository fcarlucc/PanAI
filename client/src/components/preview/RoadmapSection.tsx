export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Roadmap</h2>
        <h3 className="text-2xl font-semibold mb-2">MVP (live)</h3>
        <ul className="list-disc pl-6 space-y-2 text-lg mb-6">
          <li>Registry event-only su Base, Mini-App “Sign/Verify”, API Fastify, Verify CLI</li>
          <li>Storage cifrato client-side, exact verify con proof on-chain</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Next</h3>
        <ul className="list-disc pl-6 space-y-2 text-lg mb-6">
          <li>Meta-tx / relayer (gasless) per signSessionRoot</li>
          <li>Provider Kit (SDK per terze parti: publish root + manifest)</li>
          <li>ZK add-on (Poseidon commit & Verifier) per “exact private verify”</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Privacy+</h3>
        <ul className="list-disc pl-6 space-y-2 text-lg mb-6">
          <li>Integrazione FHE: near-duplicate privato, threshold semantico (bit)</li>
          <li>Evidence firmata (enclave/worker) come attestazione opzionale</li>
        </ul>
        <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Tenancy/ruoli, audit log, KB opt-in, SLO/monitoring</li>
        </ul>
      </div>
    </section>
  );
}