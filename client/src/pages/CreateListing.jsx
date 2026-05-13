import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, List, Image as ImageIcon } from 'lucide-react';

const CreateListing = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
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
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1599490659223-e1595ebbb92d?q=80&w=1000&auto=format&fit=crop', // Default fallback
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
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div className="glass animate-fade-in" style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package className="text-accent-primary" />
          Post a Snack
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Snack Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="E.g. Hot Cheetos, Homemade Brownies"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Description</label>
            <textarea 
              className="input-field" 
              rows="3" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              placeholder="Tell them why it's delicious..."
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Price ($)</label>
              <input 
                type="number" 
                step="0.01" 
                className="input-field" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
                placeholder="2.50"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Quantity</label>
              <input 
                type="number" 
                className="input-field" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                required 
                placeholder="5"
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Photo URL (Optional)</label>
            <input 
              type="url" 
              className="input-field" 
              value={photoUrl} 
              onChange={(e) => setPhotoUrl(e.target.value)} 
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }} disabled={loading}>
            {loading ? 'Posting...' : 'List Snack'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
