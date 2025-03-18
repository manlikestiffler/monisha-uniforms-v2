import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import firebaseService from '../services/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // User is signed in, sync cart and wishlist
        await firebaseService.syncCartAndWishlist();
        
        // Trigger storage event so other components can update
        window.dispatchEvent(new Event('storage'));
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <Outlet context={{ user }} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 