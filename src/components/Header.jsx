import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, Search, ChevronDown } from 'lucide-react';
import firebaseService from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Get cart and wishlist counts
  useEffect(() => {
    const fetchCounts = async () => {
      const cartItems = await firebaseService.getCart();
      const wishlistItems = await firebaseService.getWishlist();
      
      setCartCount(cartItems.length);
      setWishlistCount(wishlistItems.length);
    };
    
    fetchCounts();
    
    // Listen for storage events (when cart/wishlist is updated in another component)
    const handleStorageChange = () => {
      fetchCounts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // ... rest of component (rendering) stays the same ...
}; 