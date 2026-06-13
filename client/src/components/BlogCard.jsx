import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id, createdAt } = blog;
  const navigate = useNavigate();

  // Strip HTML tags safely to show plain text preview
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const plainTextDescription = stripHtml(description);
  const snippet = plainTextDescription.length > 90 
    ? plainTextDescription.substring(0, 90) + '...' 
    : plainTextDescription;

  // Calculate read time (avg 200 words per minute)
  const getReadTime = (text) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  const readTime = getReadTime(plainTextDescription);

  // Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.article
      onClick={() => navigate(`/blog/${_id}`)}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group w-full rounded-2xl overflow-hidden glass-card hover:border-primary/30 dark:hover:border-primary/45 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full cursor-pointer relative"
    >
      {/* Cover Image */}
      <div className="aspect-video w-full overflow-hidden relative bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Category & Stats */}
        <div className="flex justify-between items-center mb-3">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark rounded-full">
            {category}
          </span>
          <div className="flex items-center gap-2.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(createdAt)}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} min read
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Snippet Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5 line-clamp-3">
          {snippet}
        </p>

        {/* CTA Arrow */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-primary">
          <span>Read Article</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;