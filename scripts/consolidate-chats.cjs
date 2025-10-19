const fs = require('fs');
const path = require('path');

// Leggi il file JSON
const userFile = path.join(__dirname, 'chats', 'chats_0x13dAcfE3c9e3836b5F6385Ac31960C38eFc69c35.json');
const data = JSON.parse(fs.readFileSync(userFile, 'utf8'));

if (data.conversations && data.conversations.length > 0) {
  // Consolida tutte le conversazioni in una sola
  const allMessages = [];
  
  data.conversations.forEach(conv => {
    allMessages.push(...conv.messages);
  });
  
  // Crea una singola conversazione con tutti i messaggi
  const singleConversation = {
    id: '1',
    title: 'Chat History',
    messages: allMessages,
    createdAt: data.conversations[0].createdAt,
    updatedAt: data.conversations[data.conversations.length - 1].updatedAt
  };
  
  data.conversations = [singleConversation];
  
  // Salva il file
  fs.writeFileSync(userFile, JSON.stringify(data, null, 2), 'utf8');
  
  console.log(`✅ Consolidate ${allMessages.length} messages into single conversation`);
  console.log(`   Previous conversations: ${data.conversations.length}`);
} else {
  console.log('ℹ️ No conversations found or already consolidated');
}
