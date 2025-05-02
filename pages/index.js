import { useState, useEffect, useRef } from 'react'; import Head from 'next/head'; import { RotateCcw, Trash2, Send, Info, Paperclip, Menu } from 'lucide-react';

const ChatBubble = ({ message }) => { const isUser = message.role === 'user'; return ( <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}> <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words whitespace-pre-wrap text-[15px] leading-[1.5] font-normal ${ isUser ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none' }`} > {message.content} {message.image && ( <img
src={message.image}
alt="Uploaded"
className="mt-2 rounded-md w-full max-h-60 object-contain"
/> )} </div> </div> ); };

const TypingAnimation = () => (

  <div className="flex space-x-1">
    <Dot />
    <Dot delay={200} />
    <Dot delay={400} />
  </div>
);const Dot = ({ delay = 0 }) => ( <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: ${delay}ms }} /> );

export default function Home() { const [messages, setMessages] = useState([]); const [input, setInput] = useState(''); const [isTyping, setIsTyping] = useState(false); const [imageFile, setImageFile] = useState(null); const [drawerOpen, setDrawerOpen] = useState(false); const inputRef = useRef(null); const endOfMessagesRef = useRef(null);

useEffect(() => { const stored = localStorage.getItem('chat_messages'); if (stored) { try { setMessages(JSON.parse(stored)); } catch { console.error('Failed to load messages'); } } else { setMessages([{ role: 'assistant', content: 'Halo, saya Smile AI!' }]); } }, []);

useEffect(() => { localStorage.setItem('chat_messages', JSON.stringify(messages)); }, [messages]);

useEffect(() => { setTimeout(() => scrollToBottom(), 100); }, [messages, isTyping]);

useEffect(() => { autoResizeTextarea(); }, [input]);

const scrollToBottom = () => { endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' }); };

const autoResizeTextarea = () => { const textarea = inputRef.current; if (textarea) { textarea.style.height = 'auto'; textarea.style.height = ${textarea.scrollHeight}px; } };

const addMessage = (role, content, image = null) => { setMessages((prev) => [...prev, { role, content, image }]); };

const clearChat = () => { setMessages([]); setInput(''); setImageFile(null); localStorage.removeItem('chat_messages'); };

const regenerateResponse = async () => { const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0]; if (!lastUserMessage) return; setIsTyping(true); try { const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, { role: 'user', content: lastUserMessage.content }], }), }); const data = await res.json(); if (res.ok) setMessages((prev) => [...prev, data.message]); else alert(data.error || 'Error generating response'); } catch (err) { alert(err.message || 'Error generating response'); } finally { setIsTyping(false); } };

const handleSubmit = async (e) => { e.preventDefault(); if (!input.trim() && !imageFile) return;

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
  if (res.ok) setMessages((prev) => [...prev, data.message]);
  else alert(data.error || 'Error generating response');
} catch (err) {
  alert(err.message || 'Error generating response');
} finally {
  setIsTyping(false);
  setImageFile(null);
}

};

const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } };

return ( <> <Head> <link
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
rel="stylesheet"
/> </Head> <div className="flex h-screen bg-gray-900 text-white font-sans" style={{ fontFamily: '"Inter", sans-serif' }} > {/* Sidebar Drawer */} {drawerOpen && ( <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 fixed top-0 bottom-0 left-0 z-50"> <h2 className="text-lg font-semibold mb-4">Smile Bot</h2> <button
className="w-full text-left text-sm font-medium text-white hover:bg-gray-700 px-3 py-2 rounded"
onClick={clearChat}
> Obrolan Baru </button> <hr className="my-3 border-gray-600" /> <p className="text-sm text-gray-400">Session sebelumnya (belum aktif)</p> </div> )}

<div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <button onClick={() => setDrawerOpen(!drawerOpen)} className="text-gray-300 hover:text-white">
          <Menu size={20} />
        </button>
        <span className="text-lg font-semibold text-center flex-1 -ml-5">Smile Bot AI</span>
        <a
          href="/about.html"
          className="flex items-center gap-1 font-bold text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Info className="w-4 h-4" />
          About
        </a>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2 pb-32 text-[15px] leading-[1.5]">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-700 px-4 py-2 rounded-lg rounded-bl-none text-white max-w-xs md:max-w-md">
              <TypingAnimation />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </main>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-800 border-t border-gray-700"
      >
        <div className="relative flex items-end gap-2">
          <label htmlFor="image-upload" className="text-gray-400 hover:text-white cursor-pointer p-2">
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
            onClick={regenerateResponse}
            disabled={isTyping || messages.length === 0}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
          >
            <RotateCcw size={16} />
            Regenerate
          </button>
          <button
            type="button"
            onClick={clearChat}
            disabled={isTyping && messages.length === 0}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </form>
    </div>
  </div>
</>

); }

