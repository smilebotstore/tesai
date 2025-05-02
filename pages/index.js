import { useState, useEffect, useRef } from 'react'; import Head from 'next/head'; import { RotateCcw, Trash2, Send, Info, Paperclip, Menu } from 'lucide-react';

const ChatBubble = ({ message }) => { const isUser = message.role === 'user'; return ( <div className={flex ${isUser ? 'justify-end' : 'justify-start'} mb-2}> <div className={max-w-[80%] px-4 py-2 rounded-2xl break-words whitespace-pre-wrap text-[15px] leading-[1.5] font-normal ${ isUser ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none' }} > <div>{message.content}</div> {message.image && ( <img
src={message.image}
alt="Uploaded"
className="mt-2 rounded-md max-w-full h-auto object-contain"
/> )} </div> </div> ); };

const TypingAnimation = () => (

  <div className="flex space-x-1">
    <Dot />
    <Dot delay={200} />
    <Dot delay={400} />
  </div>
);const Dot = ({ delay = 0 }) => ( <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: ${delay}ms }} /> );

export default function Home() { const [messages, setMessages] = useState([]); const [input, setInput] = useState(''); const [isTyping, setIsTyping] = useState(false); const [imageFile, setImageFile] = useState(null); const [drawerOpen, setDrawerOpen] = useState(false); const [sessions, setSessions] = useState([]); const [currentSession, setCurrentSession] = useState(null);

const inputRef = useRef(null); const endOfMessagesRef = useRef(null);

useEffect(() => { const stored = localStorage.getItem('chat_sessions'); if (stored) { const parsed = JSON.parse(stored); setSessions(parsed); if (parsed.length > 0) { setMessages(parsed[0].messages); setCurrentSession(0); } else { const defaultSession = [{ role: 'assistant', content: 'Halo, saya Smile AI!' }]; setMessages(defaultSession); setSessions([{ id: Date.now(), messages: defaultSession }]); setCurrentSession(0); } } }, []);

useEffect(() => { if (sessions.length > 0 && currentSession !== null) { const updated = [...sessions]; updated[currentSession].messages = messages; setSessions(updated); localStorage.setItem('chat_sessions', JSON.stringify(updated)); } }, [messages]);

useEffect(() => { setTimeout(() => scrollToBottom(), 100); }, [messages, isTyping]);

useEffect(() => { autoResizeTextarea(); }, [input]);

const scrollToBottom = () => { endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' }); };

const autoResizeTextarea = () => { const textarea = inputRef.current; if (textarea) { textarea.style.height = 'auto'; textarea.style.height = ${textarea.scrollHeight}px; } };

const addMessage = (role, content, image = null) => { setMessages((prev) => [...prev, { role, content, image }]); };

const clearChat = () => { if (currentSession !== null) { const updated = [...sessions]; updated[currentSession].messages = []; setSessions(updated); setMessages([]); localStorage.setItem('chat_sessions', JSON.stringify(updated)); } setInput(''); setImageFile(null); };

const regenerateResponse = async () => { if (messages.length === 0) return; const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0]; if (!lastUserMessage) return; setIsTyping(true); try { const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, { role: 'user', content: lastUserMessage.content }], }), }); const data = await res.json(); if (res.ok) { setMessages((prev) => [...prev, data.message]); } else { alert(data.error || 'Error generating response'); } } catch (err) { alert(err.message || 'Error generating response'); } finally { setIsTyping(false); } };

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

const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } };

const newSession = () => { const newSess = { id: Date.now(), messages: [{ role: 'assistant', content: 'Halo, saya Smile AI!' }] }; const updated = [newSess, ...sessions]; setSessions(updated); setCurrentSession(0); setMessages(newSess.messages); localStorage.setItem('chat_sessions', JSON.stringify(updated)); setDrawerOpen(false); };

const loadSession = (index) => { setCurrentSession(index); setMessages(sessions[index].messages); setDrawerOpen(false); };

return ( <> <Head> <link
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
rel="stylesheet"
/> </Head> <div className="flex h-screen bg-gray-900 text-white font-sans" style={{ fontFamily: 'Inter, sans-serif' }}> {/* Drawer */} <div className={fixed inset-y-0 left-0 bg-gray-800 w-64 transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-40 overflow-y-auto}> <div className="p-4 border-b border-gray-700"> <button onClick={newSession} className="w-full text-left px-3 py-2 rounded-md bg-green-600 text-white font-semibold text-sm hover:bg-green-700"> Obrolan Baru </button> </div> <div className="border-t border-gray-700"> {sessions.map((s, i) => ( <button key={s.id} onClick={() => loadSession(i)} className={w-full text-left px-3 py-2 text-sm hover:bg-gray-700 ${currentSession === i ? 'bg-gray-700 font-bold' : ''}} > Session {i + 1} </button> ))} </div> </div>

{/* Main content */}
    <div className="flex flex-col flex-1">
      <header className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <button onClick={() => setDrawerOpen(!drawerOpen)} className="text-gray-300 hover:text-white">
          <Menu size={22} />
        </button>
        <span className="text-lg font-semibold text-center flex-1">Smile Bot AI</span>
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
        className="p-4 bg-gray-800 border-t border-gray-700 fixed bottom-0 left-0 right-0"
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

