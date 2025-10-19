"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useAuth";
import MainHeader from "@/components/MainHeader";
import api, { PROVIDERS, ProviderId } from "@/lib/api";

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isConnecting } = useRequireAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('openai');
  const [selectedModel, setSelectedModel] = useState<string>(PROVIDERS['openai'].models[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [historicalChatsLoaded, setHistoricalChatsLoaded] = useState(false);
  const [conversationsData, setConversationsData] = useState<Map<string, Message[]>>(new Map());

  // Helper per gestire sessionStorage
  const getCurrentChatId = (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('currentChatId');
    }
    return null;
  };

  const saveCurrentChatId = (chatId: string | null) => {
    if (typeof window !== 'undefined') {
      if (chatId) {
        sessionStorage.setItem('currentChatId', chatId);
        console.log('💾 Salvato chatId in sessionStorage:', chatId);
      } else {
        sessionStorage.removeItem('currentChatId');
        console.log('🗑️ Rimosso chatId da sessionStorage');
      }
    }
  };

  // Carica lo storico delle chat quando l'utente si connette
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!address || !isConnected || historicalChatsLoaded) return;

      try {
        console.log('🔄 Loading chat history for:', address);
        const response = await api.chat.getUserChats(address);
        
        if (response.success && response.conversations && response.conversations.length > 0) {
          console.log('✅ Loaded chat history:', response.conversations.length, 'conversations');
          
          // Converti le conversazioni nel formato Chat
          const loadedChats: Chat[] = response.conversations.map(conv => ({
            id: conv.id,
            title: conv.title,
            createdAt: new Date(conv.createdAt)
          }));

          // Salva tutti i messaggi delle conversazioni in una Map
          const conversationsMap = new Map<string, Message[]>();
          response.conversations.forEach(conv => {
            const messages: Message[] = conv.messages.map((msg, index) => ({
              id: `${conv.id}-${index}`,
              role: msg.role as "user" | "assistant",
              content: msg.content,
              timestamp: new Date(conv.updatedAt),
            }));
            conversationsMap.set(conv.id, messages);
          });

          setChats(loadedChats);
          setConversationsData(conversationsMap);
          
          // Carica la conversazione più recente o quella salvata in sessionStorage
          const savedChatId = getCurrentChatId();
          if (savedChatId && conversationsMap.has(savedChatId)) {
            // Carica la chat salvata in sessionStorage
            console.log('📂 Caricata chat da sessionStorage:', savedChatId);
            setMessages(conversationsMap.get(savedChatId) || []);
          } else if (loadedChats.length > 0) {
            // Carica l'ultima chat e salvala in sessionStorage
            const latestChat = loadedChats[loadedChats.length - 1];
            saveCurrentChatId(latestChat.id);
            setMessages(conversationsMap.get(latestChat.id) || []);
          }
          
          setHistoricalChatsLoaded(true);
        } else {
          console.log('ℹ️ No chat history found');
          setHistoricalChatsLoaded(true);
        }
      } catch (error) {
        console.error('❌ Error loading chat history:', error);
        setHistoricalChatsLoaded(true);
      }
    };

    loadChatHistory();
  }, [address, isConnected, historicalChatsLoaded]);

  const handleDisconnect = () => {
    disconnect();
    router.push('/preview');
  };

  const handleProviderChange = (newProvider: ProviderId) => {
    setSelectedProvider(newProvider);
    // Cambia automaticamente al primo modello del nuovo provider
    setSelectedModel(PROVIDERS[newProvider].models[0].id);
    setShowProviderDropdown(false);
  };

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

  const handleNewChat = () => {
    // Rimuovi l'ID dal sessionStorage
    saveCurrentChatId(null);
    setMessages([]);
    console.log('🆕 Nuova chat - sessionStorage pulito');
  };

  const handleSelectChat = (chatId: string) => {
    // Salva l'ID in sessionStorage
    saveCurrentChatId(chatId);
    // Carica i messaggi della conversazione selezionata
    const chatMessages = conversationsData.get(chatId) || [];
    setMessages(chatMessages);
    console.log('📂 Selezionata chat:', chatId);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !address) return;

    // Recupera l'ID dal sessionStorage (può essere null per nuova chat)
    const currentChatId = getCurrentChatId();
    console.log('📤 handleSendMessage - usando chatId:', currentChatId || 'NUOVO');

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Chiamata API al backend con provider, modello E conversation_id
      const response = await api.chat.sendMessage(
        address, 
        currentInput,
        selectedProvider,
        selectedModel,
        currentChatId || undefined  // Passa null come undefined
      );
      
      console.log('✅ Response from backend:', { 
        conversation_id: response.conversation_id, 
        currentChatId_sent: currentChatId 
      });

      // Salva il conversation_id restituito dal backend in sessionStorage
      if (response.conversation_id) {
        saveCurrentChatId(response.conversation_id);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        provider: response.provider,
        model: response.model,
      };
      
      setMessages(prev => {
        const updated = [...prev, aiMessage];
        // Aggiorna anche la Map con la conversazione corrente
        const chatIdToUse = response.conversation_id || currentChatId;
        if (chatIdToUse) {
          setConversationsData(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(chatIdToUse, updated);
            return newMap;
          });
        }
        return updated;
      });
      
      // Aggiorna il titolo della chat con il primo messaggio (se è una nuova chat)
      const chatIdToUse = response.conversation_id || currentChatId;
      if (chatIdToUse) {
        const chatExists = chats.some(c => c.id === chatIdToUse);
        if (!chatExists) {
          const newChat: Chat = {
            id: chatIdToUse,
            title: currentInput.slice(0, 40) + (currentInput.length > 40 ? '...' : ''),
            createdAt: new Date(),
          };
          setChats(prev => [newChat, ...prev]);
        } else if (messages.length === 0) {
          // Aggiorna il titolo se è la prima risposta
          setChats(prev => 
            prev.map(chat => 
              chat.id === chatIdToUse 
                ? { ...chat, title: currentInput.slice(0, 40) + (currentInput.length > 40 ? '...' : '') }
                : chat
            )
          );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <MainHeader />
      
      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden pt-20">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-950 border-r border-gray-800 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={handleNewChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat) => {
            const currentChatId = getCurrentChatId();
            return (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition ${
                  currentChatId === chat.id
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold truncate">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
              <p className="text-xs text-gray-400 truncate">{isConnected ? 'Connected' : 'Disconnected'}</p>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-gray-400 hover:text-white transition"
              title="Disconnect"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Provider Selector */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">PanAI Chat</h1>
          </div>

          {/* Provider Selector - Dropdown Elegante */}
          <div className="relative">
            <button
              onClick={() => setShowProviderDropdown(!showProviderDropdown)}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
            >
              <span className="text-sm">{PROVIDERS[selectedProvider].name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProviderDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                <div className="p-2">
                  {Object.entries(PROVIDERS).map(([key, provider]) => (
                    <button
                      key={key}
                      onClick={() => handleProviderChange(key as ProviderId)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedProvider === key
                          ? 'bg-green-600'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium">{provider.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-xl font-semibold mb-2">Start a new conversation</p>
              <p className="text-sm">Send a message to begin chatting with {PROVIDERS[selectedProvider].name}</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-green-600'
                        : 'bg-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area with Model Selector */}
        <div className="border-t border-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            {/* Model Selector sopra la textarea */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">
                Each message can use a different model
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition flex items-center gap-2"
                >
                  <span>🤖 {selectedModel}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showModelDropdown && (
                  <div className="absolute right-0 bottom-full mb-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                    <div className="p-2">
                      <div className="text-xs text-gray-400 px-3 py-1 mb-1">
                        {PROVIDERS[selectedProvider].name} Models
                      </div>
                      {PROVIDERS[selectedProvider].models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            if (model.available) {
                              setSelectedModel(model.id);
                              setShowModelDropdown(false);
                            }
                          }}
                          disabled={!model.available}
                          className={`w-full text-left px-3 py-2 rounded-lg transition text-sm flex items-center justify-between ${
                            selectedModel === model.id
                              ? 'bg-blue-600'
                              : model.available
                              ? 'hover:bg-gray-700'
                              : 'opacity-50 cursor-not-allowed bg-gray-900'
                          }`}
                        >
                          <span className={!model.available ? 'line-through' : ''}>
                            {model.name}
                          </span>
                          {!model.available && (
                            <span className="text-xs bg-red-600 px-2 py-0.5 rounded">
                              Not available
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Send a message..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Messages will be notarized on Base blockchain
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
