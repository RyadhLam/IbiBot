class ChatWidget {
  constructor() {
    this.widget = document.getElementById('shopify-chat-widget');
    if (!this.widget) return;

    // Récupérer toutes les options de personnalisation
    this.welcomeMessage = this.widget.dataset.welcomeMessage;
    this.buttonColor = this.widget.dataset.buttonColor;
    this.buttonText = this.widget.dataset.buttonText;
    this.buttonStyle = this.widget.dataset.buttonStyle;
    this.buttonIcon = this.widget.dataset.buttonIcon;
    this.chatTitle = this.widget.dataset.chatTitle;
    this.headerColor = this.widget.dataset.headerColor;
    this.chatBackground = this.widget.dataset.chatBackground;
    this.userMessageColor = this.widget.dataset.userMessageColor;
    this.botMessageColor = this.widget.dataset.botMessageColor;
    this.chatPosition = this.widget.dataset.chatPosition;
    this.chatLogo = this.widget.dataset.chatLogo;
    this.logoSize = this.widget.dataset.logoSize;

    // Suggestions de questions prédéfinies
    this.suggestions = [
      'Suivre ma commande',
      'Contacter le service client'
    ];

    this.createWidget();
    this.initializeEventListeners();
    this.applyCustomStyles();
  }

  getIconSvg() {
    const icons = {
      chat: `<svg class="chat-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>`,
      message: `<svg class="chat-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
      </svg>`,
      support: `<svg class="chat-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>`
    };

    return icons[this.buttonIcon] || icons.chat;
  }

  createWidget() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-widget-container';
    chatContainer.style.display = 'none';

    // Créer le bouton de chat avec icône
    const chatButton = document.createElement('button');
    chatButton.className = `chat-widget-button ${this.buttonStyle}`;
    chatButton.style.backgroundColor = this.buttonColor;
    chatButton.style.color = '#FFFFFF';
    chatButton.innerHTML = `
      ${this.getIconSvg()}
      ${this.buttonStyle === 'rectangle' ? `<span class="button-text">${this.buttonText}</span>` : ''}
      <svg class="close-icon" viewBox="0 0 24 24" width="24" height="24" style="display: none;">
        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
      </svg>
    `;

    // Créer la fenêtre de chat
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-title">
          ${this.chatLogo ? `
            <img src="${this.chatLogo}" 
                 alt="${this.chatTitle}" 
                 class="chat-logo"
                 style="width: ${this.logoSize}px; height: ${this.logoSize}px;"
            >
          ` : `<div class="chat-header-dot"></div>`}
          <h3>${this.chatTitle}</h3>
        </div>
      </div>
      <div class="chat-messages">
        <div class="message bot-message">
          <div class="bot-avatar">
            <img src="{{ 'bot-avatar.gif' | asset_url }}" alt="Bot Avatar">
          </div>
          <div class="message-content">${this.welcomeMessage}</div>
        </div>
      </div>
      <div class="suggestions-container">
        ${this.suggestions.map(suggestion => `
          <button class="suggestion-button" type="button">${suggestion}</button>
        `).join('')}
      </div>
      <form class="chat-form">
        <input type="text" placeholder="Écrire un message..." required>
        <button type="submit">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    `;

    chatContainer.appendChild(chatButton);
    chatContainer.appendChild(chatWindow);
    this.widget.appendChild(chatContainer);

    // Rendre le conteneur visible après l'avoir ajouté au DOM
    chatContainer.style.display = 'block';
  }

  applyCustomStyles() {
    const style = document.createElement('style');
    const isLeftPosition = this.chatPosition === 'bottom-left';
    
    style.textContent = `
      .chat-widget-container {
        ${isLeftPosition ? 'left: 20px; right: auto;' : 'right: 20px; left: auto;'}
      }
      
      .chat-window {
        ${isLeftPosition ? 'left: 20px; right: auto;' : 'right: 20px; left: auto;'}
      }

      .chat-header {
        background-color: ${this.headerColor} !important;
      }

      .chat-messages {
        background-color: ${this.chatBackground};
      }

      .user-message .message-content {
        background-color: ${this.userMessageColor};
        color: white;
      }
      
      .bot-message .message-content {
        background-color: ${this.botMessageColor};
        color: #333333;
      }

      .chat-form button {
        background-color: ${this.buttonColor};
        color: white;
      }
      
      .chat-widget-button.rectangle {
        width: auto;
        padding: 0 20px;
        border-radius: 30px;
        gap: 10px;
      }
      
      .chat-widget-button .button-text {
        font-size: 14px;
        white-space: nowrap;
      }
      
      .chat-logo {
        border-radius: 50%;
        object-fit: cover;
        margin-right: 10px;
      }
      
      .chat-header-title {
        display: flex;
        align-items: center;
      }

      @media (max-width: 768px) {
        .chat-window {
          width: calc(100% - 40px);
          ${isLeftPosition ? 'left: 20px; right: 20px;' : 'right: 20px; left: 20px;'}
        }
      }
    `;
    document.head.appendChild(style);
  }

  initializeEventListeners() {
    const chatButton = this.widget.querySelector('.chat-widget-button');
    const chatWindow = this.widget.querySelector('.chat-window');
    const chatIcon = chatButton.querySelector('.chat-icon');
    const closeIcon = chatButton.querySelector('.close-icon');
    const chatForm = this.widget.querySelector('.chat-form');
    const suggestionButtons = this.widget.querySelectorAll('.suggestion-button');

    // Ouvrir/fermer la fenêtre de chat
    chatButton.addEventListener('click', () => {
      const isOpen = chatWindow.classList.toggle('open');
      chatIcon.style.display = isOpen ? 'none' : 'block';
      closeIcon.style.display = isOpen ? 'block' : 'none';
      chatButton.classList.toggle('active');
    });

    // Gérer les clics sur les suggestions
    suggestionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const message = button.textContent;
        this.addMessage(message, true);
        this.handleUserMessage(message);
      });
    });

    // Gérer l'envoi des messages
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      const message = input.value.trim();
      if (!message) return;

      this.addMessage(message, true);
      input.value = '';
      await this.handleUserMessage(message);
    });
  }

  addMessage(text, isUser) {
    const messagesContainer = this.widget.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    let messageHTML = '';
    if (!isUser) {
      messageHTML += `
        <div class="bot-avatar">
          <img src="{{ 'bot-avatar.gif' | asset_url }}" alt="Bot Avatar">
        </div>
      `;
    }
    messageHTML += `<div class="message-content">${text}</div>`;
    messageDiv.innerHTML = messageHTML;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async handleUserMessage(message) {
    try {
      const response = await fetch('/apps/chat-assistant/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      this.addMessage(data.response, false);
    } catch (error) {
      console.error('Error:', error);
      this.addMessage('Désolé, une erreur est survenue. Veuillez réessayer.', false);
    }
  }
}

// Initialiser le widget quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  new ChatWidget();
}); 