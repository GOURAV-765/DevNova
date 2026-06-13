import React, { useState, useContext } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { BlogContext } from '../context/BlogContext';

const Newsletter = () => {
  const { subscribeEmail } = useContext(BlogContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === '') return;
    
    // Add to context list
    subscribeEmail(email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 my-28 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-secondary/5 blur-[80px] -z-10 rounded-full" />

      <div className="max-w-3xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {subscribed ? (
          /* Success State */
          <div className="flex flex-col items-center justify-center py-4 animate-fade-in">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
              Subscription Successful!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Thank you for subscribing! You will receive our weekly digest on technology, startups, and finance directly in your inbox.
            </p>
            <button
              onClick={() => setSubscribed(false)}
              className="mt-6 text-xs text-primary hover:underline cursor-pointer"
            >
              Subscribe with another email
            </button>
          </div>
        ) : (
          /* Subscription Form */
          <>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl mb-4">
              <Mail className="w-6 h-6" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Never Miss a Story
            </h2>
            
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 pb-8 max-w-md leading-relaxed">
              Subscribe to get the latest blog updates, technological analysis, startup advice, and exclusive digital news.
            </p>
            
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center w-full max-w-lg gap-3"
            >
              <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl w-full focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
                />
              </div>
              
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-semibold transition-all shadow-md shadow-primary/10 cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Newsletter;