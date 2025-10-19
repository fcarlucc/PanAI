# PanAI Server - Build & Distribuzione

## 📦 Build della distribuzione

Il server Express può essere compilato in un bundle ottimizzato per la produzione.

### Comandi disponibili

```bash
# Build per produzione (minificato)
npm run build

# Build per produzione con flag NODE_ENV
npm run build:prod

# Pulisci la cartella dist
npm run clean
```

### Output

La build genera:
- **`dist/server.js`** - Bundle minificato del server
- **`dist/server.js.map`** - Source map per debugging

### 🚀 Avvio della distribuzione

```bash
# Avvia il server dalla dist
npm run start:dist
```

Oppure direttamente:

```bash
node dist/server.js
```

### ⚙️ Configurazione ambiente

Assicurati di avere un file `.env` nella directory `server_chat`:

```env
OPENROUTER_API_KEY=your_api_key_here
PORT=3001
```

### 📋 Modalità di esecuzione

| Comando | Descrizione | File eseguito |
|---------|-------------|---------------|
| `npm start` | Sviluppo (codice sorgente) | `server_def.js` |
| `npm run dev` | Sviluppo con hot-reload | `server_def.js` |
| `npm run start:dist` | Produzione (bundle) | `dist/server.js` |

### 🎯 Vantaggi della distribuzione

- ✅ **Minificato** - Dimensioni ridotte
- ✅ **Source maps** - Debugging facilitato
- ✅ **Ottimizzato** - Performance migliorate
- ✅ **Bundle unico** - Deploy semplificato

### 📊 Dimensioni

Dopo la build, il file `dist/server.js` sarà significativamente più piccolo del codice sorgente grazie alla minificazione.

### 🐳 Deploy con Docker (opzionale)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY dist ./dist
COPY .env .env
RUN npm ci --only=production
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### 🔧 Personalizzazione build

Modifica `build.js` per cambiare:
- Target Node.js version
- Minificazione
- Source maps
- External dependencies
