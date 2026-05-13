import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'rgba(0,0,0,0.8)', 
      borderTop: '1px solid var(--border-color)', 
      padding: '80px 0 40px',
      marginTop: '100px'
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
              The official midnight marketplace for campus students. Fast, secure, and student-run.
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
          <p>© 2024 MIDNIGHT CRAVINGS. ALL RIGHTS RESERVED.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
          </div>
        </div>
      </div>

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
