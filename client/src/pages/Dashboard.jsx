import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, List as ListIcon, Clock, CheckCircle, Package } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setIncomingOrders(incomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch My Orders (as buyer)
        const myOrdersQ = query(collection(db, "orders"), where("buyerId", "==", currentUser.uid));
        const myOrdersSnap = await getDocs(myOrdersQ);
        setMyOrders(myOrdersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser.uid]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setIncomingOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <LayoutDashboard size={32} className="text-accent-primary" />
        Your Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
        
        {/* Incoming Orders Section */}
        <section>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={24} />
            Incoming Orders (You're the Seller)
          </h2>
          <div className="glass" style={{ padding: '20px' }}>
            {incomingOrders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No orders yet. Hang tight!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {incomingOrders.map(order => (
                  <div key={order.id} className="glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                    <div>
                      <h4 style={{ color: 'var(--accent-primary)' }}>{order.listingName} (x{order.quantity})</h4>
                      <p style={{ fontSize: '0.9rem' }}>Buyer: {order.buyerName} - Room {order.buyerRoom}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: <span style={{ color: order.status === 'pending' ? 'orange' : 'lightgreen' }}>{order.status.toUpperCase()}</span></p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/order/${order.id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>Chat/Details</Link>
                      {order.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(order.id, 'confirmed')} style={{ background: 'rgba(0,255,0,0.1)', color: 'lightgreen', fontSize: '0.8rem' }}>Confirm</button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => updateOrderStatus(order.id, 'picked_up')} style={{ background: 'rgba(157,78,221,0.1)', color: 'var(--accent-primary)', fontSize: '0.8rem' }}>Picked Up</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* My Orders Section */}
        <section>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={24} />
            Your Placed Orders (You're the Buyer)
          </h2>
          <div className="glass" style={{ padding: '20px' }}>
            {myOrders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>You haven't ordered anything yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {myOrders.map(order => (
                  <div key={order.id} className="glass" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                    <div>
                      <h4 style={{ color: 'var(--accent-secondary)' }}>{order.listingName} (x{order.quantity})</h4>
                      <p style={{ fontSize: '0.9rem' }}>Seller: {order.sellerName}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: {order.status}</p>
                    </div>
                    <Link to={`/order/${order.id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>View Pickup</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* My Listings Section */}
        <section>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ListIcon size={24} />
            Your Active Listings
          </h2>
          <div className="glass" style={{ padding: '20px' }}>
            {myListings.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>You aren't selling anything right now.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {myListings.map(listing => (
                  <div key={listing.id} className="glass" style={{ padding: '15px', background: 'rgba(255,255,255,0.03)' }}>
                    <h4 style={{ marginBottom: '5px' }}>{listing.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Price: ${listing.price}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {listing.quantity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
