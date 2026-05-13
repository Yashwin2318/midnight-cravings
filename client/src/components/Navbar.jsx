import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusSquare, User } from 'lucide-react';
import logo from '../assets/logo.png'; // Make sure to save the image as logo.png in assets

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <nav style={{ 
      background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={logo} alt="MNC Logo" style={{ height: '50px', width: 'auto', mixBlendMode: 'screen' }} />
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '15px', height: '30px', display: 'flex', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.05em', color: 'var(--accent-primary)' }}>MNC.</h2>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {currentUser ? (
            <>
              <Link to="/create-listing" className="btn-primary" style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                height: '45px', 
                padding: '0 25px',
                borderRadius: '30px' 
              }}>
                <PlusSquare size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: '900' }}>SELL</span>
              </Link>
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} style={{ color: 'var(--accent-primary)' }} />
                {userData?.name?.toUpperCase() || 'DASHBOARD'}
              </Link>
              <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '5px' }}>
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '0.85rem' }}>LOGIN</Link>
              <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', height: '45px', display: 'flex', alignItems: 'center', padding: '0 25px' }}>JOIN NETWORK</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
