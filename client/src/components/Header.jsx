import React from 'react';
import { Search, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

const Header = ({ searchQuery, setSearchQuery, onOpenAiChat }) => {
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 pb-10 overflow-hidden">
      
      {/* Dynamic Background Glow Blobs */}
      <motion.div 
        animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/15 bg-glow-blob -z-10" 
      />
      <motion.div 
        animate={{ y: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
        className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-secondary/10 dark:bg-secondary/15 bg-glow-blob -z-10" 
      />

      <div className="text-center max-w-3xl mx-auto">
        
        {/* AI feature badge */}
        <motion.button
          onClick={onOpenAiChat}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-full text-xs sm:text-sm text-primary font-semibold transition-all duration-300 cursor-pointer shadow-sm shadow-primary/5"
        >
          <Sparkles className="w-3.5 h-3.5 fill-primary/30 animate-pulse" />
          <span>New: Interactive AI Chat Search</span>
        </motion.button>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-slate-900 dark:text-white"
        >
          Write without limits. <br className="hidden sm:inline" />
          Read with{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI Intelligence.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Welcome to the next generation of sharing ideas. Publish articles with help from our AI writer, or use the AI reading assistant to summarize articles and answer questions.
        </motion.p>

        {/* Search & AI Companion Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
        >
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 flex items-center gap-2 px-3.5 py-1.5 glass-panel rounded-2xl border border-slate-200 dark:border-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-sm"
          >
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, tags..."
              className="w-full bg-transparent border-none outline-none py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </form>
          
          <motion.button
            onClick={onOpenAiChat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl text-sm font-semibold transition-all shadow-md shadow-slate-900/10 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI Search</span>
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default Header;