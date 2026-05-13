import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import OrderDetails from './pages/OrderDetails';
import { Bell } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const GlobalMarquee = () => {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const unsubAnnouncement = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists() && doc.data().isAnnouncementActive) {
        setAnnouncement(doc.data().announcementText);
      } else {
        setAnnouncement(null);
      }
    });
    return () => unsubAnnouncement();
  }, []);

  if (!announcement) return null;

  return (
    <div style={{ 
      background: 'var(--accent-primary)', 
      color: '#000', 
      padding: '12px 0', 
      position: 'relative', 
      zIndex: 9999,
      fontWeight: '900',
      fontSize: '0.9rem',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(212, 255, 0, 0.3)'
    }}>
      <div className="marquee-content" style={{ display: 'flex', width: 'max-content' }}>
        <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingRight: '50px' }}>
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
        </div>
        <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingRight: '50px' }}>
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
          <Bell size={18} fill="#000" /> {announcement}
        </div>
      </div>
      <style>{`
        .marquee-content {
          animation: marquee-scroll 15s linear infinite;
        }
        .marquee-track {
          flex-shrink: 0;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalMarquee />
        <Navbar />
        <main className="container" style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-listing" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/order/:orderId" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
