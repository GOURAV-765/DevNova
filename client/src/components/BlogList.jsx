import React, { useState, useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import { motion } from 'motion/react';
import BlogCard from './BlogCard';
import { BookOpen, AlertCircle } from 'lucide-react';

const BlogList = ({ searchQuery }) => {
  const { blogs, blogCategories } = useContext(BlogContext);
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter posts based on category and search query
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.subTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-6">
      
      {/* Categories Filter Pills */}
      <div className="flex justify-center flex-wrap gap-2.5 sm:gap-4 mb-12">
        {blogCategories().map((cat) => (
          <div key={cat} className="relative">
            <button
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full border cursor-pointer select-none transition-all duration-300 relative z-10 ${
                activeCategory === cat
                  ? 'text-white border-transparent'
                  : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:border-primary/45 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md shadow-primary/20"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Grid List */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8 mb-24">
          {filteredBlogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 glass-panel border border-slate-200 dark:border-white/5 rounded-2xl max-w-xl mx-auto mb-24">
          <div className="p-4 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-primary/80" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">No Articles Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            We couldn't find any articles matching your search query or selected category. Try searching for something else or browse another category.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogList;