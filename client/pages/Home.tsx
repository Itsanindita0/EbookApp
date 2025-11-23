import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/BookCard';
import { Book } from '../types';
import { searchBooks } from '../services/bookService';
import { BACKGROUND_IMAGE } from '../constants';

export const Home: React.FC = () => {
  const { recentlyViewed, myBooks } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    const results = await searchBooks(searchTerm);
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transform scale-105"
          style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/80 z-10" />
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Discover Your Next <br /> <span className="text-primary">Great Adventure</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Explore thousands of books, read seamlessly online, and build your personal digital library.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-gray-800 bg-white/95 backdrop-blur-sm focus:bg-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all text-lg pl-14"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
            <button 
              type="submit"
              className="absolute right-2 top-2 bg-primary hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-30">
        
        {/* Search Results */}
        {hasSearched && (
          <div className="mb-16 animate-fade-in bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Search className="text-primary" /> Search Results
            </h2>
            
            {isSearching ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-primary w-12 h-12" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No books found matching "{searchTerm}".</p>
                <p className="mt-2">Try checking your spelling or use general keywords.</p>
              </div>
            )}
          </div>
        )}

        {/* Recently Viewed / Featured */}
        {!hasSearched && (
          <>
             {/* My Uploads Section if any */}
             {myBooks.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-2xl font-bold text-gray-800 font-serif">My Uploads</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {myBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-800 font-serif">Featured & Popular</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentlyViewed.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
