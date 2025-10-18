# 🔐 Flusso di Autenticazione PanAI

## ✅ Flusso Implementato

### 📍 Route Pubbliche (Senza Autenticazione)
- **`/preview`** - Landing page pubblica
  - Header con bottone "Sign In"
  - Sezioni: Hero, About, Features, FAQ, etc.
  - Se già loggato, mostra "Go to Dashboard"

### 🔒 Route Protette (Richiedono Autenticazione)
- **`/`** - Homepage autenticata
- **`/dashboard`** - Dashboard utente
- **`/notarize`** - Notarizzazione contenuti (da implementare)
- **`/verify`** - Verifica contenuti (da implementare)

---

## 🔄 Flusso Login/Logout

### 1️⃣ **Utente NON autenticato**

```
┌─────────────────────────────────────────────┐
│  Utente visita /preview                     │
│  - Vede landing page pubblica               │
│  - Header mostra bottone "Sign In"          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Utente clicca "Sign In"                    │
│  - Si apre popup Civic Auth                 │
│  - Sceglie provider (Google, Web3, etc.)    │
│  - Completa autenticazione                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Dopo login → Redirect a /                  │
│  - Homepage autenticata                     │
│  - Mostra: Welcome {nome}!                  │
│  - Card: Dashboard, Notarize, Verify        │
│  - Header con UserButton (nome + logout)    │
└─────────────────────────────────────────────┘
```

### 2️⃣ **Utente autenticato naviga**

```
┌─────────────────────────────────────────────┐
│  / (Home)                                   │
│  ↓                                           │
│  /dashboard - Info utente                   │
│  ↓                                           │
│  /notarize - Notarizza contenuti            │
│  ↓                                           │
│  /verify - Verifica autenticità             │
└─────────────────────────────────────────────┘

Tutte le pagine hanno:
- MainHeader con UserButton
- Link navigazione: Home, Dashboard, Notarize, Verify
```

### 3️⃣ **Logout**

```
┌─────────────────────────────────────────────┐
│  Utente clicca UserButton → Logout          │
│  - Civic Auth cancella sessione             │
│  - Redirect automatico a /preview           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Utente torna su /preview                   │
│  - Landing page pubblica                    │
│  - Header mostra "Sign In"                  │
│  - Può navigare sezioni o fare login        │
└─────────────────────────────────────────────┘
```

### 4️⃣ **Tentativo di accesso a route protetta (non autenticato)**

```
┌─────────────────────────────────────────────┐
│  Utente NON autenticato tenta /dashboard    │
│  - Middleware Civic intercetta richiesta    │
│  - Redirect automatico a /preview           │
│  - Messaggio: "Please sign in"              │
└─────────────────────────────────────────────┘
```

---

## 🎯 Configurazione Redirect (next.config.ts)

```typescript
loginSuccessUrl: "/"          // Dove andare dopo login
logoutUrl: "/preview"          // Dove andare dopo logout
loginUrl: "/preview"           // Pagina di login per non autenticati
```

---

## 🧩 Componenti Chiave

### **PreviewHeader** (Preview Page)
- Usato in `/preview`
- Mostra bottone "Sign In" se non loggato
- Mostra "Go to Dashboard" se già loggato
- Link alle sezioni della landing

### **MainHeader** (Pagine Autenticate)
- Usato in `/`, `/dashboard`, etc.
- Mostra `UserButton` di Civic (nome + logout)
- Link navigazione: Home, Dashboard, Notarize, Verify

---

## 📊 Tabella Riepilogativa

| Route       | Autenticazione | Header          | Redirect se non auth | Redirect dopo login |
|-------------|----------------|-----------------|----------------------|---------------------|
| `/preview`  | ❌ NO          | PreviewHeader   | -                    | -                   |
| `/`         | ✅ SI          | MainHeader      | → `/preview`         | Mostra home         |
| `/dashboard`| ✅ SI          | MainHeader      | → `/preview`         | -                   |
| `/notarize` | ✅ SI          | MainHeader      | → `/preview`         | -                   |
| `/verify`   | ✅ SI          | MainHeader      | → `/preview`         | -                   |

---

## 🚀 Test del Flusso

### 1. Avvia il server
```bash
npm run dev
```

### 2. Test Utente Non Autenticato
1. Vai su `http://localhost:3000/preview`
2. Vedi landing page con "Sign In"
3. Prova ad andare su `http://localhost:3000/dashboard`
4. Vieni rediretto a `/preview` (non autenticato)

### 3. Test Login
1. Da `/preview`, clicca "Sign In"
2. Completa autenticazione Civic
3. Vieni rediretto a `/` (homepage autenticata)
4. Vedi "Welcome {nome}!"
5. Header mostra UserButton con il tuo nome

### 4. Test Navigazione Autenticata
1. Clicca "Dashboard" nell'header
2. Vai su `/dashboard` e vedi info utente
3. Clicca "Home" per tornare a `/`

### 5. Test Logout
1. Clicca sul tuo nome (UserButton)
2. Clicca "Logout"
3. Vieni rediretto a `/preview`
4. Header mostra di nuovo "Sign In"

---

## 🎨 Personalizzazioni Future

### Miglioramenti UI
- Animazioni di transizione tra pagine
- Loading states durante autenticazione
- Notifiche toast per login/logout
- Avatar utente nel UserButton

### Funzionalità
- Remember me / Persistent session
- Redirect alla pagina originale dopo login
- Onboarding per nuovi utenti
- Dashboard personalizzato per ruoli

---

## 📝 Note Importanti

1. **Middleware**: Protegge automaticamente tutte le route tranne `/preview/*`
2. **Provider**: Configura provider aggiuntivi da https://auth.civic.com
3. **Web3**: Il package `@civic/auth-web3` supporta wallet Ethereum/Base
4. **Session**: Gestita automaticamente da Civic (cookies sicuri)

---

Pronto per essere testato! 🎉
