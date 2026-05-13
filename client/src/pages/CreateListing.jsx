import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, IndianRupee, Plus, Minus, Loader2 } from 'lucide-react';

const CATEGORIES = ["Midnight snacks", "Notes & study guides", "Handmade crafts", "Merch", "Homemade food", "Other"];

const CreateListing = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('Midnight snacks');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addDoc(collection(db, "listings"), {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        photoUrl: photoUrl || '',
        sellerId: currentUser.uid,
        sellerName: userData?.name || 'Unknown',
        createdAt: new Date().toISOString(),
        active: true
      });
      navigate('/');
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Failed to create listing.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '60px auto' }}>
      <div className="card animate-fade-in" style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '40px', fontSize: '2.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Package size={40} style={{ color: 'var(--accent-primary)' }} />
          POST A DROP
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Product Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="e.g. Handmade Keychain"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Category</label>
              <select 
                className="input-field" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ appearance: 'none', background: 'var(--surface-color)' }}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Price (₹)</label>
              <div style={{ position: 'relative' }}>
                <IndianRupee size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ paddingLeft: '45px' }}
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required 
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '15px', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Quantity Available</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, (parseInt(quantity) || 1) - 1))}
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    background: 'transparent', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--accent-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    lineHeight: '0'
                  }}
                >
                  <span style={{ marginTop: '-2px' }}>−</span>
                </button>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-primary)', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  type="button"
                  onClick={() => setQuantity((parseInt(quantity) || 1) + 1)}
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    background: 'var(--accent-primary)', 
                    border: 'none', 
                    color: '#000', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    lineHeight: '0'
                  }}
                >
                  <span style={{ marginTop: '-2px' }}>+</span>
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Photo URL (Optional)</label>
              <input 
                type="url" 
                className="input-field" 
                value={photoUrl} 
                onChange={(e) => setPhotoUrl(e.target.value)} 
                placeholder="https://..."
              />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Description</label>
            <textarea 
              className="input-field" 
              rows="4" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              placeholder="Tell us about this drop..."
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'LIST PRODUCT NOW'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
