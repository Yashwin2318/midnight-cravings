import React, { useState } from 'react';
import { Mail, Phone, X } from 'lucide-react';

const Footer = () => {
  const [showGif, setShowGif] = useState(false);

  return (
    <footer style={{ 
      background: 'rgba(0,0,0,0.8)', 
      borderTop: '1px solid var(--border-color)', 
      padding: '80px 0 40px',
      marginTop: '100px',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '60px',
          marginBottom: '60px'
        }}>
          {/* Brand Info */}
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-primary)', marginBottom: '20px' }}>MNC.</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              The official marketplace for campus students. Fast, secure, and student-run.
            </p>
          </div>

          {/* Contact Details */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '25px' }}>Contact Support</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <a href="mailto:salaar@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'var(--transition-smooth)' }} className="footer-link">
                <Mail size={18} style={{ color: 'var(--accent-primary)' }} />
                salaar@gmail.com
              </a>
              <a href="tel:+918055805523" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'var(--transition-smooth)' }} className="footer-link">
                <Phone size={18} style={{ color: 'var(--accent-primary)' }} />
                +91 8055805523
              </a>
            </div>
          </div>

          {/* Location / Status */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '25px' }}>Market Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#44ff44', boxShadow: '0 0 10px #44ff44' }}></div>
              <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700' }}>Live on Campus</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          <p>© 2026 MNC. ALL RIGHTS RESERVED.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>PRIVACY POLICY</span>
            <span 
              onClick={() => setShowGif(true)} 
              style={{ cursor: 'pointer', transition: 'var(--transition-smooth)' }}
              className="footer-link"
            >
              TERMS OF SERVICE
            </span>
          </div>
        </div>
      </div>

      {/* GIF Easter Egg Overlay */}
      {showGif && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.95)', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px'
        }}>
          <button 
            onClick={() => setShowGif(false)}
            style={{ 
              position: 'absolute', 
              top: '40px', 
              right: '40px', 
              background: 'var(--accent-primary)', 
              color: '#000', 
              border: 'none', 
              borderRadius: '50%', 
              width: '50px', 
              height: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(212, 255, 0, 0.5)'
            }}
          >
            <X size={24} />
          </button>
          
          <img 
            src="https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyZGtzMDhkcmZlY3Z4bDM4enZqcmJuampvdTEwYTU2Z3Vnc2JuNnh1aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jH4HDoGb9rK8eecx4D/200w.gif" 
            alt="Easter Egg" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '70vh', 
              borderRadius: '24px', 
              border: '2px solid var(--accent-primary)',
              boxShadow: '0 0 50px rgba(212, 255, 0, 0.2)'
            }}
          />
          <h2 style={{ color: 'var(--accent-primary)', marginTop: '30px', fontSize: '2rem', fontWeight: '900' }}>RULE #1: DON'T ASK QUESTIONS.</h2>
        </div>
      )}

      <style>{`
        .footer-link:hover {
          color: white !important;
          transform: translateX(5px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
