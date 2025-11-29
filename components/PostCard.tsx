import React from 'react';
import { Post } from '../types';
import { ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <article 
      className="group bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onClick(post)}
    >
      <div className="relative overflow-hidden h-48 sm:h-56">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold uppercase bg-blue-600 text-white rounded-full shadow-md">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4 mt-auto">
          <span>{new Date(post.timestamp).toLocaleDateString()}</span>
          <span className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
            Read More <ArrowRight size={14} className="ml-1" />
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
