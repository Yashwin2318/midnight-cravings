import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Clock, 
  IndianRupee, 
  PackageCheck, 
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Settings,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [stats, setStats] = useState({ monthlyIncome: 0, totalSold: 0 });
  const [loading, setLoading] = useState(true);

  // Admin Settings State
  const isAdmin = currentUser?.email === 'yashwinsrihari@gmail.com';
  const [announcement, setAnnouncement] = useState('');
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch My Listings
        const listingsQ = query(collection(db, "listings"), where("sellerId", "==", currentUser.uid));
        const listingsSnap = await getDocs(listingsQ);
        setMyListings(listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Incoming Orders (as seller)
        const incomingQ = query(collection(db, "orders"), where("sellerId", "==", currentUser.uid));
        const incomingSnap = await getDocs(incomingQ);
        const incomingData = incomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setIncomingOrders(incomingData);

        // Calculate Stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        let income = 0;
        let sold = 0;
        incomingData.forEach(order => {
          if (order.createdAt >= startOfMonth) {
            income += order.price;
            sold += order.quantity;
          }
        });
        setStats({ monthlyIncome: income, totalSold: sold });

        // Fetch My Orders (as buyer)
        const myOrdersQ = query(collection(db, "orders"), where("buyerId", "==", currentUser.uid));
        const myOrdersSnap = await getDocs(myOrdersQ);
        setMyOrders(myOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Admin Settings if user is admin
        if (isAdmin) {
          const settingsDoc = await getDoc(doc(db, "settings", "global"));
          if (settingsDoc.exists()) {
            setAnnouncement(settingsDoc.data().announcementText || '');
            setIsAnnouncementActive(settingsDoc.data().isAnnouncementActive || false);
          }
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser.uid, isAdmin]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setIncomingOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleAdminUpdate = async () => {
    try {
      setSavingAdmin(true);
      await setDoc(doc(db, "settings", "global"), {
        announcementText: announcement,
        isAnnouncementActive: isAnnouncementActive,
        updatedBy: currentUser.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert("System update successful!");
    } catch (err) {
      console.error("Admin update failed:", err);
      alert("Update failed.");
    }
    setSavingAdmin(false);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: '800' }}>LOADING YOUR DATA...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* Dashboard Header */}
      <div style={{ marginTop: '40px', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '10px' }}>DASHBOARD</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your sales, income, and cravings in one place.</p>
      </div>

      {/* Admin Controls - Secret Section */}
      {isAdmin && (
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--accent-primary)' }}>
            <Settings size={28} />
            SYSTEM CONTROL [ADMIN ONLY]
          </h2>
          <div className="card" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(212, 255, 0, 0.02)', padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '30px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Global Announcement Text</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={announcement} 
                  onChange={(e) => setAnnouncement(e.target.value)} 
                  placeholder="e.g. FLASH SALE! ALL KEYCHAINS AT 50% OFF UNTIL MIDNIGHT!"
                  style={{ background: '#000' }}
                />
              </div>
              <div style={{ textAlign: 'right' }}>
                <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Status</label>
                <button 
                  onClick={() => setIsAnnouncementActive(!isAnnouncementActive)}
                  style={{ 
                    padding: '12px 30px', 
                    borderRadius: '30px', 
                    background: isAnnouncementActive ? 'var(--accent-primary)' : 'transparent',
                    border: '1.5px solid var(--accent-primary)',
                    color: isAnnouncementActive ? '#000' : 'var(--accent-primary)',
                    fontWeight: '900',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {isAnnouncementActive ? 'LIVE' : 'OFFLINE'}
                </button>
              </div>
            </div>
            <button 
              onClick={handleAdminUpdate} 
              className="btn-primary" 
              style={{ marginTop: '30px', width: '100%', padding: '15px' }}
              disabled={savingAdmin}
            >
              {savingAdmin ? 'TRANSMITTING...' : 'UPDATE SYSTEM ANNOUNCEMENT'}
            </button>
          </div>
        </section>
      )}

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '60px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)', background: 'rgba(212, 255, 0, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px', fontWeight: '700', textTransform: 'uppercase' }}>Income (This Month)</p>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-primary)' }}>
                <IndianRupee size={32} strokeWidth={3} />
                <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>{stats.monthlyIncome}</h2>
              </div>
            </div>
            <TrendingUp size={48} style={{ opacity: 0.1 }} />
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid white', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px', fontWeight: '700', textTransform: 'uppercase' }}>Items Sold (This Month)</p>
              <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>{stats.totalSold} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Snacks</span></h2>
            </div>
            <PackageCheck size={48} style={{ opacity: 0.1 }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px' }}>
        
        {/* Incoming Orders Section */}
        <section>
          <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ShoppingBag size={28} className="text-accent-primary" />
            INCOMING ORDERS
          </h2>
          {incomingOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No active orders. Your snacks are waiting for buyers!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {incomingOrders.map(order => (
                <div key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                      <PackageCheck size={32} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{order.listingName} <span style={{ color: 'var(--accent-primary)' }}>x{order.quantity}</span></h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Buyer: {order.buyerName} | USN: {order.buyerUSN}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</p>
                      <span style={{ 
                        color: order.status === 'pending' ? '#ffaa00' : 'var(--accent-primary)',
                        fontWeight: '800',
                        fontSize: '0.9rem'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/order/${order.id}`} className="btn-primary" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        textDecoration: 'none',
                        background: 'transparent',
                        border: '1px solid var(--accent-primary)',
                        color: 'var(--accent-primary)',
                        padding: '10px 20px'
                      }}>
                        <MessageSquare size={16} />
                        CHAT
                      </Link>
                      {order.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="btn-primary" style={{ padding: '10px 20px' }}>CONFIRM</button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => updateOrderStatus(order.id, 'picked_up')} className="btn-primary" style={{ padding: '10px 20px' }}>PICKED UP</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Orders Section */}
        <section>
          <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Clock size={28} style={{ color: 'var(--text-secondary)' }} />
            YOUR PURCHASES
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {myOrders.map(order => (
              <Link to={`/order/${order.id}`} key={order.id} className="card" style={{ textDecoration: 'none', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{order.listingName}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status: {order.status}</p>
                </div>
                <ArrowRight size={20} className="text-accent-primary" />
              </Link>
            ))}
            {myOrders.length === 0 && (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '60px 20px', 
                border: '1px solid var(--border-color)', 
                borderRadius: '20px', 
                color: 'var(--text-secondary)', 
                background: 'rgba(255,255,255,0.01)' 
              }}>
                <p style={{ fontSize: '1rem', fontWeight: '500' }}>You haven't ordered anything yet.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
