'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Hook per proteggere le route che richiedono autenticazione
 * Reindirizza a /preview se l'utente non è connesso
 */
export function useRequireAuth() {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se non è in fase di connessione e non è connesso, redirect
    if (!isConnecting && !isConnected) {
      router.push('/preview');
    }
  }, [isConnected, isConnecting, router]);

  // Ritorna lo stato per permettere al componente di mostrare loading se necessario
  return {
    isConnected,
    isConnecting,
    isAuthenticated: isConnected,
  };
}

/**
 * Hook per gestire il redirect dopo la connessione
 * Da usare in /preview per reindirizzare a / dopo il login
 */
export function useAuthRedirect() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se siamo in /preview e l'utente si è appena connesso, redirect a home
    if (pathname === '/preview' && isConnected) {
      router.push('/');
    }
  }, [isConnected, pathname, router]);

  return { isConnected };
}
