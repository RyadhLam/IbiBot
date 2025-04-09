import { useState } from "react";
import { Form } from "@remix-run/react";

export function ChatWidget() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;
    
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, { text: message, isUser: true }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      // Ajouter la réponse du bot
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error:", error);
    }

    // Réinitialiser le formulaire
    event.currentTarget.reset();
  }

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? "Fermer" : "Chat"}
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 bg-white rounded-lg shadow-xl">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Assistant</h3>
          </div>

          <div className="h-96 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.isUser ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    msg.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <Form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                name="message"
                placeholder="Tapez votre message..."
                className="flex-1 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Envoyer
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
} 