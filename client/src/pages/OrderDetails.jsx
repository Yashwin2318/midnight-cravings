import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, MapPin, ArrowLeft, Send, CheckCircle2, User as UserIcon } from 'lucide-react';

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
        if (data.buyerId !== currentUser.uid && data.sellerId !== currentUser.uid) {
          navigate('/');
          return;
        }
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();

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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: '800' }}>FETCHING SECURE LINE...</div>;
  if (!order) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Order not found.</div>;

  const isSeller = currentUser.uid === order.sellerId;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '40px auto' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ background: 'transparent', color: 'var(--text-secondary)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '700' }}
      >
        <ArrowLeft size={18} /> BACK TO DASHBOARD
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', height: '700px' }}>
        
        {/* Order Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
              <CheckCircle2 size={24} />
              <h3 style={{ fontWeight: '900', fontSize: '1.2rem' }}>ORDER SECURED</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Product</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{order.listingName}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Quantity</p>
                  <p style={{ fontWeight: '700' }}>x{order.quantity}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Amount</p>
                  <p style={{ fontWeight: '900', color: 'var(--accent-primary)' }}>₹{order.price}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '30px', flex: 1 }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '900' }}>
              <MapPin size={20} style={{ color: 'var(--accent-primary)' }} />
              LOGISTICS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Buyer USN</p>
                <p style={{ fontWeight: '700' }}>{order.buyerUSN || 'Unknown'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Counterparty</p>
                <p style={{ fontWeight: '700' }}>{isSeller ? order.buyerName : order.sellerName}</p>
              </div>
              {order.note && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Delivery Note</p>
                  <div style={{ padding: '15px', background: '#000', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    "{order.note}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Terminal */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}></div>
            <h3 style={{ fontWeight: '900', fontSize: '1.1rem' }}>ENCRYPTED CHAT</h3>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '100px' }}>
                <MessageSquare size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <p style={{ fontSize: '0.9rem' }}>Initialize coordination with the {isSeller ? 'buyer' : 'seller'}.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  alignSelf: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start'
                }}
              >
                <div 
                  style={{ 
                    padding: '12px 20px',
                    borderRadius: '16px',
                    borderTopRightRadius: msg.senderId === currentUser.uid ? '4px' : '16px',
                    borderTopLeftRadius: msg.senderId === currentUser.uid ? '16px' : '4px',
                    background: msg.senderId === currentUser.uid ? 'var(--accent-primary)' : 'var(--surface-hover)',
                    color: msg.senderId === currentUser.uid ? '#000' : '#fff',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: '800' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '30px', background: '#050505', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Transmit message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ background: '#000' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
