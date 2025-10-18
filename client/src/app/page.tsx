"use client";
import { useRequireAuth } from "@/hooks/useAuth";
import MainHeader from "../components/MainHeader";
import UserStats from "../components/UserStats";
import BalanceSection from "../components/BalanceSection";
import WithdrawButton from "../components/WithdrawButton";

export default function Home() {
  const { isConnected, isConnecting } = useRequireAuth();

  // Mostra loading durante la verifica dell'autenticazione
  if (isConnecting || !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Verifying connection...</p>
        </div>
      </div>
    );
  }

  // Utente connesso - mostra la home
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <MainHeader />
      <div className="max-w-7xl mx-auto px-4 py-16 pt-32">
        {/* HEADER BUTTONS */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
          <a href="/chat" className="flex items-center gap-3 bg-purple-700 hover:bg-purple-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg transition-all">
            <span className="text-2xl">💬</span> Chat
          </a>
          <a href="/notarize" className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg transition-all">
            <span className="text-2xl">🔐</span> Notarize
          </a>
          <a href="/verify" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg transition-all">
            <span className="text-2xl">✅</span> Verify
          </a>
        </div>

        {/* BALANCE SECTION */}
        <div className="mb-12">
          <BalanceSection />
        </div>


        {/* WITHDRAW BUTTON */}
        <WithdrawButton />

        

        {/* USER STATS & GRAFICI */}
        <div className="mb-12">
          <UserStats />
        </div>

      </div>
    </div>
  );
}
