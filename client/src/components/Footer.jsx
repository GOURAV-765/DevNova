import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import { PenTool, Mail } from 'lucide-react';

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const { blogCategories } = useContext(BlogContext);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-900/60 border-t border-slate-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info Column */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/10">
                <PenTool className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Dev<span className="text-primary font-medium">Nova</span>
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              DevNova is an advanced blog website equipped with generative AI capabilities. Write and brainstorm topics with Gemini, summarize articles, and chat with posts in real-time.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary/50 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-dark hover:scale-105 transition-all shadow-sm"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary/50 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-dark hover:scale-105 transition-all shadow-sm"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-primary/50 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-dark hover:scale-105 transition-all shadow-sm"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories Links Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Categories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {blogCategories().map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => {
                      navigate('/');
                      // Scroll to top/pills could go here
                    }}
                    className="hover:text-primary dark:hover:text-primary-dark cursor-pointer transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Links Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Studio
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => navigate('/admin')} 
                  className="hover:text-primary dark:hover:text-primary-dark cursor-pointer transition-colors"
                >
                  Dashboard Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/admin/write')} 
                  className="hover:text-primary dark:hover:text-primary-dark cursor-pointer transition-colors"
                >
                  Write AI Post
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/admin/comments')} 
                  className="hover:text-primary dark:hover:text-primary-dark cursor-pointer transition-colors"
                >
                  Moderate Comments
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/admin/settings')} 
                  className="hover:text-primary dark:hover:text-primary-dark cursor-pointer transition-colors"
                >
                  AI API Key Settings
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
            &copy; {currentYear} DevNova. All Rights Reserved. Created by Gourav.
          </p>
          <div className="flex gap-4 text-xs text-slate-400 dark:text-slate-500">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;