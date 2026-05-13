import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, GraduationCap } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('1RUA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name, usn);
      navigate('/');
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 0' }}>
      <div className="card animate-fade-in" style={{ padding: '50px', width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(212, 255, 0, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid var(--accent-primary)'
          }}>
            <UserPlus size={40} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>JOIN THE NETWORK</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Campus commerce, redefined.</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(255, 68, 68, 0.1)', 
            border: '1px solid #ff4444', 
            color: '#ff4444', 
            padding: '15px', 
            borderRadius: '12px', 
            marginBottom: '25px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '45px' }}
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Student Name"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>USN (University Seat No.)</label>
            <div style={{ position: 'relative' }}>
              <GraduationCap size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '45px' }}
                value={usn} 
                onChange={(e) => setUsn(e.target.value.toUpperCase())} 
                required 
                placeholder="1RUA..."
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>College Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '45px' }}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="name@college.edu"
              />
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Secure Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '45px' }}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'INITIALIZING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
          Already a member? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '700' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
