import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthState, Book, User } from '../types';
import { FEATURED_BOOKS } from '../constants';

interface AppContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  myBooks: Book[];
  addBook: (book: Book) => void;
  recentlyViewed: Book[];
  addToHistory: (book: Book) => void;
  fetchMyBooks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  // Check for token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('ebook_user');
    if (token && storedUser) {
      setAuth({ user: JSON.parse(storedUser), isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      const user = { ...data.user, id: data.user._id };

      localStorage.setItem('token', data.token);
      localStorage.setItem('ebook_user', JSON.stringify(user));
      setAuth({ user, isAuthenticated: true });

      // Fetch books after login
      fetchMyBooks();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed'); // Backend returns validation errors sometimes
      }

      const data = await response.json();
      const user = { ...data.user, id: data.user._id };

      localStorage.setItem('token', data.token);
      localStorage.setItem('ebook_user', JSON.stringify(user));
      setAuth({ user, isAuthenticated: true });

      fetchMyBooks();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('token');
    localStorage.removeItem('ebook_user');
    setMyBooks([]);
  };

  // Books State (Uploaded by user)
  const [myBooks, setMyBooks] = useState<Book[]>([]);

  const fetchMyBooks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/books', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const books = data.map((b: any) => ({
          id: b._id,
          title: b.title,
          authors: [b.author],
          description: b.description,
          thumbnail: b.coverImage || 'https://via.placeholder.com/128x192.png?text=No+Cover',
          pdfUrl: b.fileUrl, // This will be a relative path like "server/uploads/..."
          isUploaded: true
        }));
        setMyBooks(books);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetch books on auth change
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchMyBooks();
    }
  }, [auth.isAuthenticated]);

  // History State
  const [recentlyViewed, setRecentlyViewed] = useState<Book[]>(FEATURED_BOOKS);

  const addBook = (book: Book) => {
    setMyBooks(prev => [book, ...prev]);
  };

  const addToHistory = (book: Book) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      return [book, ...filtered].slice(0, 10);
    });
  };

  return (
    <AppContext.Provider value={{ auth, login, register, logout, myBooks, addBook, recentlyViewed, addToHistory, fetchMyBooks }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
