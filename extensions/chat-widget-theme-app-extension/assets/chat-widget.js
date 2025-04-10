class ChatWidget {
  constructor() {
    this.widget = document.getElementById('shopify-chat-widget');
    if (!this.widget) return;

    this.welcomeMessage = this.widget.dataset.welcomeMessage;
    this.buttonColor = this.widget.dataset.buttonColor;
    this.buttonText = this.widget.dataset.buttonText;
    this.buttonStyle = this.widget.dataset.buttonStyle || 'circle';
    this.buttonIcon = this.widget.dataset.buttonIcon || 'chat';
    this.chatTitle = this.widget.dataset.chatTitle;
    this.headerColor = this.widget.dataset.headerColor;
    this.chatBackground = this.widget.dataset.chatBackground;
    this.userMessageColor = this.widget.dataset.userMessageColor;
    this.botMessageColor = this.widget.dataset.botMessageColor;
    this.chatPosition = this.widget.dataset.chatPosition || 'bottom-right';
    this.chatLogo = this.widget.dataset.chatLogo;
    this.logoSize = this.widget.dataset.logoSize || '32';

    this.quickButtons = [
      {
        text: "📦 Suivi de commande",
        message: "Je voudrais suivre ma commande"
      },
      {
        text: "👋 Contacter le service client",
        message: "Je souhaite contacter le service client"
      }
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

    // Créer le bouton de chat
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

    // Structure de la fenêtre de chat
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
          <div class="message-content">${this.welcomeMessage}</div>
        </div>
      </div>
      <div class="chat-quick-buttons">
        ${this.quickButtons.map(button => `
          <button class="quick-button" data-message="${button.message}">
            ${button.text}
          </button>
        `).join('')}
      </div>
      <form class="chat-form">
        <input type="text" placeholder="Tapez votre message..." required>
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

    // Initialiser les écouteurs d'événements pour les boutons rapides
    const quickButtons = chatWindow.querySelectorAll('.quick-button');
    quickButtons.forEach(button => {
      button.addEventListener('click', () => {
        const message = button.dataset.message;
        this.addMessage(message, true);
        
        setTimeout(() => {
          let response;
          if (message.includes('commande')) {
            response = "Pour suivre votre commande, veuillez me fournir votre numéro de commande.";
          } else if (message.includes('service client')) {
            response = "Je vais vous mettre en relation avec notre service client. En attendant, pouvez-vous me décrire votre problème ?";
          }
          this.addMessage(response, false);
        }, 1000);
      });
    });

    // Rendre le conteneur visible
    chatContainer.style.display = 'block';
  }

  addMessage(message, isUser = false) {
    const messagesContainer = this.widget.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  initializeEventListeners() {
    const chatButton = this.widget.querySelector('.chat-widget-button');
    const chatWindow = this.widget.querySelector('.chat-window');
    const chatForm = this.widget.querySelector('.chat-form');
    const closeIcon = chatButton.querySelector('.close-icon');
    const chatIcon = chatButton.querySelector('.chat-icon');

    chatButton.addEventListener('click', () => {
      const isOpen = chatWindow.classList.contains('open');
      chatWindow.classList.toggle('open');
      closeIcon.style.display = isOpen ? 'none' : 'block';
      chatIcon.style.display = isOpen ? 'block' : 'none';
      chatButton.classList.toggle('active');
    });

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      const message = input.value.trim();
      
      if (message) {
        this.addMessage(message, true);
        input.value = '';
        
        setTimeout(() => {
          this.addMessage("Je vais vous aider avec votre demande. Un instant s'il vous plaît...", false);
        }, 1000);
      }
    });
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
}

// Initialiser le widget quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  new ChatWidget();
}); 