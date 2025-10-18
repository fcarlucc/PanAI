# Configurazione ConnectKit + ENS Authentication

## Setup Completo

Il progetto ora utilizza **ConnectKit** by Family per l'autenticazione Web3 con supporto nativo ENS.

### 1. WalletConnect Project ID

Per utilizzare ConnectKit, è necessario ottenere un **Project ID** gratuito da WalletConnect.

#### Passaggi:

1. Vai su [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Crea un account gratuito
3. Crea un nuovo progetto
4. Copia il **Project ID** generato
5. Sostituisci `YOUR_PROJECT_ID` in `src/components/Web3Provider.tsx`:

```typescript
walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'IL_TUO_PROJECT_ID',
```

Oppure crea un file `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=il_tuo_project_id_qui
```

### 2. Cosa Offre ConnectKit

**ConnectKit** è una libreria React completa per la connessione wallet che include:

- ✅ **UI Bellissima** - Design moderno e responsive out-of-the-box
- ✅ **Supporto ENS Nativo** - Mostra automaticamente nomi ENS e avatar
- ✅ **Multi-Wallet** - MetaMask, WalletConnect, Coinbase Wallet, Rainbow, e altro
- ✅ **Multi-Chain** - Supporto per Ethereum, Polygon, Optimism, Arbitrum, Base
- ✅ **TypeScript** - Tipizzazione completa
- ✅ **Temi Personalizzabili** - Adattabile al tuo brand
- ✅ **Mobile-First** - Ottimizzato per dispositivi mobili

### 3. Come Funziona il Flusso

1. **L'utente visita `/preview`**
2. **Clicca "Connect Wallet"** nel pulsante ConnectKit
3. **Scegliere il wallet** dal modale elegante di ConnectKit
4. **Connessione automatica** - Il wallet si connette all'app
5. **Risoluzione ENS** - Se il wallet ha un ENS name, viene mostrato automaticamente
6. **Accesso alla Dashboard** - L'utente può ora accedere alle pagine protette

### 4. Risoluzione ENS Automatica

ConnectKit include il supporto nativo per ENS:
- ✅ **Nome ENS** - Se disponibile, mostra `vitalik.eth` invece di `0x1234...5678`
- ✅ **Avatar ENS** - Carica e mostra automaticamente l'avatar del profilo ENS
- ✅ **Primary Name** - Risolve il nome primario associato all'indirizzo
- ✅ **Fallback Elegante** - Se non c'è ENS, mostra l'indirizzo abbreviato

### 5. Testare l'Applicazione

```bash
# 1. Installa le dipendenze (se non l'hai già fatto)
npm install

# 2. Configura il WALLETCONNECT_PROJECT_ID
# Modifica src/components/Web3Provider.tsx oppure crea .env.local

# 3. Avvia il server di sviluppo
npm run dev

# 4. Visita http://localhost:3000/preview

# 5. Clicca "Connect Wallet"

# 6. Seleziona un wallet e connettiti

# 7. Verrai automaticamente riconosciuto con il tuo ENS o indirizzo

# 8. Accedi alla dashboard
```

### 6. Protezione delle Route

Le pagine protette (`/`, `/chat`, `/notarize`, `/verify`) controllano se il wallet è connesso tramite wagmi hooks:

```typescript
const { isConnected } = useAccount();

useEffect(() => {
  if (!isConnected) {
    router.push('/preview');
  }
}, [isConnected, router]);
```

Se non sei connesso, vieni reindirizzato automaticamente a `/preview`.

### 7. Struttura dei File

```
client/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Dashboard (protetta)
│   │   ├── chat/                      # Chat page (protetta)
│   │   ├── notarize/                  # Notarize page (protetta)
│   │   ├── verify/                    # Verify page (protetta)
│   │   └── preview/                   # Landing page (pubblica)
│   └── components/
│       ├── Providers.tsx              # Wrappa Web3Provider
│       ├── Web3Provider.tsx           # ConnectKit + Wagmi setup
│       ├── Header.tsx                 # Header con ConnectKitButton
│       ├── MainHeader.tsx             # Header pagine protette
│       └── preview/
│           └── PreviewHeader.tsx      # Header landing page
└── .env.local                         # Variabili d'ambiente (opzionale)
```

### 8. Vantaggi di ConnectKit rispetto ad Alternatives

| Aspetto | RainbowKit | ConnectKit | Civic (Vecchio) |
|---------|------------|-----------|-----------------|
| Login | Wallet | Wallet | Email/OIDC |
| ENS Support | ✅ | ✅ (migliore) | ❌ |
| Avatar ENS | ✅ | ✅ (automatico) | ❌ |
| UI/UX | Eccellente | Eccellente+ | Base |
| Customization | Media | Alta | Bassa |
| Temi | Sì | Sì (più opzioni) | No |
| Decentralizzato | ✅ | ✅ | ❌ |
| Mobile | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ |

### 9. Personalizzazione

ConnectKit è altamente personalizzabile. Puoi modificare:

#### Temi
```typescript
<ConnectKitProvider theme="auto"> {/* "light" | "dark" | "auto" */}
  {children}
</ConnectKitProvider>
```

#### Colori Personalizzati
```typescript
<ConnectKitProvider
  customTheme={{
    "--ck-connectbutton-background": "#00D084",
    "--ck-connectbutton-color": "#ffffff",
    // ... altri colori
  }}
>
```

#### Chains
Modifica in `Web3Provider.tsx`:
```typescript
chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
```

Consulta la documentazione ufficiale: https://docs.family.co/connectkit

### 10. SIWE (Sign In With Ethereum) - Opzionale

**Nota**: SIWE non è attualmente implementato a causa di problemi di compatibilità con Next.js 15 e React 19.

Se vuoi implementare SIWE in futuro (per sessioni server-side autenticate):
1. Attendi aggiornamenti di `connectkit-next-siwe` per Next.js 15
2. Oppure implementa SIWE manualmente seguendo https://docs.login.xyz/
3. Oppure usa `next-auth` con un adapter Ethereum

### 11. Sicurezza

- ✅ **Connessione wallet lato client** - Nessun dato sensibile sul server
- ✅ **Firma messaggi** - L'utente controlla cosa firma
- ✅ **Multi-Chain** - Supporto per diverse blockchain
- ✅ **Logout automatico** - Quando si cambia account o si disconnette

### 12. Prossimi Passi Suggeriti

- [ ] Ottenere un WalletConnect Project ID
- [ ] Testare la connessione con diversi wallet
- [ ] Configurare un nome ENS per testare la risoluzione
- [ ] Implementare token gating basato su NFT posseduti (futuro)
- [ ] Aggiungere gestione profili utente con dati ENS (futuro)
- [ ] Integrare Text Records ENS per bio, social, ecc. (futuro)
- [ ] Considerare SIWE quando compatibile con Next.js 15 (futuro)

### 13. Differenze con l'Implementazione Precedente

#### Da Civic Auth
- ❌ Rimosso: Login con email/password
- ❌ Rimosso: OAuth/OIDC
- ✅ Aggiunto: Connessione wallet decentralizzata
- ✅ Aggiunto: Supporto ENS nativo

#### Da RainbowKit
- ✅ Mantenuto: Supporto multi-wallet
- ✅ Mantenuto: Risoluzione ENS
- ✅ Migliorato: UI/UX più raffinata
- ✅ Migliorato: Avatar ENS automatici
- ✅ Aggiunto: Maggiore personalizzazione temi

## Supporto e Risorse

- [ConnectKit Documentation](https://docs.family.co/connectkit)
- [ConnectKit Examples](https://github.com/family/connectkit/tree/main/examples)
- [Wagmi Documentation](https://wagmi.sh/)
- [ENS Documentation](https://docs.ens.domains/)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)

## Troubleshooting

**Problema**: Il pulsante Connect non appare
- **Soluzione**: Assicurati di aver configurato il WALLETCONNECT_PROJECT_ID

**Problema**: ENS non viene risolto
- **Soluzione**: La risoluzione ENS funziona solo su Ethereum Mainnet. Assicurati che il wallet sia connesso a Mainnet.

**Problema**: Build fallisce
- **Soluzione**: Assicurati di avere Node.js v18+ e tutte le dipendenze installate con `npm install`

**Problema**: "Module not found" errors
- **Soluzione**: Prova `rm -rf node_modules && npm install` e poi `npm run build`


