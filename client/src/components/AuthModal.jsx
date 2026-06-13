import React, { useState, useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import { X, Lock, Mail, User, Key, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser, registerUser } = useContext(BlogContext);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Input fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccessMsg('');
    setName('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (activeTab === 'login') {
      try {
        loginUser(username, password);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        if (!name.trim()) throw new Error('Please enter your name.');
        registerUser(name, username, password);
        setSuccessMsg('Account registered and logged in!');
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blurred Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md p-6 sm:p-8 glass-panel border border-slate-200/50 dark:border-white/5 rounded-3xl shadow-2xl relative z-10 text-left overflow-hidden"
      >
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 blur-2xl -z-10 rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Join DevNova'}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {activeTab === 'login' ? 'Sign in to access your dashboard' : 'Create an account to explore premium tools'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-white/5 mb-5">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Sign up only) */}
          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gourav"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or john"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer mt-6"
          >
            {activeTab === 'login' ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        {/* Credentials Info Panel */}
        <div className="mt-5 p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-xl text-[10px] text-slate-400 dark:text-slate-500 space-y-1 leading-relaxed">
          <p className="font-bold text-slate-600 dark:text-slate-350">Quick Testing Credentials:</p>
          <div className="flex justify-between">
            <span>🔑 <strong>Creator/Admin:</strong> admin / admin</span>
            <span className="text-primary-dark font-medium">Access to Studio</span>
          </div>
          <div className="flex justify-between">
            <span>🔑 <strong>Reader/User:</strong> john / password</span>
            <span className="text-secondary font-medium">Blocked from Studio</span>
          </div>
          <p className="pt-1 italic">Note: Creating a new account defaults to a "Reader" account.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
