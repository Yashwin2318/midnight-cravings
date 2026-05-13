import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import SnackCard from '../components/SnackCard';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, "listings"), where("quantity", ">", 0));
        const querySnapshot = await getDocs(q);
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListings(fetchedListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading snacks...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <header style={{ 
        padding: '60px 40px', 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.2), rgba(255, 0, 110, 0.2))',
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--surface-border)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '15px', letterSpacing: '-0.05em' }}>
            Late Night <span style={{ color: 'var(--accent-secondary)' }}>Munchies?</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 30px' }}>
            The exclusive student marketplace for dorm snacks. Buy what you crave, sell what you have.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <Link to="/create-listing" className="btn-primary" style={{ padding: '12px 30px', textDecoration: 'none', borderRadius: '30px' }}>Start Selling</Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.3 }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-secondary)', filter: 'blur(100px)', opacity: 0.3 }}></div>
      </header>

      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>Freshly Listed</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Grab 'em before they're gone!</p>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="glass" style={{ padding: '50px', textAlign: 'center' }}>
          <h3>No listings yet.</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Be the first to sell a snack!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px' 
        }}>
          {listings.map(listing => (
            <SnackCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
