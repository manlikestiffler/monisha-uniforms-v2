import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ImageOff, Check, School } from 'lucide-react';
import Toast from '../ui/Toast';
import api from '../../services/api';
import ProductCard from '../ProductCard';

// Fallback data for when API fails
const fallbackProducts = [
  {
    id: 1,
    name: "Winter School Blazer",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"],
    schoolName: "Cambridge School",
    rating: 4.8,
    stock: 15,
    sizes: [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: false }
    ],
    type: "Winter Wear",
    category: "winter"
  },
  {
    id: 2,
    name: "Summer School Shirt",
    price: 24.99,
    images: ["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800"],
    schoolName: "Delhi Public School",
    rating: 4.5,
    stock: 8,
    sizes: [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: false },
      { size: 'XL', inStock: true }
    ],
    type: "Summer Wear",
    category: "summer"
  },
  // Add more fallback products as needed
];

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const [wishlistItems, setWishlistItems] = useState(
    JSON.parse(localStorage.getItem('wishlist')) || []
  );
  const [schools, setSchools] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Fetch uniforms from Firebase via our API service
        const data = await api.getAllProducts();
        setProducts(data);

        // Fetch school information for each product
        const schoolIds = [...new Set(data.filter(p => p.schoolId).map(p => p.schoolId))];
        const schoolsData = {};
        
        for (const schoolId of schoolIds) {
          try {
            const school = await api.getSchoolById(schoolId);
            schoolsData[schoolId] = school;
          } catch (error) {
            console.error(`Error fetching school ${schoolId}:`, error);
          }
        }
        
        setSchools(schoolsData);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced image error handling
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = `https://placehold.co/800x1000/f3f4f6/64748b?text=${encodeURIComponent('School Uniform')}`;
  };

  // Get school name from the schools object or use a fallback
  const getSchoolName = (product) => {
    if (product.schoolId && schools[product.schoolId]) {
      return schools[product.schoolId].name;
    }
    return product.schoolName || "School Uniform";
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const addToCart = (product) => {
    try {
      if (isInCart(product.id)) {
        setToast({
          message: 'Item already in cart',
          type: 'info'
        });
        return;
      }

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        schoolName: getSchoolName(product),
        size: product.sizes && product.sizes.find(s => s.inStock)?.size || 'M',
        quantity: 1
      };

      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);

      setToast({
        message: 'Product added to cart successfully!',
        type: 'success'
      });

      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        setToast(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({
        message: 'Failed to add product to cart',
        type: 'error'
      });
    }
  };

  // Function to check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Function to toggle wishlist
  const toggleWishlist = (product) => {
    const isAlreadyInWishlist = isInWishlist(product.id);
    
    if (isAlreadyInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter(item => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      setToast({
        message: 'Removed from wishlist',
        type: 'success'
      });
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        schoolName: getSchoolName(product)
      };
      const updatedWishlist = [...wishlistItems, wishlistItem];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      setToast({
        message: 'Added to wishlist',
        type: 'success'
      });
    }

    window.dispatchEvent(new Event('storage'));
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-[400px] rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No products found
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <School className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Uniforms Found</h3>
        <p className="text-gray-500 mb-6">We couldn't find any uniforms that match your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group">
            <ProductCard 
              product={product}
              schoolData={product.schoolId ? schools[product.schoolId] : null}
              showDetailedVariants={true}
            />
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ProductGrid; 