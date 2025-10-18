# Civic Auth Integration - PanAI

## ✅ Integrazione Completata

L'autenticazione Civic Auth con supporto Web3 è stata integrata con successo nel progetto PanAI.

## 📋 Configurazione

### Client ID
- **Client ID**: `7102f627-a440-4c41-9381-b2c0192ae708`
- **Package**: `@civic/auth-web3` (con supporto Web3 per Base/Ethereum)

### Route Protette
- **Tutte le route** richiedono autenticazione **ECCETTO**:
  - `/preview/*` - Landing page pubblica
  - Asset statici (`_next`, immagini, favicon, etc.)

## 🗂️ File Modificati/Creati

### 1. **next.config.ts** (ROOT del progetto)
- Aggiunto plugin Civic Auth
- Configurato Client ID
- Impostato `exclude` per route pubbliche

### 2. **src/middleware.ts** 
- Middleware di autenticazione Civic
- Protegge tutte le route tranne `/preview/*`

### 3. **src/app/api/auth/[...civicauth]/route.ts**
- API route per gestire login/logout OAuth

### 4. **src/app/layout.tsx**
- Aggiunto `CivicAuthProvider` wrapper

### 5. **src/components/Header.tsx**
- Sostituito link "Log in" con componente `UserButton` di Civic
- Gestisce automaticamente login/logout e mostra info utente

### 6. **src/app/dashboard/page.tsx** (NUOVO)
- Pagina di esempio protetta
- Mostra informazioni utente autenticato
- Dimostra uso di `getUser()` in Server Component

### 7. **src/app/preview/page.tsx** (NUOVO)
- Landing page pubblica (accessibile senza auth)
- Contiene tutte le sezioni Hero, About, Features, etc.

## 🚀 Come Funziona

### Landing Page Pubblica (Non Richiede Login)
- URL: `http://localhost:3000/preview`
- Accessibile a tutti
- Mostra Hero, About, Features, FAQ, etc.
- Header con pulsante "Sign In"

### Dashboard Protetto (Richiede Login)
- URL: `http://localhost:3000/dashboard`
- Richiede autenticazione
- Se non autenticato → redirect automatico al login Civic
- Dopo login → accesso garantito

### Homepage Root
- URL: `http://localhost:3000/`
- Attualmente redirige a `/preview`
- Puoi modificare per mostrare contenuto diverso

## 🔐 Utilizzo dell'Autenticazione

### Nel Frontend (Client Components)

```tsx
"use client";
import { useUser } from "@civic/auth-web3/react";

export function MyComponent() {
  const { user, signIn, signOut } = useUser();

  if (!user) {
    return <button onClick={signIn}>Sign In</button>
  }

  return (
    <div>
      <p>Hello {user.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Nel Backend (Server Components / API Routes)

```tsx
import { getUser } from "@civic/auth-web3/nextjs";

export default async function MyPage() {
  const user = await getUser();
  
  if (!user) {
    return <div>Not logged in</div>
  }

  return <div>Hello {user.name}!</div>
}
```

### Componente UserButton (Già Integrato in Header)

```tsx
import { UserButton } from "@civic/auth-web3/react";

<UserButton /> // Mostra automaticamente bottone Sign In / User Menu
```

## 📝 Prossimi Passi

1. **Testare l'autenticazione**:
   ```bash
   npm run dev
   ```
   - Vai su `http://localhost:3000/preview` (pubblico)
   - Clicca su "Sign In" nell'header
   - Completa il flusso Civic Auth
   - Accedi a `http://localhost:3000/dashboard` (protetto)

2. **Personalizzare route protette**:
   - Modifica `src/middleware.ts` per aggiungere/rimuovere route protette

3. **Integrare Web3 (Wallet)**:
   - Il package `@civic/auth-web3` supporta già wallet Ethereum/Base
   - Usa hook `useWallet()` per interagire con wallet
   - Vedi documentazione Civic per dettagli Web3

4. **Aggiungere logica business**:
   - Salva dati utente in database
   - Integra con contratti smart su Base
   - Implementa notarizzazione messaggi

## 🛠️ Troubleshooting

### Errore: "Middleware not applied"
- Verifica che `src/middleware.ts` sia nella directory `src/` (NON nella root)

### Errore: "Client ID invalid"
- Verifica Client ID in `next.config.ts`
- Controlla su https://auth.civic.com

### Route non protetta correttamente
- Controlla il `matcher` in `src/middleware.ts`
- Verifica pattern regex nella configurazione

## 📚 Documentazione Ufficiale

- Civic Auth Docs: https://docs.civic.com
- Next.js Integration: https://docs.civic.com/integration/nextjs
- Web3 Support: https://docs.civic.com/integration/web3
