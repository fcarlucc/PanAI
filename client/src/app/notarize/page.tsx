"use client";
import { useRequireAuth } from "@/hooks/useAuth";
import NotarizePage from "@/components/NotarizePage";

export default function Notarize() {
  const { isConnected, isConnecting } = useRequireAuth();

  // Mostra loading durante la verifica
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

  return <NotarizePage />;
}
