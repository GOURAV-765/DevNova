import React, { useState, useEffect, useRef, useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import { Sparkles, Send, Bot, User, CheckSquare, MessageSquare, ListCollapse, AlertTriangle, Key } from 'lucide-react';

const AiAssistant = ({ blog }) => {
  const { summarizeBlogWithAI, askAIChatbot, apiKey } = useContext(BlogContext);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'chat'
  
  // Summary Tab States
  const [takeaways, setTakeaways] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Chat Tab States
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I have fully read and indexed this article on "${blog.title}". Feel free to ask me any questions or query specific details from the content!`,
      timestamp: new Date(),
    },
  ]);
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Reset assistant state when changing blogs
    setTakeaways([]);
    setChatHistory([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Hello! I have fully read and indexed this article on "${blog.title}". Feel free to ask me any questions or query specific details from the content!`,
        timestamp: new Date(),
      },
    ]);
  }, [blog._id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loadingChat]);

  const handleGenerateSummary = async () => {
    if (loadingSummary) return;
    setLoadingSummary(true);
    try {
      const data = await summarizeBlogWithAI(blog);
      setTakeaways(data);
    } catch (e) {
      setTakeaways([
        'Error connecting to AI. Please try again.',
      ]);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSendChat = async (textToSend) => {
    const text = textToSend || query;
    if (!text.trim() || loadingChat) return;

    const userMsg = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setQuery('');
    setLoadingChat(true);

    try {
      const answer = await askAIChatbot(blog, text, chatHistory);
      setChatHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'ai',
          text: answer,
          timestamp: new Date(),
        },
      ]);
    } catch (e) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'ai',
          text: 'Sorry, I failed to process your question. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  const chatSuggestions = [
    'What is the core conclusion?',
    'Give a bulleted action checklist',
    'Explain the target audience',
  ];

  return (
    <div className="w-full flex flex-col h-[520px] rounded-2xl glass-panel border border-slate-200/50 dark:border-white/5 overflow-hidden shadow-lg">
      
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200/50 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'summary'
              ? 'border-primary text-primary bg-white/40 dark:bg-white/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ListCollapse className="w-4 h-4" />
          <span>AI Takeaways</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'chat'
              ? 'border-primary text-primary bg-white/40 dark:bg-white/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat with Post</span>
        </button>
      </div>

      {/* Info Banner if key is missing */}
      {!apiKey && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 shrink-0" />
          <span>Using Simulated AI. Set a Gemini Key in the Creator Studio settings to enable actual LLM models.</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-bg-dark/20 flex flex-col justify-between">
        
        {activeTab === 'summary' && (
          <div className="flex-grow flex flex-col items-center justify-center h-full">
            {takeaways.length > 0 ? (
              /* Takeaways List */
              <div className="w-full space-y-3.5 text-left animate-fade-in flex-1 overflow-y-auto pr-1">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-primary uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Generated Takeaways</span>
                </div>
                {takeaways.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm"
                  >
                    <div className="p-1 bg-emerald-500/15 text-emerald-500 rounded-md shrink-0 mt-0.5">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
                
                <button
                  onClick={handleGenerateSummary}
                  className="w-full mt-6 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Regenerate Summary
                </button>
              </div>
            ) : (
              /* Summary Generate CTA */
              <div className="text-center max-w-xs py-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  AI Key Takeaways
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                  Need a quick recap? Generate an AI summary listing the main points and action items of this article instantly.
                </p>
                <button
                  onClick={handleGenerateSummary}
                  disabled={loadingSummary}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:scale-100 cursor-pointer disabled:cursor-wait transition-all"
                >
                  {loadingSummary ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Analyzing text...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Summarize Article</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-grow flex flex-col justify-between h-full">
            
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 dark:bg-white/10 text-primary'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs shadow-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-white/10 text-primary flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5 px-3 py-2 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions Chips */}
            {chatHistory.length === 1 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {chatSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSendChat(s)}
                      className="text-[10px] px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/5 rounded-lg hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 cursor-pointer text-left transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this article..."
                className="flex-grow px-3 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-slate-800 dark:text-slate-200"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!query.trim() || loadingChat}
                className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl cursor-pointer disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
};

export default AiAssistant;
