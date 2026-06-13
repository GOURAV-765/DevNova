import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/QuickBlog-Assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import { Sun, Moon, Sparkles, Home, BookOpen, User, PenTool, LayoutDashboard, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AuthModal from './AuthModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, currentUser, logoutUser } = useContext(BlogContext);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 w-full ${
      scrolled 
        ? 'glass-nav py-3.5 shadow-md shadow-slate-100/50 dark:shadow-black/20' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 flex justify-between items-center">
        
        {/* Logo */}
        <motion.div 
          onClick={() => navigate('/')} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white overflow-hidden shadow-md shadow-primary/20">
            <PenTool className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dev<span className="text-primary font-medium">Nova</span>
          </span>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:border-primary/50 text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/5 transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
          </motion.button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative" onMouseLeave={() => setUserMenuOpen(false)}>
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:border-primary/30 text-slate-700 dark:text-slate-200 cursor-pointer transition-all shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <span className="text-xs font-bold hidden md:inline truncate max-w-[80px]">
                  {currentUser.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 p-2 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xl z-50 text-left"
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-white/5 mb-1.5">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">@{currentUser.username}</p>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                        currentUser.role === 'admin' 
                          ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                          : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
                      }`}>
                        {currentUser.role === 'admin' ? 'Administrator' : 'Reader Account'}
                      </span>
                    </div>

                    {currentUser.role === 'admin' && !isAdminRoute && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/admin');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-800 dark:text-slate-350 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Creator Studio</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logoutUser();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-500/10 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={() => setIsAuthModalOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm"
            >
              <User className="w-4 h-4 text-primary" />
              <span>Sign In</span>
            </motion.button>
          )}

          {/* Navigation Button */}
          {isAdminRoute ? (
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">View Blog</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => navigate('/admin')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 sm:px-5 py-2 sm:py-2.5 shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Creator Studio</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse shrink-0 hidden sm:inline" />
            </motion.button>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;