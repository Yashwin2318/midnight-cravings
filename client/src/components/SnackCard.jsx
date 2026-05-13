import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Tag } from 'lucide-react';

const SnackCard = ({ listing }) => {
  const { currentUser, userData } = useAuth();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [buying, setBuying] = useState(false);
  const navigate = useNavigate();

  const isSeller = currentUser?.uid === listing.sellerId;

  const handleBuy = async () => {
    if (quantity > listing.quantity) {
      alert("Not enough quantity available!");
      return;
    }

    try {
      setBuying(true);
      const orderData = {
        listingId: listing.id,
        listingName: listing.name,
        buyerId: currentUser.uid,
        buyerName: userData?.name || 'Unknown',
        buyerRoom: userData?.roomNumber || 'Unknown',
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        quantity: quantity,
        price: listing.price * quantity,
        note: note,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);
      
      // Update listing quantity
      await updateDoc(doc(db, "listings", listing.id), {
        quantity: increment(-quantity)
      });

      navigate(`/order/${orderRef.id}`);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
    setBuying(false);
  };

  return (
    <div className="glass glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '180px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
        {listing.photoUrl ? (
          <img 
            src={listing.photoUrl} 
            alt={listing.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={40} style={{ opacity: 0.3 }} />
          </div>
        )}
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: 'var(--accent-primary)', 
          padding: '4px 10px', 
          borderRadius: '20px', 
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          ${listing.price}
        </div>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '5px' }}>{listing.name}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>
          {listing.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '15px' }}>
          <UserIcon size={14} />
          <span>Seller: {listing.sellerName}</span>
          <span style={{ margin: '0 5px' }}>•</span>
          <span>Qty: {listing.quantity}</span>
        </div>

        {isSeller ? (
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textAlign: 'center', padding: '10px', border: '1px dashed var(--accent-primary)', borderRadius: '8px' }}>
            Your Listing
          </div>
        ) : (
          <button 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={() => setShowBuyModal(true)}
          >
            <ShoppingCart size={18} />
            Buy Now
          </button>
        )}
      </div>

      {showBuyModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 2000 
        }}>
          <div className="glass" style={{ padding: '30px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '20px' }}>Order {listing.name}</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Quantity (Max {listing.quantity})</label>
              <input 
                type="number" 
                className="input-field" 
                min="1" 
                max={listing.quantity} 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))} 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Add a Note (Optional)</label>
              <textarea 
                className="input-field" 
                rows="3" 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="E.g. Extra spicy, or when to meet..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowBuyModal(false)} 
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white' }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 2 }} 
                onClick={handleBuy}
                disabled={buying}
              >
                {buying ? 'Processing...' : `Confirm - $${(listing.price * quantity).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnackCard;
