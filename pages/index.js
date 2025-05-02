import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { RotateCcw, Trash2, Send, Info, Paperclip, Menu, X, Bot } from 'lucide-react';

const ChatBubble = ({ message }) => {
  const isUser  = message.role === 'user';
  return (
    <div className={`flex ${isUser  ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl break-words whitespace-pre-wrap text-[15px] leading-[1.5] font-normal ${
          isUser  ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'
        }`}
      >
        <div>{message.content}</div>
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            className="mt-2 rounded-md w-full max-h-60 object-contain"
          />
        )}
      </div>
    </div>
  );
};

const TypingAnimation = () => (
  <div className="flex space-x-1">
    <Dot />
    <Dot delay={200} />
    <Dot delay={400} />
  </div>
);

const Dot = ({ delay = 0 }) => (
  <span
    className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
    style={{ animationDelay: `${delay}ms` }}
  />
);

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo, saya Smile AI!' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const inputRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const overlayRef = useRef(null);
  
  // State untuk menyimpan session sebelumnya
  const [previousSessions, setPreviousSessions] = useState([]);

  useEffect(() => {
    // Mengambil session sebelumnya dari localStorage saat komponen dimuat
    const storedSessions = JSON.parse(localStorage.getItem('chatSessions')) || [];
    setPreviousSessions(storedSessions);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }, [messages, isTyping]);

  const addMessage = (role, content, image = null) => {
    setMessages((prev) => [...prev, { role, content, image }]);
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setImageFile(null);
  };

  const startNewSession = () => {
    // Simpan session sebelumnya ke localStorage jika ada pesan lebih dari satu
    if (messages.length > 1) {
      const updatedSessions = [...previousSessions, messages];
      setPreviousSessions(updatedSessions);
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    }
    // Reset chat
    setMessages([{ role: 'assistant', content: 'Halo, saya Smile AI!' }]);
    setInput('');
    setImageFile(null);
    setDrawerOpen(false);
  };

  const loadSession = (session) => {
    setMessages(session);
    setInput('');
    setImageFile(null);
    setDrawerOpen(false);
  };

  const deleteSession = (index) => {
    const updatedSessions = [...previousSessions];
    updatedSessions.splice(index, 1);
    setPreviousSessions(updatedSessions);
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    const userMessage = input.trim();
    const imagePreview = imageFile ? URL.createObjectURL(imageFile) : null;
    addMessage('user', userMessage, imagePreview);
    setInput('');
    setIsTyping(true);

    const formData = new FormData();
    formData.append('input', userMessage);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        alert(data.error || 'Error generating response');
      }
    } catch (err) {
      alert(err.message || 'Error generating response');
    } finally {
      setIsTyping(false);
      setImageFile(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <Head>
    <title>Smile Bot AI</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="flex h-screen bg-gray-900 text-white font-sans relative"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Overlay + Drawer */}
        {drawerOpen && (
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex"
          >
            <div className="bg-gray-800 w-56 h-full p-4 border-r border-gray-700 z-50 flex flex-col">
              <button
                onClick={startNewSession}
                className="w-full text-left text-sm font-semibold px-3 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
              >
                + Obrolan Baru
              </button>
              <hr className="border-gray-700 mt-4" />
              {/* Daftar session sebelumnya */}
              <div className="mt-4 flex-1 overflow-auto">
                {previousSessions.length === 0 && (
                  <p className="text-gray-500 text-sm text-center mt-2">Belum ada sesi sebelumnya</p>
                )}
                {previousSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2"
                  >
                    <button
                      onClick={() => loadSession(session)}
                      className="text-left text-sm font-semibold px-3 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 flex-1 truncate"
                      title={`Session ${index + 1}`}
                    >
                      Session {index + 1}
                    </button>
                    <button
                      onClick={() => deleteSession(index)}
                      className="ml-2 p-1 rounded-md border border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white"
                      aria-label={`Hapus Session ${index + 1}`}
                      title={`Hapus Session ${index + 1}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1 h-full">
          <header className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center relative">
            <button onClick={() => setDrawerOpen(true)}>
              <Menu className="text-white" />
            </button>
            <span className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
          <Bot size={18} className="mr-8 text-white" />
              Smile Bot AI
            </span>
            <a
              href="/about.html"
              className="flex items-center gap-1 font-bold text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Info className="w-4 h-4" />
              About
            </a>
          </header>

          <main className="flex-1 overflow-y-auto p-4 space-y-2 pb-32 text-[15px] leading-[1.5]">
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} message={msg} />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-none text-white max-w-[80%]">
                  <TypingAnimation />
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </main>

          <form
            onSubmit={handleSubmit}
            className="p-4 bg-gray-800 border-t border-gray-700"
          >
            <div className="relative flex items-end gap-2">
              <label
                htmlFor="image-upload"
                className="text-gray-400 hover:text-white cursor-pointer p-2"
              >
                <Paperclip size={20} />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <textarea
                ref={inputRef}
                className="flex-1 border border-gray-600 bg-gray-900 text-white rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-[15px] overflow-hidden"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                maxLength={2000}
              />
              <button
                type="submit"
                className="text-gray-400 hover:text-white p-2"
                disabled={isTyping || (!input.trim() && !imageFile)}
              >
                <Send size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <button
                type="button"
                onClick={() => {}}
                disabled
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 opacity-50 cursor-not-allowed"
              >
                <RotateCcw size={16} />
                Regenerate
              </button>
              <button
                type="button"
                onClick={clearChat}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
