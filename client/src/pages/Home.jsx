import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import BlogList from '../components/BlogList';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import AiGlobalChat from '../components/AiGlobalChat';
import { Sparkles, Search } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      


      <Navbar />
      
      <main className="flex-grow">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onOpenAiChat={() => setAiChatOpen(true)} 
        />
        
        <BlogList searchQuery={searchQuery} />
        
        <Newsletter />
      </main>

      <Footer />

      {/* Floating AI Helper Button */}
      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-primary hover:bg-primary-dark text-white rounded-full cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/45 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="Open AI Search Assistant"
      >
        <Sparkles className="w-5.5 h-5.5 group-hover:rotate-12 transition-transform duration-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2.5 font-semibold text-sm transition-all duration-500 whitespace-nowrap">
          Ask Pixel AI
        </span>
      </button>

      {/* Global AI Chat Overlay */}
      <AiGlobalChat 
        isOpen={aiChatOpen} 
        onClose={() => setAiChatOpen(false)} 
      />
    </div>
  );
};

export default Home;