export default function TechSection() {
  return (
    <section id="tech" className="py-24 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Stack & integrazioni</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Chain: Base (Sepolia → Mainnet)</li>
          <li>Auth: Civic (OIDC) per login web (SIWE compatibile a seguire)</li>
          <li>AI: OpenRouter (routing multi-modello)</li>
          <li>Storage: S3/IPFS (solo ciphertext)</li>
          <li>DB: Postgres (+ pgvector per KB opt-in)</li>
          <li>SDK/Tools: Next.js Mini-App, Fastify API, viem/wagmi, Verify CLI</li>
          <li>(Opzionale) Privacy+ (Zama/TFHE): Near-duplicate privato, threshold semantico (bit)</li>
        </ul>
      </div>
    </section>
  );
}