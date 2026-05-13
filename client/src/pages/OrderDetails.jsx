import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, MapPin, ArrowLeft, Send } from 'lucide-react';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Security check
        if (data.buyerId !== currentUser.uid && data.sellerId !== currentUser.uid) {
          navigate('/');
          return;
        }
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();

    // Listen for messages
    const q = query(
      collection(db, "orders", orderId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [orderId, currentUser.uid, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "orders", orderId, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading pickup details...</div>;
  if (!order) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Order not found.</div>;

  const isSeller = currentUser.uid === order.sellerId;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ background: 'transparent', color: 'var(--text-secondary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        
        {/* Order Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '25px' }}>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '15px' }}>Order Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <p><strong>Snack:</strong> {order.listingName}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Total:</strong> ${order.price.toFixed(2)}</p>
              <p><strong>Status:</strong> <span style={{ color: 'var(--accent-secondary)' }}>{order.status.toUpperCase()}</span></p>
            </div>
          </div>

          <div className="glass" style={{ padding: '25px' }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} className="text-accent-secondary" />
              Pickup Info
            </h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <p><strong>Buyer Room:</strong> {order.buyerRoom}</p>
              <p><strong>Seller:</strong> {order.sellerName}</p>
              {order.note && (
                <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontStyle: 'italic' }}>
                  " {order.note} "
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: '500px', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} />
            <h3>Chat with {isSeller ? 'Buyer' : 'Seller'}</h3>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px', fontSize: '0.9rem' }}>
                Start a conversation to agree on the pickup time.
              </p>
            )}
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  alignSelf: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 15px',
                  borderRadius: '12px',
                  background: msg.senderId === currentUser.uid ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                  fontSize: '0.9rem'
                }}
              >
                <p>{msg.text}</p>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, display: 'block', marginTop: '4px' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Type a message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px' }}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
