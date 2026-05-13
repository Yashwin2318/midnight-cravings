import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import SnackCard from '../components/SnackCard';
import { 
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Bell
} from 'lucide-react';

const CATEGORY_DATA = [
  { id: 'All', name: 'All items', icon: '🛒' },
  { id: 'Midnight snacks', name: 'Midnight snacks', icon: '🌙' },
  { id: 'Notes & study guides', name: 'Notes & study guides', icon: '📚' },
  { id: 'Handmade crafts', name: 'Handmade crafts', icon: '🎨' },
  { id: 'Merch', name: 'Merch', icon: '👕' },
  { id: 'Homemade food', name: 'Homemade food', icon: '🍜' },
  { id: 'Other', name: 'Other', icon: '✨' },
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [announcement, setAnnouncement] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Real-time listener for announcements
    const unsubAnnouncement = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists() && doc.data().isAnnouncementActive) {
        setAnnouncement(doc.data().announcementText);
      } else {
        setAnnouncement(null);
      }
    });

    const fetchListings = async () => {
      try {
        const q = query(collection(db, "listings"), where("quantity", ">", 0));
        const querySnapshot = await getDocs(q);
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListings(fetchedListings);
        setFilteredListings(fetchedListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
      setLoading(false);
    };

    fetchListings();
    return () => unsubAnnouncement();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter(l => l.category === activeCategory));
    }
  }, [activeCategory, listings]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: '800' }}>INITIALIZING CATALOG...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* Global Marquee Alert */}
      {announcement && (
        <div style={{ 
          background: 'var(--accent-primary)', 
          color: '#000', 
          padding: '12px 0', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          fontWeight: '900',
          fontSize: '0.9rem',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(212, 255, 0, 0.3)'
        }}>
          <div className="marquee-content" style={{ display: 'flex', width: 'max-content' }}>
            <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingRight: '50px' }}>
              <Bell size={18} fill="#000" /> {announcement}
              <Bell size={18} fill="#000" /> {announcement}
              <Bell size={18} fill="#000" /> {announcement}
              <Bell size={18} fill="#000" /> {announcement}
            </div>
            <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingRight: '50px' }}>
              <Bell size={18} fill="#000" /> {announcement}
              <Bell size={18} fill="#000" /> {announcement}
              <Bell size={18} fill="#000" /> {announcement}
              <Bell size={18} fill="#000" /> {announcement}
            </div>
          </div>
          <style>{`
            .marquee-content {
              animation: marquee-scroll 30s linear infinite;
            }
            .marquee-track {
              flex-shrink: 0;
            }
            @keyframes marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      )}

      {/* Spacing for Marquee */}
      {announcement && <div style={{ height: '50px' }}></div>}

      {/* Hero Section */}
      <div style={{ marginTop: '80px', marginBottom: '100px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '8px 20px', 
          borderRadius: '30px', 
          border: '1px solid #333',
          background: 'rgba(255,255,255,0.02)',
          marginBottom: '35px'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#44ff44', boxShadow: '0 0 10px #44ff44' }}></div>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Student marketplace · <span style={{ color: '#fff' }}>Open now</span>
          </span>
        </div>

        <h1 style={{ 
          fontSize: 'clamp(3.5rem, 8vw, 6rem)', 
          fontWeight: '900', 
          lineHeight: '0.9', 
          marginBottom: '30px', 
          letterSpacing: '-0.05em',
          wordBreak: 'break-word'
        }}>
          YOUR CAMPUS, <br />
          <span style={{ color: 'var(--accent-primary)' }}>YOUR STORE.</span>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.4rem', maxWidth: '700px', lineHeight: '1.5', fontWeight: '500' }}>
          From midnight munchies to handmade goods — MNC connects <br />
          students who sell with students who need. Fast delivery. Real people.
        </p>
      </div>

      {/* Popular Categories Filter Bar */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ 
          fontSize: '0.75rem', 
          fontWeight: '800', 
          color: 'var(--text-secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em',
          marginBottom: '20px'
        }}>
          Popular Categories
        </h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px'
        }}>
          {CATEGORY_DATA.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '30px',
                border: activeCategory === cat.id ? '1.5px solid var(--accent-primary)' : '1px solid #222',
                background: activeCategory === cat.id ? 'transparent' : 'rgba(255,255,255,0.03)',
                color: activeCategory === cat.id ? 'var(--text-secondary)' : (activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--text-secondary)'),
                fontSize: '0.95rem',
                fontWeight: '700',
                transition: 'var(--transition-smooth)'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'baseline',
        marginBottom: '40px'
      }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>
          {activeCategory === 'All' ? 'LATEST DROPS' : activeCategory.toUpperCase()} 
          <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginLeft: '15px', fontWeight: '500' }}>
            [{filteredListings.length} ITEMS FOUND]
          </span>
        </h2>
      </div>

      {/* Grid or Warning Display */}
      {filteredListings.length === 0 ? (
        <div style={{ 
          padding: '80px 40px', 
          textAlign: 'center', 
          border: '1px solid #333', 
          borderRadius: '24px',
          background: 'rgba(255, 68, 68, 0.02)' 
        }}>
          <AlertTriangle size={64} style={{ color: '#ff4444', marginBottom: '20px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '10px' }}>CATEGORY EMPTY</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Nothing has been dropped in "{activeCategory}" yet. Be the first!
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '40px' 
        }}>
          {filteredListings.map(listing => (
            <SnackCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
