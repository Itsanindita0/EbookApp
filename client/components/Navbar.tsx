import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Upload, User as UserIcon, LogOut, Menu, X, Home, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { auth, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-primary font-semibold" : "text-gray-600 hover:text-primary";

  const NavLinks = () => (
    <>
      <Link to="/" className={`flex items-center gap-2 ${isActive('/')}`}>
        <Home size={18} /> Home
      </Link>
      <Link to="/about" className={`flex items-center gap-2 ${isActive('/about')}`}>
        <Info size={18} /> About
      </Link>
      <Link to="/upload" className={`flex items-center gap-2 ${isActive('/upload')}`}>
        <Upload size={18} /> Upload Book
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="font-serif text-xl font-bold text-gray-800">EBookVerse</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
            
            <div className="border-l border-gray-300 h-6 mx-2"></div>

            {auth.isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">{auth.user?.name}</span>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-500/30">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            <Link to="/" className={`flex items-center gap-2 p-2 rounded-md ${location.pathname === '/' ? 'bg-amber-50 text-primary' : 'text-gray-600'}`} onClick={() => setIsMenuOpen(false)}>
              <Home size={18} /> Home
            </Link>
            <Link to="/about" className={`flex items-center gap-2 p-2 rounded-md ${location.pathname === '/about' ? 'bg-amber-50 text-primary' : 'text-gray-600'}`} onClick={() => setIsMenuOpen(false)}>
              <Info size={18} /> About
            </Link>
            <Link to="/upload" className={`flex items-center gap-2 p-2 rounded-md ${location.pathname === '/upload' ? 'bg-amber-50 text-primary' : 'text-gray-600'}`} onClick={() => setIsMenuOpen(false)}>
              <Upload size={18} /> Upload Book
            </Link>
            
            <div className="border-t border-gray-100 pt-4">
              {auth.isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-700 font-medium px-2">
                    <UserIcon size={18} /> {auth.user?.name}
                  </div>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-2 px-2 text-red-600 font-medium">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="text-center w-full py-2 text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-center w-full py-2 bg-primary text-white rounded-lg font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};