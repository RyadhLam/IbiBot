class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.createWidget();
    this.bindEvents();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'chat-widget-container';
    widget.innerHTML = `
      <div class="chat-widget ${this.isOpen ? 'open' : ''}">
        <div class="chat-content" style="display: ${this.isOpen ? 'flex' : 'none'}">
          <div class="chat-header">
            <h3>Assistant IA</h3>
            <button class="close-chat">×</button>
          </div>
          <div class="chat-messages"></div>
          <form class="chat-input-form">
            <input type="text" placeholder="Écrivez votre message..." class="chat-input">
            <button type="submit" class="send-message">Envoyer</button>
          </form>
        </div>
        <button class="toggle-chat-button">
          💬 Chat
        </button>
      </div>
    `;
    document.body.appendChild(widget);
    this.widget = widget;
    this.addWelcomeMessage();
  }

  addWelcomeMessage() {
    const welcomeMessage = {
      text: window.chatWidgetSettings?.welcome_message || "Bonjour ! Comment puis-je vous aider ?",
      isBot: true
    };
    this.addMessage(welcomeMessage);
  }

  bindEvents() {
    const toggleButton = this.widget.querySelector('.toggle-chat-button');
    const closeButton = this.widget.querySelector('.close-chat');
    const form = this.widget.querySelector('.chat-input-form');

    toggleButton.addEventListener('click', () => this.toggleChat());
    closeButton.addEventListener('click', () => this.toggleChat());
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const content = this.widget.querySelector('.chat-content');
    const chatWidget = this.widget.querySelector('.chat-widget');
    
    if (this.isOpen) {
      chatWidget.classList.add('open');
      content.style.display = 'flex';
    } else {
      chatWidget.classList.remove('open');
      content.style.display = 'none';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const input = this.widget.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    this.addMessage({ text: message, isBot: false });
    input.value = '';

    // Simuler une réponse du bot
    setTimeout(() => {
      this.addMessage({ 
        text: "Je suis en train d'apprendre à répondre. Bientôt, je pourrai vous aider !", 
        isBot: true 
      });
    }, 1000);
  }

  addMessage(message) {
    const messagesContainer = this.widget.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${message.isBot ? 'bot' : 'user'}`;
    messageElement.textContent = message.text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Initialiser le widget quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  new ChatWidget();
}); 