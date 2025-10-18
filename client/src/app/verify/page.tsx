"use client";
import { useRequireAuth } from "@/hooks/useAuth";
import VerifyPage from "@/components/VerifyPage";

export default function Verify() {
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

  return <VerifyPage />;
}
