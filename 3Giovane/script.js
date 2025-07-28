document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    const API_KEY = 'sk-ecafc15602fd4d87a350073e44b1bed8'; 
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Verifique o endpoint correto
    
    // Alternar visibilidade do chat
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });
    
    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
    
    // Enviar mensagem quando clicar no botão ou pressionar Enter
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Adicionar mensagem do usuário ao chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Chamar a API do DeepSeek
        fetchDeepSeekResponse(message);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    async function fetchDeepSeekResponse(prompt) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat", // Verifique o modelo correto
                    messages: [
                        {
                            role: "system",
                            content: "Você é um assistente de suporte útil."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            addMessage(botResponse, 'bot');
            
        } catch (error) {
            console.error('Erro ao chamar a API:', error);
            addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.', 'bot');
        }
    }
    
    // Mensagem inicial quando o chat é aberto
    chatToggle.addEventListener('click', function firstMessage() {
        if (!chatMessages.hasChildNodes()) {
            addMessage('Olá! Como posso ajudar você hoje?', 'bot');
        }
        chatToggle.removeEventListener('click', firstMessage);
    });
});