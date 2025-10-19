/**
 * API Configuration
 * Centralizza tutte le chiamate al backend
 */

// URL base del backend (da .env.local)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Helper per fare richieste HTTP
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Configurazione dei provider disponibili
 */
export const PROVIDERS = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    endpoint: '/api/openai',
    models: [
      { id: 'gpt-4o-mini', name: 'gpt-4o-mini', available: true },
      { id: 'gpt-4o', name: 'gpt-4o', available: true },
      { id: 'gpt-4-turbo', name: 'gpt-4-turbo', available: true }
    ]
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    endpoint: '/api/anthropic',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'claude-3-5-sonnet-20241022', available: true },
      { id: 'claude-3-5-sonnet', name: 'claude-3-5-sonnet', available: true },
      { id: 'claude-3-opus', name: 'claude-3-opus', available: true },
      { id: 'claude-haiku-4.5', name: 'claude-haiku-4.5', available: true }
    ]
  },
  xai: {
    id: 'xai',
    name: 'X-AI',
    endpoint: '/api/xai',
    models: [
      { id: 'grok-beta', name: 'grok-beta', available: false },
      { id: 'grok-2', name: 'grok-2', available: false }
    ]
  },
  google: {
    id: 'google',
    name: 'Google',
    endpoint: '/api/google',
    models: [
      { id: 'gemini-2.0-flash-exp', name: 'gemini-2.0-flash-exp', available: false },
      { id: 'gemini-pro', name: 'gemini-pro', available: false },
      { id: 'gemini-1.5-pro', name: 'gemini-1.5-pro', available: false }
    ]
  },
  meta: {
    id: 'meta',
    name: 'Meta',
    endpoint: '/api/meta',
    models: [
      { id: 'llama-3.1-70b-instruct', name: 'llama-3.1-70b-instruct', available: true },
      { id: 'llama-3.3-70b-instruct', name: 'llama-3.3-70b-instruct', available: true },
      { id: 'llama-3.1-405b', name: 'llama-3.1-405b', available: true }
    ]
  }
} as const;

export type ProviderId = keyof typeof PROVIDERS;

/**
 * API Endpoints
 */
export const api = {
  /**
   * CHAT API
   */
  chat: {
    // Invia un messaggio usando un provider e modello specifico
    sendMessage: async (
      userId: string, 
      message: string,
      provider: ProviderId = 'openai',
      model?: string,
      conversationId?: string  // Nuovo: ID conversazione opzionale
    ) => {
      const providerConfig = PROVIDERS[provider];
      return apiRequest<{
        success: boolean;
        provider: string;
        model: string;
        content: string;
        created: number;
        system_fingerprint: string;
        conversation_id: string;  // Restituito dal backend
      }>(providerConfig.endpoint, {
        method: 'POST',
        body: JSON.stringify({ 
          user_id: userId, 
          message,
          model, // Passa il modello specifico al backend
          conversation_id: conversationId  // Passa l'ID conversazione
        }),
      });
    },

    // Ottieni le chat e i dati di un utente
    getUserChats: async (userId: string) => {
      return apiRequest<{
        conversations: Array<{
          id: string;
          title: string;
          messages: Array<{ role: string; content: string }>;
          createdAt: string;
          updatedAt: string;
        }>;
        success: boolean;
      }>(`/api/user-chats/${userId}`, {
        method: 'GET',
      });
    },
  },

  /**
   * NOTARIZATION API
   * (Da implementare nel backend se necessario)
   */
  notarize: {
    // Richiedi notarizzazione di un messaggio
    requestNotarization: async (userId: string, messageIndex: number) => {
      return apiRequest<{
        msg: string;
        merkleRoot: string;
        merkleProof: Array<{ pos: string; h: string }>;
        timestamp: string;
      }>('/api/notarize', {
        method: 'POST',
        body: JSON.stringify({ user: userId, msgIndex: messageIndex }),
      });
    },
  },

  /**
   * VERIFICATION API
   * (Da implementare nel backend se necessario)
   */
  verify: {
    // Verifica un messaggio usando Merkle proof
    verifyMessage: async (data: {
      msgHash: string;
      merkleRoot: string;
      proof: Array<{ pos: string; h: string }>;
    }) => {
      return apiRequest<{
        valid: boolean;
        message?: string;
      }>('/api/verify', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
  // Recupera modelli disponibili per provider dal backend
  fetchModels: async (): Promise<Record<string, string[]>> => {
    return apiRequest<Record<string, string[]>>('/api/models', { method: 'GET' });
  },
};

/**
 * Export per uso diretto
 */
export { API_BASE_URL };
export default api;
