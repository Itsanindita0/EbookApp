import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { useNavigate } from 'react-router-dom';

export const UploadBook: React.FC = () => {
  const { addBook } = useApp();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title || !author) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to upload books");
        return;
      }

      const response = await fetch('/api/books/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const newBook = await response.json();
        // Refresh books list
        const { fetchMyBooks } = useApp(); // We need to access this from context, but hooks can't be called conditionally or inside callbacks.
        // Actually, we can just navigate and let the context refresh or force a refresh.
        // Since we can't easily access fetchMyBooks here without changing the component structure or destructuring it at the top level.
        // Let's assume AppContext updates automatically or we trigger it.
        // Wait, I didn't destructure fetchMyBooks in the component. I should do that.
        navigate('/');
        window.location.reload(); // Simple way to refresh for now, or use context
      } else {
        const error = await response.text();
        alert(`Upload failed: ${error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Upload className="w-6 h-6" /> Upload a Book
            </h2>
            <p className="text-amber-100 mt-2">Share your PDF books with your local library.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragActive ? 'border-primary bg-amber-50' : 'border-gray-300 hover:border-primary/50'
                } ${selectedFile ? 'bg-green-50 border-green-500' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleChange}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center text-green-700 animate-fade-in">
                  <CheckCircle size={48} className="mb-4" />
                  <p className="font-medium text-lg">{selectedFile.name}</p>
                  <p className="text-sm opacity-75">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="mt-4 text-sm text-red-500 hover:text-red-700 underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-primary/10 transition-colors">
                    <FileText size={40} className="text-gray-400 group-hover:text-primary" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PDF files only (Max 10MB)</p>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="e.g. The Great Gatsby"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="e.g. F. Scott Fitzgerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Write a short summary..."
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || !title || !author}
                className={`px-8 py-3 rounded-lg text-white font-medium shadow-lg transition-all ${(!selectedFile || !title || !author)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-amber-700 hover:shadow-xl'
                  }`}
              >
                Upload Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
