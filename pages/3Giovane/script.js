document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    const API_KEY = 'sk-ecafc15602fd4d87a350073e44b1bed8';
    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    
    // Mensagem inicial do bot
    addMessage('Olá! Sou o assistente de suporte. Como posso ajudar você hoje?', 'bot');
    
    // Enviar mensagem ao clicar no botão ou pressionar Enter
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addMessage(message, 'user');
        userInput.value = '';
        
        // Mostrar indicador de digitação
        showTypingIndicator();
        
        fetchDeepSeekResponse(message);
    }
    
    function addMessage(text, sender) {
        // Remover indicador de digitação se existir
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
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
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: "Você é um assistente de suporte útil e prestativo. Responda de forma clara e concisa."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro na API:', errorData);
                throw new Error(`Erro: ${response.status}`);
            }
            
            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            addMessage(botResponse, 'bot');
            
        } catch (error) {
            console.error('Erro ao chamar a API:', error);
            addMessage('Houve um problema ao processar sua solicitação. Por favor, tente novamente.', 'bot');
        }
    }
});