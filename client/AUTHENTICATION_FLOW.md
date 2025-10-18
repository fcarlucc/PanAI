# Sistema di Protezione Route e Autenticazione

## 🔐 Flusso di Autenticazione

### 1. Utente NON Autenticato

```
Utente visita qualsiasi route (/, /chat, /notarize, /verify)
    ↓
useRequireAuth() controlla se wallet è connesso
    ↓
Se NON connesso → Redirect automatico a /preview
    ↓
Mostra pagina preview con pulsante "Connect Wallet"
```

### 2. Processo di Login

```
Utente in /preview clicca "Connect Wallet"
    ↓
ConnectKit mostra modal con wallet disponibili
    ↓
Utente seleziona wallet (MetaMask, WalletConnect, ecc.)
    ↓
Wallet richiede conferma connessione
    ↓
Connessione stabilita
    ↓
useAuthRedirect() rileva connessione
    ↓
Redirect automatico a / (home dashboard)
```

### 3. Processo di Logout

```
Utente autenticato clicca "Disconnect" nel header
    ↓
handleDisconnect() chiama disconnect() di wagmi
    ↓
Wallet viene disconnesso
    ↓
Redirect automatico a /preview
    ↓
useRequireAuth() nelle altre pagine rileva disconnessione
    ↓
Eventuali altre tab/pagine vengono redirette a /preview
```

## 📁 Struttura dei File

### Hook Personalizzati (`src/hooks/useAuth.ts`)

#### `useRequireAuth()`
- **Dove usarlo**: Pagine protette (`/`, `/chat`, `/notarize`, `/verify`)
- **Cosa fa**: 
  - Controlla se il wallet è connesso
  - Se non connesso, redirect a `/preview`
  - Mostra loading durante la verifica
- **Ritorna**: `{ isConnected, isConnecting, isAuthenticated }`

#### `useAuthRedirect()`
- **Dove usarlo**: Pagina `/preview`
- **Cosa fa**:
  - Monitora lo stato di connessione
  - Quando l'utente si connette, redirect a `/`
- **Ritorna**: `{ isConnected }`

## 🛣️ Route e Protezione

| Route | Accessibilità | Redirect se non auth | Redirect se auth |
|-------|---------------|---------------------|-----------------|
| `/preview` | Pubblica | - | → `/` (dopo login) |
| `/` | Protetta | → `/preview` | - |
| `/chat` | Protetta | → `/preview` | - |
| `/notarize` | Protetta | → `/preview` | - |
| `/verify` | Protetta | → `/preview` | - |

## 🎯 Vantaggi di questo Approccio

1. **Centralizzato**: Tutta la logica di auth in hooks riutilizzabili
2. **Automatico**: I redirect avvengono automaticamente senza logica duplicata
3. **UX Ottimale**: 
   - Loading spinner durante verifica
   - Transizioni smooth tra pagine
   - Nessun flash di contenuto non autorizzato
4. **Type-Safe**: Tutti i componenti sono tipizzati con TypeScript
5. **Reattivo**: I redirect si attivano immediatamente quando lo stato cambia

## 🔄 Stati della Connessione

### `isConnecting`
- **true**: Wallet sta tentando di connettersi
- **false**: Processo di connessione completato (successo o fallito)
- **UX**: Mostra spinner di loading

### `isConnected`
- **true**: Wallet connesso con successo
- **false**: Nessun wallet connesso
- **UX**: Determina se mostrare contenuto o redirect

## 🧪 Test del Flusso

### Scenario 1: Utente non autenticato prova ad accedere
```bash
1. Vai su http://localhost:3000/
2. Vedrai lo spinner brevemente
3. Sarai reindirizzato a http://localhost:3000/preview
```

### Scenario 2: Utente si autentica
```bash
1. In /preview, clicca "Connect Wallet"
2. Connetti con MetaMask
3. Sarai automaticamente reindirizzato a /
4. Vedi la dashboard con i tuoi dati
```

### Scenario 3: Utente si disconnette
```bash
1. Da qualsiasi pagina protetta, clicca "Disconnect"
2. Sarai immediatamente reindirizzato a /preview
3. Il wallet è disconnesso
```

### Scenario 4: Multi-tab behavior
```bash
1. Apri /chat in una tab
2. Apri / in un'altra tab
3. Disconnettiti da una delle due
4. Entrambe le tab verranno redirette a /preview
```

## 🎨 Personalizzazione

### Cambiare la pagina di destinazione dopo login
```typescript
// In src/hooks/useAuth.ts, modifica useAuthRedirect()
router.push('/dashboard'); // invece di '/'
```

### Cambiare la pagina di destinazione dopo logout
```typescript
// In src/components/MainHeader.tsx, modifica handleDisconnect()
router.push('/'); // invece di '/preview'
```

### Aggiungere una nuova route protetta
```typescript
// In src/app/nuova-route/page.tsx
"use client";
import { useRequireAuth } from "@/hooks/useAuth";

export default function NuovaRoute() {
  const { isConnected, isConnecting } = useRequireAuth();

  if (isConnecting || !isConnected) {
    return <div>Loading...</div>;
  }

  return <div>Contenuto protetto</div>;
}
```

## 🔮 Possibili Miglioramenti Futuri

1. **Persistenza sessione**: Salvare stato in localStorage per ricordare utente
2. **Toast notifications**: Notifiche quando login/logout avvengono
3. **Remember me**: Opzione per riconnessione automatica
4. **Session timeout**: Disconnessione automatica dopo X minuti di inattività
5. **Protected routes middleware**: Spostare logica in Next.js middleware (richiede SIWE)
