import React, { useEffect } from 'react';
import { Post } from '../types';
import { X, Clock, User, Tag } from 'lucide-react';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (post) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [post]);

  if (!post) return null;

  const dateStr = new Date(post.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header / Image Area */}
        <div className="relative h-64 sm:h-80 md:h-96 shrink-0">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase bg-blue-600 rounded-full">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-serif font-bold leading-tight shadow-black drop-shadow-md">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-200">
               <div className="flex items-center">
                 <Clock size={16} className="mr-1" />
                 {dateStr}
               </div>
               <div className="flex items-center">
                 <User size={16} className="mr-1" />
                 NewsFlow Team
               </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-blue-600 hover:prose-a:text-blue-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center text-gray-500 text-sm">
             <Tag size={16} className="mr-2" />
             <span>Posted in <span className="font-semibold text-gray-700">{post.category}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
