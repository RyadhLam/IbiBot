import { useState, useRef, useEffect } from 'react';
import {
  Card,
  Button,
  TextField,
  Icon,
  Frame,
  Modal,
  TextContainer,
  Text,
} from '@shopify/polaris';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simuler une réponse du chatbot (à remplacer par votre API IA)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Je suis en train d'apprendre à répondre. Bientôt, je pourrai vous aider !",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const modalMarkup = (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Assistant IA"
    >
      <Modal.Section>
        <div style={{ height: '400px', overflowY: 'auto', marginBottom: '20px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                marginBottom: '12px',
              }}
            >
              <TextContainer>
                <Text as="p" variant={message.isUser ? "bodyMd" : "bodyMd"}>
                  {message.text}
                </Text>
              </TextContainer>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <TextField
              label=""
              value={inputValue}
              onChange={setInputValue}
              autoComplete="off"
              placeholder="Écrivez votre message..."
              multiline={1}
              onBlur={() => {}}
            />
          </div>
          <Button variant="primary" onClick={handleSendMessage}>
            Envoyer
          </Button>
        </div>
      </Modal.Section>
    </Modal>
  );

  return (
    <Frame>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <Button onClick={() => setIsOpen(true)} variant="primary">
          💬 Chat
        </Button>
      </div>
      {modalMarkup}
    </Frame>
  );
} 