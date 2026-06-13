import React, { useState, useRef, useEffect, useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import { Sparkles, X, Send, Bot, User, CornerDownLeft, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AiGlobalChat = ({ isOpen, onClose }) => {
  const { askGlobalAI, apiKey, theme } = useContext(BlogContext);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi! I am **Pixel AI**, your blog companion. Ask me anything, or look for specific articles on technology, startups, lifestyle, or finance!',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle intercepting clicks on HTML anchor links in generated content to use React Router instead of full page reloads
  const handleChatClick = (e) => {
    const target = e.target.closest('a');
    if (target && target.getAttribute('href')?.startsWith('/blog/')) {
      e.preventDefault();
      const path = target.getAttribute('href');
      onClose(); // Close chat
      navigate(path); // Programmatic navigate
    }
  };

  const handleSend = async (textToSend) => {
    const userText = textToSend || query;
    if (!userText.trim() || loading) return;

    const newMsg = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setQuery('');
    setLoading(true);

    try {
      const responseText = await askGlobalAI(userText);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'ai',
          text: responseText,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'ai',
          text: "I'm sorry, I couldn't search the articles right now. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestions = [
    'Suggest tech articles',
    'Tips to manage healthy lifestyle',
    'Show articles on Startups',
    'Tell me about luxury home taxes',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-8 w-full sm:w-[440px] h-[100dvh] sm:h-[600px] z-50 flex flex-col glass-panel shadow-2xl rounded-none sm:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/10">
      
      {/* Chat Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200/50 dark:border-white/10 bg-primary/10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/20 text-primary rounded-lg animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-sm sm:text-base">
              Pixel AI Smart Search
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {apiKey ? 'Powered by Gemini 2.5 Flash' : 'Simulated Assistant (Key not set)'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Info Banner when Key is absent */}
      {!apiKey && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
          <Key className="w-3.5 h-3.5 shrink-0" />
          <span>Using Simulated AI. Enter a Gemini Key in the Creator settings for live search responses.</span>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        onClick={handleChatClick}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-bg-dark/40"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-slate-200 dark:bg-white/10 text-primary'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            <div
              className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none'
              }`}
            >
              {msg.sender === 'ai' ? (
                <div 
                  className="prose-sm dark:prose-invert"
                  dangerouslySetInnerHTML={{ 
                    __html: msg.text
                      // Convert bold text formatting **text** to HTML tags
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br />')
                  }} 
                />
              ) : (
                <p>{msg.text}</p>
              )}
              <span className="block text-[9px] text-right mt-1.5 opacity-60">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 text-primary flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5 px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && (
        <div className="p-4 bg-slate-100/50 dark:bg-white/3 border-t border-slate-200/30 dark:border-white/5">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-2 uppercase tracking-wide">
            Suggested Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 rounded-lg hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 cursor-pointer text-left transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-900 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI search helper..."
          className="flex-1 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-slate-800/80 text-slate-800 dark:text-slate-200"
        />
        <button
          onClick={() => handleSend()}
          disabled={!query.trim() || loading}
          className="p-2 bg-primary hover:bg-primary-dark disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl cursor-pointer disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AiGlobalChat;
