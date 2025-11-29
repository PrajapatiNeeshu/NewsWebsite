import React, { useState, useEffect } from 'react';
import { Post, Category } from './types';
import { NAV_ITEMS, FIREBASE_CONFIG } from './constants';
import { subscribeToProps } from './services/firebaseService';
import { Menu, X, Facebook, Twitter, Instagram, Linkedin, Search } from 'lucide-react';
import PostCard from './components/PostCard';
import PostModal from './components/PostModal';
import AdminModal from './components/AdminModal';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | string>(Category.HOME);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [firebaseError, setFirebaseError] = useState(false);

  // Fetch posts from Firebase
  useEffect(() => {
    // Check if user has configured the app
    if (FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
      setFirebaseError(true);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToProps((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for Admin Shortcut (Ctrl + M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredPosts = selectedCategory === Category.HOME
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setSelectedCategory(Category.HOME)}>
              <span className="text-3xl font-serif font-black tracking-tighter text-slate-900">
                NEWS<span className="text-blue-600">FLOW</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedCategory(item)}
                  className={`px-1 pt-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    selectedCategory === item
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Icons / Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600 hidden sm:block">
                <Search size={20} />
              </button>
              <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="text-gray-600 p-2">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSelectedCategory(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                     selectedCategory === item
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Config Error Banner */}
        {firebaseError && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
             <div className="flex">
               <div className="ml-3">
                 <p className="text-sm text-amber-700">
                   <strong className="font-bold">Configuration Required:</strong> Please open 
                   <code className="bg-amber-100 px-1 py-0.5 rounded mx-1 text-xs">constants.ts</code> 
                   and add your Firebase project configuration to load posts.
                 </p>
               </div>
             </div>
          </div>
        )}

        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            {selectedCategory === Category.HOME ? 'Latest Stories' : selectedCategory}
          </h2>
          <div className="h-1 bg-gray-200 flex-grow ml-6 rounded-full">
            <div className="h-1 bg-blue-600 w-1/4 rounded-full"></div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             <span className="ml-3 text-gray-500 font-medium">Loading contents...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-2">No stories found in this category.</p>
            <p className="text-gray-400 text-sm">Press <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-300 mx-1">Ctrl + M</kbd> to add the first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={setSelectedPost} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-serif font-black tracking-tighter text-white">
                NEWS<span className="text-blue-500">FLOW</span>
              </span>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Delivering the latest and most relevant news from around the globe directly to your screen. Trust in our unbiased reporting.
              </p>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-bold text-lg mb-4 text-slate-200">Categories</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => setSelectedCategory(Category.NEWS)} className="hover:text-white transition-colors">News</button></li>
                <li><button onClick={() => setSelectedCategory(Category.GADGETS)} className="hover:text-white transition-colors">Technology</button></li>
                <li><button onClick={() => setSelectedCategory(Category.FASHION)} className="hover:text-white transition-colors">Fashion</button></li>
                <li><button onClick={() => setSelectedCategory(Category.LIFESTYLE)} className="hover:text-white transition-colors">Lifestyle</button></li>
              </ul>
            </div>

            <div className="col-span-1">
               <h4 className="font-bold text-lg mb-4 text-slate-200">Company</h4>
               <ul className="space-y-2 text-slate-400 text-sm">
                 <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
               </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-lg mb-4 text-slate-200">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors"><Facebook size={18} /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sky-500 transition-colors"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition-colors"><Instagram size={18} /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-800 transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} NewsFlow Portal. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed for modern readers.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdminModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
      
      <PostModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
      
    </div>
  );
};

export default App;
