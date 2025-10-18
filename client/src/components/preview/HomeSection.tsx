export default function HomeSection() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center drop-shadow-lg">
        Chat con l'AI, semplice e veloce
      </h1>
      <p className="text-lg md:text-2xl text-gray-300 mb-10 text-center max-w-2xl">
        Fai domande, ottieni risposte intelligenti e migliora la tua produttività con PanAI.
      </p>
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <button className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-lg transition mb-2">
          Inizia a chattare
        </button>
        <span className="text-xs text-gray-400">Nessuna registrazione richiesta</span>
      </div>
    </main>
  );
}
