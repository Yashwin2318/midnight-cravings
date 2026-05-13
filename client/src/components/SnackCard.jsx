import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Tag, IndianRupee, Loader2, Plus, Minus } from 'lucide-react';
import logo from '../assets/logo.png'; // Make sure to save the image as logo.png in assets

const SnackCard = ({ listing }) => {
  const { currentUser, userData } = useAuth();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const isSeller = currentUser?.uid === listing.sellerId;

  const handleBuy = async () => {
    if (quantity > listing.quantity) {
      alert("Not enough quantity available!");
      return;
    }

    try {
      setIsProcessing(true);
      const orderData = {
        listingId: listing.id,
        listingName: listing.name,
        buyerId: currentUser.uid,
        buyerName: userData?.name || 'Unknown',
        buyerUSN: userData?.usn || 'Unknown',
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        quantity: quantity,
        price: listing.price * quantity,
        note: note,
        status: 'pending',
        category: listing.category || 'Others',
        createdAt: new Date().toISOString()
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);
      
      await updateDoc(doc(db, "listings", listing.id), {
        quantity: increment(-quantity)
      });

      navigate(`/order/${orderRef.id}`);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
      setIsProcessing(false);
    }
  };

  const adjustQuantity = (amount) => {
    setQuantity(prev => {
      const newVal = prev + amount;
      if (newVal < 1) return 1;
      if (newVal > listing.quantity) return listing.quantity;
      return newVal;
    });
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image Area */}
      <div style={{ height: '240px', background: '#050505', position: 'relative' }}>
        <img 
          src={listing.photoUrl?.trim() ? listing.photoUrl : logo} 
          alt={listing.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: listing.photoUrl?.trim() ? 'cover' : 'contain', 
            opacity: listing.photoUrl?.trim() ? 0.8 : 1,
            padding: listing.photoUrl?.trim() ? 0 : '40px',
            mixBlendMode: listing.photoUrl?.trim() ? 'normal' : 'screen'
          }} 
        />
        <div style={{ 
          position: 'absolute', 
          top: '15px', 
          left: '15px',
        }}>
          <span className="badge badge-yellow">{listing.category || 'SNACK'}</span>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase' }}>{listing.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-primary)' }}>
            <IndianRupee size={20} strokeWidth={3} />
            <span style={{ fontSize: '1.6rem', fontWeight: '900' }}>{listing.price}</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.6', flex: 1 }}>
          {listing.description}
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '15px 0',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white' }}>
              {listing.sellerName?.charAt(0)}
            </div>
            <span>{listing.sellerName}</span>
          </div>
          <div style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
            {listing.quantity} IN STOCK
          </div>
        </div>

        {isSeller ? (
          <button disabled style={{ width: '100%', background: '#111', color: '#444', marginTop: '15px' }}>MY LISTING</button>
        ) : (
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() => setShowBuyModal(true)}
          >
            <ShoppingCart size={18} />
            SECURE NOW
          </button>
        )}
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.95)', 
          backdropFilter: 'blur(15px)',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 3000,
          padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '450px', border: '1px solid var(--accent-primary)', padding: '40px' }}>
            <h2 style={{ marginBottom: '10px', fontSize: '2.5rem', fontWeight: '900' }}>PURCHASE</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>{listing.name}</p>
            
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <label style={{ display: 'block', marginBottom: '20px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.1em' }}>SELECT QUANTITY</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                <button 
                  onClick={() => adjustQuantity(-1)}
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: 'transparent', 
                    border: '2px solid var(--accent-primary)', 
                    color: 'var(--accent-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)',
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    lineHeight: '0'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(212, 255, 0, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ marginTop: '-4px' }}>−</span>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '4.5rem', fontWeight: '900', color: 'white', lineHeight: '1' }}>{quantity}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700' }}>UNITS</span>
                </div>
                <button 
                  onClick={() => adjustQuantity(1)}
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: 'var(--accent-primary)', 
                    border: '2px solid var(--accent-primary)', 
                    color: '#000', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)',
                    boxShadow: '0 0 20px rgba(212, 255, 0, 0.2)',
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    lineHeight: '0'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ marginTop: '-4px' }}>+</span>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '35px' }}>
              <textarea 
                className="input-field" 
                rows="3" 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="Add a delivery note (e.g. meet in lobby)"
                style={{ background: 'var(--surface-color)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', height: '60px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} 
                onClick={handleBuy}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    PROCESSING...
                  </>
                ) : (
                  `CONFIRM ₹${(listing.price * quantity)}`
                )}
              </button>
              <button 
                onClick={() => setShowBuyModal(false)} 
                style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '700' }}
                disabled={isProcessing}
              >
                CANCEL ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnackCard;
