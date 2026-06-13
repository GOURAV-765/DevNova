import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AiAssistant from '../components/AiAssistant';
import { ArrowLeft, Calendar, Clock, Share2, Link, Check, User2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, comments, addComment, currentUser } = useContext(BlogContext);
  
  const [blog, setBlog] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Comment Form States
  const [commentName, setCommentName] = useState(currentUser ? currentUser.name : '');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCommentName(currentUser.name);
    } else {
      setCommentName('');
    }
  }, [currentUser]);

  useEffect(() => {
    // Find the current blog
    const foundBlog = blogs.find((b) => b._id === id);
    if (foundBlog) {
      setBlog(foundBlog);
    }
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [id, blogs]);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-transparent text-slate-800 dark:text-slate-100">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Article Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            The article you are looking for does not exist or has been deleted.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark cursor-pointer shadow-md transition-all"
          >
            Go Back Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter approved comments for this blog
  const approvedComments = comments.filter(
    (c) => c.blog && c.blog._id === blog._id && c.isApproved === true
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(blog._id, commentName, commentText);
    setCommentName('');
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 5000);
  };

  // Strip HTML tags for read-time calculation
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  const wordsCount = stripHtml(blog.description).trim().split(/\s+/).length;
  const readTime = Math.ceil(wordsCount / 200);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
      


      <Navbar />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-grow max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-8 w-full"
      >
        
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold mb-8 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Articles</span>
          </button>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          
          {/* Left / Center: Article Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Content */}
            <motion.header variants={itemVariants} className="space-y-4">
              <span className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark rounded-full">
                {blog.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {blog.title}
              </h1>
              
              {blog.subTitle && (
                <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {blog.subTitle}
                </p>
              )}

              {/* Author & Stats Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-y border-slate-200 dark:border-white/5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-300/40 dark:border-white/5">
                    <User2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Gourav</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Author & Content Creator</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {readTime} min read
                  </span>
                </div>
              </div>
            </motion.header>

            {/* Featured Image */}
            <motion.div
              variants={itemVariants}
              className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-white/5 bg-slate-100 dark:bg-slate-900"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* HTML Description Body */}
            <motion.article 
              variants={itemVariants}
              className="blog-content prose dark:prose-invert max-w-none pt-4"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />

            {/* Sharing Row */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-4"
            >
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share this post
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 cursor-pointer relative transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 animate-scale-up" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Check out this article: ${blog.title} ${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Comments Area */}
            <motion.div
              variants={itemVariants}
              className="pt-10 border-t border-slate-200 dark:border-white/5 space-y-8"
            >
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>Discussion ({approvedComments.length})</span>
              </h3>

              {/* Comment submission form */}
              <form 
                onSubmit={handleCommentSubmit}
                className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-4 shadow-sm"
              >
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Write a comment
                </h4>

                {commentSubmitted && (
                  <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Your comment has been submitted and is awaiting creator approval!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Your Name {currentUser && <span className="text-emerald-500 text-[9px] lowercase font-normal">(locked to profile)</span>}
                    </label>
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      disabled={!!currentUser}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900/60 disabled:opacity-75 disabled:cursor-not-allowed transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Comment</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts or ask a question about this article..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900/60 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Comment</span>
                </button>
              </form>

              {/* Comments Render list */}
              <div className="space-y-4">
                {approvedComments.length > 0 ? (
                  approvedComments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-2 text-left"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                          {comment.name}
                        </h5>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                        {comment.content}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500">
                    <p className="text-xs sm:text-sm">No comments approved yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Sidebar: AI Article Companion */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider pl-1">
                <Sparkles className="w-4 h-4 fill-primary/10 animate-pulse" />
                <span>AI Reading Buddy</span>
              </div>
              
              <AiAssistant blog={blog} />
            </div>
          </motion.div>

        </div>

      </motion.main>

      <Footer />
    </div>
  );
};

export default Blog;