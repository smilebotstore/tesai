import { useState, useEffect, useRef } from 'react';

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words whitespace-pre-wrap ${
          isUser ? 'bg-userMessage text-gray-900 rounded-br-none' : 'bg-aiMessage text-gray-900 rounded-bl-none'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
  };

  const regenerateResponse = async () => {
    if (messages.length === 0) return;
    const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0];
    if (!lastUserMessage) return;
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: lastUserMessage.content }] }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        alert(data.error || 'Error generating response');
      }
    } catch (error) {
      alert(error.message || 'Error generating response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        alert(data.error || 'Error generating response');
      }
    } catch (error) {
      alert(error.message || 'Error generating response');
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Shift+Enter for new line in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-chatBackground">
      <header className="bg-white shadow p-4 text-center font-bold text-xl border-b border-gray-300">
        ChatGPT
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-aiMessage px-4 py-2 rounded-lg rounded-bl-none text-gray-900 max-w-xs md:max-w-md">
              <TypingAnimation />
            </div>
          </div>
        )}
      </main>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-300 fixed bottom-0 left-0 right-0">
        <textarea
          ref={inputRef}
          className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          maxLength={2000}
        />
        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={regenerateResponse}
            disabled={isTyping || messages.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Regenerate Response
          </button>
          <button
            type="button"
            onClick={clearChat}
            disabled={isTyping && messages.length === 0}
            className="bg-gray-400 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Clear Chat
          </button>
        </div>
      </form>
    </div>
  );
}

const TypingAnimation = () => {
  return (
    <div className="flex space-x-1">
      <Dot />
      <Dot delay={200} />
      <Dot delay={400} />
    </div>
  );
};

const Dot = ({ delay = 0 }) => {
  return (
    <span
      className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
};
