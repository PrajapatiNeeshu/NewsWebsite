import React, { useState } from 'react';
import { X, Upload, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { Category } from '../types';
import { createPost } from '../services/firebaseService';
import { uploadImageToImgBB } from '../services/imgbbService';
import RichTextEditor from './RichTextEditor';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(Category.NEWS);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content || !imageFile) {
      setError("Please fill in all fields and upload an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Image
      const imageUrl = await uploadImageToImgBB(imageFile);

      // 2. Create Post excerpt (strip HTML and take first 150 chars)
      const tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = content;
      const textContent = tmpDiv.textContent || tmpDiv.innerText || "";
      const excerpt = textContent.slice(0, 150) + (textContent.length > 150 ? "..." : "");

      // 3. Push to Firebase
      await createPost({
        title,
        category,
        imageUrl,
        content,
        excerpt,
        timestamp: Date.now()
      });

      // 4. Cleanup
      setTitle('');
      setContent('');
      setImageFile(null);
      setCategory(Category.NEWS);
      onClose();
      alert("Post published successfully!");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while publishing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Create New Article</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Enter article title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {Object.values(Category)
                    .filter(c => c !== Category.HOME)
                    .map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors bg-gray-50">
                {imageFile ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <ImageIcon size={24} />
                    <span className="font-medium truncate max-w-xs">{imageFile.name}</span>
                    <button 
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      // Make sure the input covers the dashed area
                      style={{ height: 'auto', position: 'relative', marginTop: '-40px', paddingBottom: '40px' }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>
            
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            type="submit"
            form="post-form"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Publish Article
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
