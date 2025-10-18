"use client";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { useRouter, usePathname } from "next/navigation";

export default function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });

  const isHomePage = pathname === '/';

  const handleDisconnect = () => {
    disconnect();
    // Redirect a /preview dopo disconnessione
    router.push('/preview');
  };

  const displayName = ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '');

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur border-b border-gray-800">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold tracking-tight text-white">PanAI</span>
          </a>
        </div>
        
        {!isHomePage && (
          <div className="hidden lg:flex lg:gap-x-8">
            <a href="/chat" className="text-sm font-semibold text-white hover:text-green-400 transition">
              Chat
            </a>
            <a href="/notarize" className="text-sm font-semibold text-white hover:text-green-400 transition">
              Notarize
            </a>
            <a href="/verify" className="text-sm font-semibold text-white hover:text-green-400 transition">
              Verify
            </a>
          </div>
        )}
        
        <div className="flex lg:flex-1 lg:justify-end items-center gap-4">
          {isConnected && address && (
            <>
              <span className="text-sm text-gray-300">Hello, {displayName}</span>
              <button
                onClick={handleDisconnect}
                className="text-sm font-semibold text-white hover:text-red-400 transition bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
