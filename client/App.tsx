import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { UploadBook } from './pages/UploadBook';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Reader } from './pages/Reader';

// Layout wrapper to conditionally hide Navbar/Footer for specific pages (like Reader)
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isReaderPage = location.pathname === '/read';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
      {!isReaderPage && !isAuthPage && <Navbar />}
      <main className={`flex-grow ${!isReaderPage && !isAuthPage ? '' : ''}`}>
        {children}
      </main>
      {!isReaderPage && !isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload" element={<UploadBook />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/read" element={<Reader />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
