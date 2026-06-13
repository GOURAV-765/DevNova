import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { 
  LayoutDashboard, PenTool, BookOpen, MessageSquare, Settings, 
  Sparkles, Trash2, CheckCircle, XCircle, ToggleLeft, ToggleRight, 
  Eye, Edit2, ArrowLeft, ArrowUpRight, BarChart3, Users, MessageCircle, 
  HelpCircle, Check, Key, Globe, EyeOff, Save, Lock, LogOut,
  Lightbulb, Gauge, Send, ShieldAlert, List, TrendingUp, ThumbsUp, FileText
} from 'lucide-react';
import { assets } from '../assets/QuickBlog-Assets/assets';
import { motion, AnimatePresence } from 'motion/react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { 
    blogs, comments, apiKey, setApiKey, addBlog, updateBlog, deleteBlog, 
    approveComment, deleteComment, generateBlogWithAI, aiUsageCount, theme,
    currentUser, logoutUser, subscribers, sendNewsletterToAll,
    generateBrainstormIdeasWithAI, generateNewsletterWithAI
  } = useContext(BlogContext);

  // Auth states
  const [isDashboardAuthOpen, setIsDashboardAuthOpen] = useState(false);

  // Interactive Chart states
  const [overviewChartType, setOverviewChartType] = useState('views');

  // Brainstorm Board states
  const [brainstormTopic, setBrainstormTopic] = useState('');
  const [brainstormIdeas, setBrainstormIdeas] = useState([]);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [brainstormError, setBrainstormError] = useState('');

  // Newsletter states
  const [newsletterTopic, setNewsletterTopic] = useState('');
  const [selectedNewsletterArticles, setSelectedNewsletterArticles] = useState([]);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [isGeneratingNewsletter, setIsGeneratingNewsletter] = useState(false);
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState('');
  const [newsletterError, setNewsletterError] = useState('');

  // SEO Analyzer states
  const [targetKeyword, setTargetKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [seoFeedback, setSeoFeedback] = useState([]);

  // Sync tab state with URL path
  const getTabFromPath = () => {
    if (pathname.includes('/write')) return 'write';
    if (pathname.includes('/posts')) return 'posts';
    if (pathname.includes('/comments')) return 'comments';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/brainstorm')) return 'brainstorm';
    if (pathname.includes('/newsletter')) return 'newsletter';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  // --- Write Blog Form States ---
  const [editBlogId, setEditBlogId] = useState(null); // Set to blog ID when editing
  const [formTitle, setFormTitle] = useState('');
  const [formSubTitle, setFormSubTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Technology');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop');
  const [formPreviewTab, setFormPreviewTab] = useState('edit'); // 'edit' or 'preview'
  
  // AI Writer Generator States
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  // Preset covers
  const imagePresets = [
    { name: 'Abstract Gradient', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' },
    { name: 'Workspace Minimal', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop' },
    { name: 'Tech Neon Glow', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
    { name: 'Finance / Success', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop' },
    { name: 'Lifestyle / Plants', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop' },
  ];

  // Trigger editing a blog post
  const handleEditBlog = (blog) => {
    setEditBlogId(blog._id);
    setFormTitle(blog.title);
    setFormSubTitle(blog.subTitle || '');
    setFormCategory(blog.category);
    setFormDescription(blog.description);
    setFormImage(blog.image);
    handleTabChange('write');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    const blogData = {
      title: formTitle,
      subTitle: formSubTitle,
      category: formCategory,
      description: formDescription,
      image: formImage,
    };

    if (editBlogId) {
      updateBlog(editBlogId, blogData);
      setEditBlogId(null);
    } else {
      addBlog(blogData);
    }

    // Reset Form fields
    setFormTitle('');
    setFormSubTitle('');
    setFormDescription('');
    setFormCategory('Technology');
    setFormImage(imagePresets[0].url);
    
    // Redirect to manage posts
    handleTabChange('posts');
  };

  // AI Content Generator Execution
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAI(true);
    setAiError('');

    try {
      const result = await generateBlogWithAI(aiPrompt, formCategory);
      if (result.title) setFormTitle(result.title);
      if (result.subTitle) setFormSubTitle(result.subTitle);
      if (result.description) setFormDescription(result.description);
      setAiPrompt('');
    } catch (e) {
      setAiError('Failed to generate content. Please verify your Gemini API key or network.');
    } finally {
      setGeneratingAI(false);
    }
  };

  // --- Real-time SEO Auditor Loop ---
  useEffect(() => {
    let score = 0;
    const feedback = [];

    // Title Check
    if (formTitle.trim().length >= 25 && formTitle.trim().length <= 70) {
      score += 15;
      feedback.push({ check: 'Ideal Title Length (25-70 chars)', pass: true, detail: `${formTitle.trim().length} chars` });
    } else if (formTitle.trim().length > 0) {
      feedback.push({ check: 'Title Length (aim for 25-70 chars)', pass: false, detail: `${formTitle.trim().length} chars` });
    } else {
      feedback.push({ check: 'Add a title', pass: false, detail: 'Empty' });
    }

    // Subtitle Check
    if (formSubTitle.trim().length > 10) {
      score += 10;
      feedback.push({ check: 'Teaser / Subtitle added', pass: true, detail: `${formSubTitle.trim().length} chars` });
    } else {
      feedback.push({ check: 'Teaser / Subtitle too short', pass: false, detail: 'Aim for >10 chars' });
    }

    // Image check
    if (formImage.trim().startsWith('http')) {
      score += 15;
      feedback.push({ check: 'Cover Image Selected', pass: true, detail: 'Valid URL' });
    } else {
      feedback.push({ check: 'Add cover image URL', pass: false, detail: 'Invalid URL' });
    }

    // Word Count Check
    const stripHtml = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    };
    const plainText = stripHtml(formDescription).trim();
    const words = plainText ? plainText.split(/\s+/).length : 0;
    if (words >= 300) {
      score += 25;
      feedback.push({ check: 'Detailed Content (>= 300 words)', pass: true, detail: `${words} words` });
    } else if (words > 0) {
      feedback.push({ check: 'Content is too short (aim for 300+ words)', pass: false, detail: `${words} words` });
    } else {
      feedback.push({ check: 'Write some content', pass: false, detail: '0 words' });
    }

    // Headings Check
    const h2Count = (formDescription.match(/<h2/g) || []).length;
    const h3Count = (formDescription.match(/<h3/g) || []).length;
    if (h2Count + h3Count >= 2) {
      score += 15;
      feedback.push({ check: 'Good Structure (headings present)', pass: true, detail: `${h2Count} H2, ${h3Count} H3` });
    } else {
      feedback.push({ check: 'Add headings (H2/H3) to structure text', pass: false, detail: `${h2Count + h3Count} total` });
    }

    // Keyword Density Check
    if (targetKeyword.trim()) {
      const kw = targetKeyword.trim().toLowerCase();
      const textLower = plainText.toLowerCase();
      const occurrences = textLower.split(kw).length - 1;
      const density = words > 0 ? (occurrences / words) * 100 : 0;
      
      if (density >= 0.5 && density <= 3.0) {
        score += 20;
        feedback.push({ check: `Optimal Keyword Density (0.5% - 3.0%)`, pass: true, detail: `${density.toFixed(1)}% (${occurrences} matches)` });
      } else if (occurrences === 0) {
        feedback.push({ check: `Target keyword not found in content`, pass: false, detail: '0 matches' });
      } else {
        feedback.push({ check: `Keyword density outside bounds (aim for 0.5%-3%)`, pass: false, detail: `${density.toFixed(1)}% (${occurrences} matches)` });
      }
    } else {
      feedback.push({ check: 'Enter a target keyword to audit density', pass: false, detail: 'No keyword set' });
    }

    setSeoScore(score);
    setSeoFeedback(feedback);
  }, [formTitle, formSubTitle, formDescription, formImage, targetKeyword]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Calculate stats
  const totalBlogs = blogs.length;
  const totalComments = comments.length;
  const pendingComments = comments.filter(c => !c.isApproved).length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden">


        <Navbar />

        <main className="flex-grow flex items-center justify-center px-6 py-12 w-full z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md p-8 glass-panel border border-slate-200/50 dark:border-white/5 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/30 text-center"
          >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-md shadow-primary/5">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Authentication Required</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-semibold uppercase tracking-wider">Creator Studio Access</p>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-4 leading-relaxed">
              To design, edit, and publish blogs using DevNova's Creator Studio, you must be logged in as an administrator.
            </p>
            
            <button
              onClick={() => setIsDashboardAuthOpen(true)}
              className="w-full py-3.5 mt-8 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              Sign In to Creator Studio
            </button>
          </motion.div>
        </main>

        <Footer />
        <AuthModal isOpen={isDashboardAuthOpen} onClose={() => setIsDashboardAuthOpen(false)} />
      </div>
    );
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden">


        <Navbar />

        <main className="flex-grow flex items-center justify-center px-6 py-12 w-full z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md p-8 glass-panel border border-slate-200/50 dark:border-white/5 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/30 text-center"
          >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 shadow-md shadow-red-500/5">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Access Denied</h2>
            <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-bold uppercase tracking-wider">Restricted Area</p>
            
            <div className="p-3.5 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl text-xs text-left text-slate-500 dark:text-slate-400 space-y-1.5 mt-6">
              <p>👤 <strong>Current Account:</strong> {currentUser.name}</p>
              <p>🏷️ <strong>Username:</strong> @{currentUser.username}</p>
              <p>🛡️ <strong>Assigned Role:</strong> <span className="text-secondary font-bold">Reader</span></p>
              <p className="pt-2 text-[11px] leading-relaxed italic text-slate-405">
                Only user accounts with the "admin" role are permitted to access the creator panel.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Return Home
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Dashboard Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 space-y-6 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 px-1">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">Creator Studio</h2>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Dashboard panel</p>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleTabChange('overview')}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  <span>Overview</span>
                </button>
                
                <button
                  onClick={() => handleTabChange('write')}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer ${
                    activeTab === 'write'
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <PenTool className="w-4.5 h-4.5" />
                  <span>{editBlogId ? 'Edit Post' : 'Write AI Post'}</span>
                </button>

                <button
                  onClick={() => handleTabChange('brainstorm')}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer ${
                    activeTab === 'brainstorm'
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Lightbulb className="w-4.5 h-4.5" />
                  <span>Idea Generator</span>
                </button>

                <button
                  onClick={() => handleTabChange('posts')}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer ${
                    activeTab === 'posts'
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <BookOpen className="w-4.5 h-4.5" />
                  <span>Manage Posts</span>
                </button>

                <button
                  onClick={() => handleTabChange('comments')}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer relative ${
                    activeTab === 'comments'
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>Moderate Comments</span>
                  {pendingComments > 0 && (
                    <span className={`absolute right-3.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === 'comments' ? 'bg-white text-primary' : 'bg-primary text-white'
                    }`}>
                      {pendingComments}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabChange('newsletter')}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer relative ${
                    activeTab === 'newsletter'
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Send className="w-4.5 h-4.5" />
                  <span>Newsletter & Subs</span>
                  {subscribers.length > 0 && (
                    <span className={`absolute right-3.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === 'newsletter' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
                    }`}>
                      {subscribers.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabChange('settings')}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-4.5 h-4.5" />
                  <span>AI & Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl text-left transition-all cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-600"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Logout</span>
                </button>
              </nav>

              {/* Sidebar footer statistics */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span>AI queries run</span>
                  <span className="text-slate-700 dark:text-slate-350">{aiUsageCount}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span>Connection</span>
                  <span className={apiKey ? 'text-emerald-500 flex items-center gap-1' : 'text-amber-500 flex items-center gap-1'}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                    {apiKey ? 'Gemini Live' : 'Simulated'}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Dashboard Views */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
            
            {/* VIEW 1: Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Studio Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-5 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary/15 text-primary rounded-xl">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Articles</p>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{totalBlogs}</h3>
                    </div>
                  </div>

                  <div className="p-5 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/15 text-indigo-500 rounded-xl">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Comments</p>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{totalComments}</h3>
                    </div>
                  </div>

                  <div className="p-5 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-500/15 text-amber-500 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Moderation Queue</p>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{pendingComments}</h3>
                    </div>
                  </div>
                </div>

                {/* Mock Analytics Charts Block */}
                {/* Interactive Analytics Charts Block */}
                <div className="p-6 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-sm space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        {overviewChartType === 'views' && 'Weekly Page Views'}
                        {overviewChartType === 'reads' && 'Average Reading Duration'}
                        {overviewChartType === 'subscribers' && 'Subscribers Acquisition'}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {overviewChartType === 'views' && 'Total views: 12,480 (14.2% increase)'}
                        {overviewChartType === 'reads' && 'Avg reading time: 4.8 mins (5.4% increase)'}
                        {overviewChartType === 'subscribers' && `Total active subscriber list: ${subscribers.length} reader(s)`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 rounded-xl">
                        {['views', 'reads', 'subscribers'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setOverviewChartType(type)}
                            className={`text-[10px] sm:text-xs px-3 py-1.5 rounded-lg capitalize font-bold cursor-pointer transition-all ${
                              overviewChartType === type
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SVG line graph */}
                  <div className="h-64 w-full bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/30 dark:border-white/5 rounded-xl p-4 flex items-end relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full p-6 text-primary" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.5" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.5" />
                      
                      {/* Area Fill */}
                      {overviewChartType === 'views' && (
                        <>
                          <path d="M0,80 Q15,40 30,55 T60,25 T90,35 T100,20 L100,100 L0,100 Z" fill="url(#chartGradient)" />
                          <path d="M0,80 Q15,40 30,55 T60,25 T90,35 T100,20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </>
                      )}
                      {overviewChartType === 'reads' && (
                        <>
                          <path d="M0,50 Q20,75 40,35 T80,25 T100,45 L100,100 L0,100 Z" fill="url(#chartGradient)" className="text-secondary" />
                          <path d="M0,50 Q20,75 40,35 T80,25 T100,45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-secondary" />
                        </>
                      )}
                      {overviewChartType === 'subscribers' && (
                        <>
                          <path d="M0,90 Q20,75 45,60 T75,30 T100,10 L100,100 L0,100 Z" fill="url(#chartGradient)" className="text-emerald-500" />
                          <path d="M0,90 Q20,75 45,60 T75,30 T100,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-500" />
                        </>
                      )}
                    </svg>
                    
                    {/* SVG Bar Chart Overlay */}
                    <div className="w-full flex justify-between items-end h-full z-10 px-4 relative">
                      {overviewChartType === 'views' && [40, 65, 50, 75, 90, 60, 85].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-[8%]">
                          <div className="w-full rounded-md bg-primary/20 hover:bg-primary/40 transition-all cursor-pointer" style={{ height: `${h}%` }}></div>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">Day {i+1}</span>
                        </div>
                      ))}
                      {overviewChartType === 'reads' && [55, 48, 68, 62, 70, 74, 58].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-[8%]">
                          <div className="w-full rounded-md bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer" style={{ height: `${h}%` }}></div>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">Day {i+1}</span>
                        </div>
                      ))}
                      {overviewChartType === 'subscribers' && [15, 25, 40, 52, 65, 78, 92].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-[8%]">
                          <div className="w-full rounded-md bg-emerald-500/20 hover:bg-emerald-500/40 transition-all cursor-pointer" style={{ height: `${h}%` }}></div>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">Day {i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}


            {/* VIEW 2: Write/Edit Blog Tab */}
            {activeTab === 'write' && (
              <motion.div
                key="write"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {editBlogId ? 'Edit Article' : 'Write Post with AI Assistant'}
                  </h2>
                  {editBlogId && (
                    <button
                      onClick={() => {
                        setEditBlogId(null);
                        setFormTitle('');
                        setFormSubTitle('');
                        setFormDescription('');
                        setFormCategory('Technology');
                        setFormImage(imagePresets[0].url);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-300 dark:border-white/10 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                {/* AI Generator Prompter */}
                {!editBlogId && (
                  <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Sparkles className="w-24 h-24 text-primary" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm uppercase tracking-wider">
                      <Sparkles className="w-4.5 h-4.5 fill-primary/10 animate-pulse" />
                      <span>Gemini Magic Content Writer</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                      Type in a prompt detailing what your article should cover (e.g. <em>"Write an outline of habits for personal growth"</em>). Select your target category below, and the AI will draft your title, subtitle, and HTML rich-content instantly!
                    </p>

                    {aiError && (
                      <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>{aiError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. Write a 5-step checklist for building a SaaS startup"
                        className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                      <button
                        onClick={handleAIGenerate}
                        disabled={!aiPrompt.trim() || generatingAI}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-wait shrink-0 cursor-pointer shadow-md shadow-primary/10"
                      >
                        {generatingAI ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Generating content...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Generate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Input fields */}
                {/* Form Input fields & SEO Analyzer */}
                <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Panel: Form fields */}
                  <div className="lg:col-span-2 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      
                      {/* Category Select */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900/60 transition-all"
                        >
                          <option value="Technology">Technology</option>
                          <option value="Startup">Startup</option>
                          <option value="Lifestyle">Lifestyle</option>
                          <option value="Finance">Finance</option>
                        </select>
                      </div>

                      {/* Cover image URL */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cover Image URL</label>
                        <input
                          type="url"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="Paste image link..."
                          required
                          className="w-full px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-250 focus:bg-white dark:focus:bg-slate-900/60 transition-all"
                        />
                      </div>
                    </div>

                    {/* Preset Covers Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Select Cover Preset</label>
                      <div className="flex flex-wrap gap-2">
                        {imagePresets.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setFormImage(preset.url)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              formImage === preset.url
                                ? 'border-primary bg-primary/5 text-primary font-semibold'
                                : 'border-slate-200 dark:border-white/5 text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Article Title</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Title of your post..."
                        required
                        className="w-full px-4 py-3 text-sm font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900/60 transition-all"
                      />
                    </div>

                    {/* Subtitle field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subtitle / Abstract</label>
                      <input
                        type="text"
                        value={formSubTitle}
                        onChange={(e) => setFormSubTitle(e.target.value)}
                        placeholder="Short teaser description..."
                        className="w-full px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-250 focus:bg-white dark:focus:bg-slate-900/60 transition-all"
                      />
                    </div>

                    {/* Preview / Edit tab toggle */}
                    <div className="flex border-b border-slate-200 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() => setFormPreviewTab('edit')}
                        className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                          formPreviewTab === 'edit'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                        }`}
                      >
                        HTML Canvas Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormPreviewTab('preview')}
                        className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                          formPreviewTab === 'preview'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                        }`}
                      >
                        Live Post Preview
                      </button>
                    </div>

                    {/* Editor body vs preview block */}
                    {formPreviewTab === 'edit' ? (
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Content (HTML body)</label>
                        <p className="text-[10px] text-slate-450 dark:text-slate-550 pb-1">
                          Use HTML tags like <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>, <code>&lt;strong&gt;</code> to style sections.
                        </p>
                        <textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="<h2>Introduction</h2><p>Start writing your blog post body here...</p>"
                          rows={12}
                          required
                          className="w-full px-4 py-3 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900/60 font-mono transition-all resize-y"
                        />
                      </div>
                    ) : (
                      /* Live Preview Container */
                      <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-xl min-h-[300px] text-left">
                        {formTitle ? (
                          <div className="space-y-6">
                            <header className="space-y-2 border-b border-slate-200 dark:border-white/5 pb-4">
                              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                                {formCategory}
                              </span>
                              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{formTitle}</h2>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{formSubTitle}</p>
                            </header>
                            {formImage && (
                              <img src={formImage} alt="Cover Preview" className="w-full aspect-video object-cover rounded-xl" />
                            )}
                            <div 
                              className="blog-content prose dark:prose-invert"
                              dangerouslySetInnerHTML={{ __html: formDescription || '<p className="text-slate-450">No content written yet...</p>' }}
                            />
                          </div>
                        ) : (
                          <p className="text-slate-400 dark:text-slate-500 text-center py-20 text-xs">Write a title and content to see live previews here.</p>
                        )}
                      </div>
                    )}

                    {/* Form Submission Button */}
                    <button
                      type="submit"
                      disabled={!formTitle.trim() || !formDescription.trim()}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-95 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editBlogId ? 'Update & Save Changes' : 'Publish Article Now'}</span>
                    </button>
                  </div>

                  {/* Right Panel: SEO Audit */}
                  <div className="lg:col-span-1 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm text-left">
                    <div className="space-y-6 sticky top-24">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/5">
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                          <Gauge className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">SEO Quality Auditor</h3>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Content optimizer</p>
                        </div>
                      </div>

                      {/* Circular Score display */}
                      <div className="flex flex-col items-center justify-center py-2">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-200 dark:text-slate-800"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={`transition-all duration-500 ${
                                seoScore < 50 ? 'text-red-500' : seoScore < 80 ? 'text-amber-500' : 'text-emerald-500'
                              }`}
                              strokeWidth="3.5"
                              strokeDasharray={`${seoScore}, 100`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-2xl font-black text-slate-800 dark:text-white">{seoScore}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block -mt-1">/100</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold mt-3 px-3 py-1 rounded-full ${
                          seoScore < 50 
                            ? 'bg-red-500/10 text-red-500' 
                            : seoScore < 80 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {seoScore < 50 ? 'Needs Improvement' : seoScore < 80 ? 'Good Optimization' : 'Excellent Quality'}
                        </span>
                      </div>

                      {/* Target Keyword input */}
                      <div className="space-y-1.5 pt-4 border-t border-slate-200 dark:border-white/5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Target Keyword</label>
                        <input
                          type="text"
                          value={targetKeyword}
                          onChange={(e) => setTargetKeyword(e.target.value)}
                          placeholder="e.g. tailwind"
                          className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-805 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 transition-all"
                        />
                      </div>

                      {/* Feedback Checklist */}
                      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/5">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-405 dark:text-slate-500">Checklist Summary</h4>
                        <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                          {seoFeedback.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[10px] sm:text-[11px] leading-relaxed">
                              <span className="shrink-0 mt-0.5">
                                {item.pass ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500 font-extrabold bg-emerald-500/10 rounded p-0.5" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-white/5 rounded p-0.5" />
                                )}
                              </span>
                              <div className="flex-1">
                                <p className={`font-semibold ${item.pass ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                  {item.check}
                                </p>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                                  Value: {item.detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              </motion.div>
            )}

            {/* VIEW 3: Manage Blogs list Tab */}
            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Manage Articles</h2>
                  <button
                    onClick={() => handleTabChange('write')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-sm"
                  >
                    <PenTool className="w-3.5 h-3.5" /> Add New Post
                  </button>
                </div>

                <div className="glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                  {blogs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <th className="px-5 py-4">Article</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                          {blogs.map((b) => (
                            <tr key={b._id} className="hover:bg-slate-100/30 dark:hover:bg-white/1 text-xs">
                              {/* Title Info */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3 max-w-sm">
                                  <img src={b.image} alt="" className="w-10 h-7 object-cover rounded shrink-0 bg-slate-200 dark:bg-slate-800" />
                                  <div className="truncate">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate hover:underline cursor-pointer" onClick={() => navigate(`/blog/${b._id}`)}>
                                      {b.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{b.subTitle}</p>
                                  </div>
                                </div>
                              </td>
                              
                              {/* Category Badge */}
                              <td className="px-5 py-4">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
                                  {b.category}
                                </span>
                              </td>
                              
                              {/* Date */}
                              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>

                              {/* Action controls */}
                              <td className="px-5 py-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => navigate(`/blog/${b._id}`)}
                                    className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-all"
                                    title="View Post"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditBlog(b)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-all"
                                    title="Edit Post"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteBlog(b._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-all"
                                    title="Delete Post"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-20 px-4 text-slate-400 dark:text-slate-500">
                      <p className="text-xs sm:text-sm">No articles available. Add some articles above!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW 4: Comments Moderation Queue */}
            {activeTab === 'comments' && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Moderate Comments</h2>

                <div className="glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                  {comments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <th className="px-5 py-4">Commenter</th>
                            <th className="px-5 py-4">Content</th>
                            <th className="px-5 py-4">Article Target</th>
                            <th className="px-5 py-4 text-center">Status / Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                          {comments.map((c) => (
                            <tr key={c._id} className="hover:bg-slate-100/30 dark:hover:bg-white/1 text-xs">
                              {/* Comment Name */}
                              <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">
                                {c.name}
                              </td>

                              {/* Comment Content */}
                              <td className="px-5 py-4 text-slate-500 dark:text-slate-450 max-w-xs truncate" title={c.content}>
                                {c.content}
                              </td>

                              {/* Article Title */}
                              <td className="px-5 py-4 text-slate-400 dark:text-slate-500 max-w-[150px] truncate">
                                {c.blog?.title || 'Unknown Post'}
                              </td>

                              {/* Approval control */}
                              <td className="px-5 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {c.isApproved ? (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-semibold flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Approved
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => approveComment(c._id)}
                                      className="flex items-center gap-1 px-2.5 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteComment(c._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-all"
                                    title="Delete Comment"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-20 px-4 text-slate-400 dark:text-slate-500">
                      <p className="text-xs sm:text-sm">No comments have been posted yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW: Idea Generator Tab */}
            {activeTab === 'brainstorm' && (
              <motion.div
                key="brainstorm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">AI Idea Generator</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Brainstorm topic ideas and article outlines using Google Gemini</p>
                  </div>
                </div>

                {/* Brainstorm Prompt Card */}
                <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl space-y-4 shadow-sm relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Lightbulb className="w-24 h-24 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm uppercase tracking-wider">
                    <Sparkles className="w-4.5 h-4.5 fill-primary/10 animate-pulse" />
                    <span>Gemini Brainstorming Assistant</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                    Enter a general topic area (e.g. <em>"web development trends"</em> or <em>"financial hacks"</em>) and choose a category. Gemini will create 5 article angles complete with target audiences, keywords, and outline sections!
                  </p>

                  {brainstormError && (
                    <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>{brainstormError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={brainstormTopic}
                      onChange={(e) => setBrainstormTopic(e.target.value)}
                      placeholder="e.g. Artificial Intelligence in design workflows"
                      className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                    />
                    
                    <button
                      onClick={async () => {
                        if (!brainstormTopic.trim()) return;
                        setIsBrainstorming(true);
                        setBrainstormError('');
                        try {
                          const ideas = await generateBrainstormIdeasWithAI(brainstormTopic, formCategory);
                          setBrainstormIdeas(ideas);
                        } catch (err) {
                          setBrainstormError('Failed to brainstorm ideas. Please try again or check API key.');
                        } finally {
                          setIsBrainstorming(false);
                        }
                      }}
                      disabled={!brainstormTopic.trim() || isBrainstorming}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-wait shrink-0 cursor-pointer shadow-md shadow-primary/10"
                    >
                      {isBrainstorming ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Brainstorming...</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Brainstorm</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Ideas Display Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {brainstormIdeas.length > 0 ? (
                    brainstormIdeas.map((idea, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 text-left"
                      >
                        <div className="space-y-3 flex-1">
                          <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                            Idea #{idx + 1}
                          </span>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                            {idea.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {idea.teaser}
                          </p>

                          <div className="flex flex-wrap gap-4 pt-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                            <span className="flex items-center gap-1">
                              👥 Target: <strong className="text-slate-600 dark:text-slate-350">{idea.audience}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              🏷️ Keywords: <strong className="text-slate-600 dark:text-slate-350">{idea.keywords}</strong>
                            </span>
                          </div>

                          {/* Outline list */}
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">Article Outline Draft</span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-3 list-decimal text-[11px] text-slate-500 dark:text-slate-450">
                              {idea.outline && idea.outline.map((sec, sIdx) => (
                                <li key={sIdx} className="truncate" title={sec}>
                                  {sec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex md:flex-col justify-end items-end gap-3 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => {
                              setFormTitle(idea.title);
                              setFormSubTitle(idea.teaser);
                              setFormDescription(
                                `<h2>Introduction</h2><p>Here, introduce the topic: "${idea.title}" and explain why it matters to your audience (${idea.audience}).</p>` +
                                (idea.outline && idea.outline.slice(1, -1).map(sec => `<h2>${sec}</h2><p>Provide details and examples regarding this section.</p>`).join('') || '') +
                                `<h2>Conclusion</h2><p>Summarize the key takeaways and write a closing call-to-action.</p>`
                              );
                              handleTabChange('write');
                            }}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Draft Article</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 dark:text-slate-500">
                      <Lightbulb className="w-8 h-8 mx-auto mb-3 opacity-40" />
                      <p className="text-xs sm:text-sm font-semibold">No brainstormed ideas. Type a topic area and hit brainstorm above!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW: Newsletter & Subscribers Tab */}
            {activeTab === 'newsletter' && (
              <motion.div
                key="newsletter"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Newsletter & Subscriber Base</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Manage email newsletter subscriptions and compose AI promotion digests</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column (Col 1): Subscribers List */}
                  <div className="lg:col-span-1 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 text-left">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5 pb-2.5 border-b border-slate-200 dark:border-white/5">
                      <Users className="w-4 h-4 text-primary" /> Active Subscribers ({subscribers.length})
                    </h3>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {subscribers.length > 0 ? (
                        subscribers.map((email, idx) => (
                          <div key={idx} className="p-3 bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-white/5 rounded-xl flex items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{email}</span>
                            <span className="text-[9px] text-slate-405 font-semibold uppercase">Active</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-10 text-xs text-slate-400">No subscribers yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Col 2): AI Newsletter Composer */}
                  <div className="lg:col-span-2 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Send className="w-24 h-24 text-primary" />
                    </div>

                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5 pb-2.5 border-b border-slate-200 dark:border-white/5">
                      <Sparkles className="w-4 h-4 text-primary" /> AI Newsletter Composer
                    </h3>

                    {newsletterSuccess && (
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{newsletterSuccess}</span>
                      </div>
                    )}

                    {newsletterError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>{newsletterError}</span>
                      </div>
                    )}

                    {/* Step 1: Selection */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">1. Select Theme / Focus</label>
                        <input
                          type="text"
                          value={newsletterTopic}
                          onChange={(e) => setNewsletterTopic(e.target.value)}
                          placeholder="e.g. NextJS & Web scaling or Frontend design improvements"
                          className="w-full px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-805 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">2. Select Articles to Feature (Max 3)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1.5 border border-slate-200/40 dark:border-white/5 bg-slate-100/30 dark:bg-slate-900/20 rounded-xl">
                          {blogs.map(b => {
                            const isSelected = selectedNewsletterArticles.includes(b._id);
                            return (
                              <button
                                key={b._id}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedNewsletterArticles(selectedNewsletterArticles.filter(id => id !== b._id));
                                  } else {
                                    if (selectedNewsletterArticles.length >= 3) return;
                                    setSelectedNewsletterArticles([...selectedNewsletterArticles, b._id]);
                                  }
                                }}
                                className={`p-2 rounded-lg text-left text-xs border transition-all cursor-pointer truncate ${
                                  isSelected 
                                    ? 'border-primary bg-primary/5 text-primary font-semibold' 
                                    : 'border-slate-200/40 dark:border-white/5 text-slate-550 hover:border-slate-400 dark:hover:text-slate-300'
                                }`}
                              >
                                {b.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newsletterTopic.trim() || selectedNewsletterArticles.length === 0) return;
                          setIsGeneratingNewsletter(true);
                          setNewsletterError('');
                          setNewsletterSuccess('');
                          
                          const articlesToUse = blogs
                            .filter(b => selectedNewsletterArticles.includes(b._id))
                            .map(b => b.title);
                            
                          try {
                            const result = await generateNewsletterWithAI(newsletterTopic, articlesToUse);
                            setNewsletterSubject(result.subject);
                            setNewsletterBody(result.body);
                          } catch (err) {
                            setNewsletterError('Failed to generate newsletter digest. Check API configuration.');
                          } finally {
                            setIsGeneratingNewsletter(false);
                          }
                        }}
                        disabled={!newsletterTopic.trim() || selectedNewsletterArticles.length === 0 || isGeneratingNewsletter}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-60"
                      >
                        {isGeneratingNewsletter ? (
                          <>
                            <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                            <span>Composing newsletter...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-primary dark:text-primary-dark" />
                            <span>Compose AI Newsletter</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Email preview and dispatch section */}
                    {newsletterSubject && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5"
                      >
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 font-semibold">Email Campaign Draft</h4>
                        
                        <div className="space-y-2 bg-slate-100/80 dark:bg-slate-900/40 p-4 border border-slate-200/50 dark:border-white/5 rounded-2xl text-xs space-y-3 font-medium">
                          <div>
                            <span className="text-slate-400">Subject: </span>
                            <span className="text-slate-800 dark:text-slate-150 font-bold">{newsletterSubject}</span>
                          </div>
                          
                          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl overflow-x-auto text-[11px] leading-relaxed select-text shadow-inner">
                            <div dangerouslySetInnerHTML={{ __html: newsletterBody }} />
                          </div>
                        </div>

                        {/* Dispatch Button */}
                        <button
                          type="button"
                          onClick={async () => {
                            setIsSendingNewsletter(true);
                            setNewsletterSuccess('');
                            setNewsletterError('');
                            try {
                              await sendNewsletterToAll(newsletterSubject, newsletterBody);
                              setNewsletterSuccess(`Newsletter successfully sent to all ${subscribers.length} subscribers!`);
                              setNewsletterSubject('');
                              setNewsletterBody('');
                              setNewsletterTopic('');
                              setSelectedNewsletterArticles([]);
                            } catch (err) {
                              setNewsletterError('Failed to send newsletter. Try again.');
                            } finally {
                              setIsSendingNewsletter(false);
                            }
                          }}
                          disabled={isSendingNewsletter}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20"
                        >
                          {isSendingNewsletter ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Dispatching campaign...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Dispatch Newsletter to List</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 5: AI Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">AI Config & Settings</h2>

                <div className="glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm text-left">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Google Gemini API Key</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      DevNova integrates Google Gemini models (e.g. Gemini 2.5 Flash) directly in the browser to draft blog articles, summarize post takeaways, and hold conversational Q&A chats about posts. Storing keys locally is secure, as all API fetches are executed directly on your machine.
                    </p>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-4 h-4" /> Get a Free API Key
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Don't have a key? Go to <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-0.5">Google AI Studio <ArrowUpRight className="w-3 h-3" /></a> to retrieve a free API Key. It takes less than 30 seconds!
                    </p>
                  </div>

                  {/* API Key Form Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gemini API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Paste your Gemini API key (AIzaSy...)"
                      className="w-full px-4 py-3 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900/60 font-mono transition-all"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {apiKey ? '✓ Key stored securely in local browser storage' : '✗ No key set. Running in simulated fallback mode.'}
                    </p>
                  </div>

                  {/* Models select */}
                  <div className="space-y-1.5 max-w-sm">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Default Model Choice</label>
                    <select
                      defaultValue="gemini-2.5-flash"
                      disabled={!apiKey}
                      className="w-full px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-200 disabled:opacity-50 transition-all"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highly Analytical)</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-xs">
                      <span className="font-bold text-slate-400 dark:text-slate-500">Local Cache: </span>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reset all posts and comments to defaults? This will erase custom articles.')) {
                            localStorage.removeItem('qb_blogs');
                            localStorage.removeItem('qb_comments');
                            window.location.reload();
                          }
                        }}
                        className="text-red-500 hover:underline cursor-pointer font-semibold"
                      >
                        Reset Storage Defaults
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleTabChange('overview')}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                    >
                      Return to Overview
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
