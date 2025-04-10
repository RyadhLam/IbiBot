class ChatWidget {
  constructor() {
    this.widget = document.getElementById('shopify-chat-widget');
    if (!this.widget) return;

    // Récupération des paramètres de personnalisation
    this.welcomeMessage = this.widget.dataset.welcomeMessage;
    this.chatTitle = this.widget.dataset.chatTitle;
    this.buttonStyle = this.widget.dataset.buttonStyle;
    this.buttonIcon = this.widget.dataset.buttonIcon;
    this.buttonText = this.widget.dataset.buttonText;
    this.buttonColor = this.widget.dataset.buttonColor;
    this.headerColor = this.widget.dataset.headerColor;
    this.chatBackground = this.widget.dataset.chatBackground;
    this.userMessageColor = this.widget.dataset.userMessageColor;
    this.botMessageColor = this.widget.dataset.botMessageColor;
    this.chatPosition = this.widget.dataset.chatPosition;
    this.logo = this.widget.dataset.logo;
    this.logoSize = this.widget.dataset.logoSize;

    this.createWidget();
    this.applyCustomStyles();
    this.initializeEventListeners();
  }

  getIconSvg() {
    const icons = {
      chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>`,
      message: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
               </svg>`,
      help: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`
    };
    return icons[this.buttonIcon] || icons.chat;
  }

  createWidget() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-widget-container';
    chatContainer.setAttribute('data-position', this.chatPosition);

    const chatButton = document.createElement('button');
    chatButton.className = 'chat-widget-button';
    chatButton.setAttribute('data-style', this.buttonStyle);
    chatButton.style.backgroundColor = this.buttonColor;
    
    if (this.buttonStyle === 'circle') {
      chatButton.innerHTML = this.getIconSvg();
    } else {
      chatButton.textContent = this.buttonText;
    }

    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.setAttribute('data-position', this.chatPosition);
    
    let headerContent = this.logo 
      ? `<img src="${this.logo}" class="chat-header-logo" style="width: ${this.logoSize}px; height: ${this.logoSize}px;">`
      : '';
    headerContent += `<span>${this.chatTitle}</span>`;

    chatWindow.innerHTML = `
      <div class="chat-header">${headerContent}</div>
      <div class="chat-messages">
        <div class="message bot-message">${this.welcomeMessage}</div>
      </div>
      <div class="quick-actions">
        <button type="button" class="quick-action-button" data-action="track">
          <span>Suivi de commande</span>
        </button>
        <button type="button" class="quick-action-button" data-action="contact">
          <span>Contactez notre service client</span>
        </button>
      </div>
      <form class="chat-form">
        <div class="message-input-container">
          <input type="text" placeholder="Tapez votre message..." required>
          <button type="submit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    `;

    chatContainer.appendChild(chatButton);
    chatContainer.appendChild(chatWindow);
    this.widget.appendChild(chatContainer);

    this.initializeQuickActions();
  }

  applyCustomStyles() {
    const chatWindow = this.widget.querySelector('.chat-window');
    const header = chatWindow.querySelector('.chat-header');
    const messages = chatWindow.querySelectorAll('.message');
    const userMessages = chatWindow.querySelectorAll('.user-message');
    const botMessages = chatWindow.querySelectorAll('.bot-message');

    chatWindow.style.background = this.chatBackground;
    header.style.backgroundColor = this.headerColor;

    userMessages.forEach(msg => {
      msg.style.backgroundColor = this.userMessageColor;
    });

    botMessages.forEach(msg => {
      msg.style.backgroundColor = this.botMessageColor;
    });
  }

  addMessage(message, isUser = false) {
    const messagesContainer = this.widget.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    messageDiv.style.backgroundColor = isUser ? this.userMessageColor : this.botMessageColor;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  initializeEventListeners() {
    const chatButton = this.widget.querySelector('.chat-widget-button');
    const chatWindow = this.widget.querySelector('.chat-window');
    const chatForm = this.widget.querySelector('.chat-form');

    chatButton.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
    });

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      const message = input.value.trim();
      
      if (message) {
        this.addMessage(message, true);
        input.value = '';
        
        setTimeout(() => {
          this.addMessage("Je vais vous aider avec votre demande. Un instant s'il vous plaît...");
        }, 1000);
      }
    });
  }

  initializeQuickActions() {
    const quickButtons = this.widget.querySelectorAll('.quick-action-button');
    quickButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        let message = '';
        
        switch(action) {
          case 'track':
            message = "Je souhaite suivre ma commande";
            break;
          case 'contact':
            message = "Je souhaite contacter le service client";
            break;
        }
        
        if (message) {
          this.addMessage(message, true);
          setTimeout(() => {
            this.addMessage("Je vais vous aider avec votre demande. Un instant s'il vous plaît...");
          }, 1000);
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ChatWidget();
}); 