import { Link } from 'react-router-dom';
import { useState } from 'react';
import firebaseService from '../src/services/firebase';

// This is a direct approach without using the Firebase service for now
export default function ProductCard({ product }) {
  const [wishlistAdded, setWishlistAdded] = useState(false);

  // Handle adding to wishlist
  const addToWishlist = async () => {
    try {
      // Call Firebase service to add to wishlist
      const success = await firebaseService.addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.back || product.images?.front,
        addedAt: new Date()
      });
      
      if (success) {
        // Show success feedback
        setWishlistAdded(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setWishlistAdded(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
      <h3 className="text-xl font-semibold p-4 pb-2">
        {product.name} - {product.images?.back ? 'Back View' : 'Front View'}
      </h3>
      
      <div className="relative aspect-[4/3]">
        <img 
          src={product.images?.back || product.images?.front} 
          alt={`${product.name} view`}
          className="w-full h-full object-cover"
        />
        {product.stock === "Out of stock" && (
          <span className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 text-sm">
            Out of stock
          </span>
        )}
        {product.school && (
          <span className="absolute top-2 left-2 bg-white px-2 py-1 rounded-md text-sm">
            {product.school}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <p className="text-xl font-bold">${product.price}</p>
        </div>

        <p className="text-gray-600 text-sm mb-3">{product.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.category === 'winter wear' ? 'bg-blue-50 text-blue-600' :
            product.category === 'summer wear' ? 'bg-yellow-50 text-yellow-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            {product.category}
          </span>
          <span className="text-sm px-2 py-1 rounded-full text-red-600">
            {product.type}
          </span>
        </div>

        {product.stock !== "Out of stock" && (
          <p className={`text-sm mb-3 ${
            product.stock === "Low stock" ? 'text-orange-500' : 'text-green-500'
          }`}>
            {product.stock}
          </p>
        )}

        {/* Available sizes label without selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Available Sizes:</p>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(product.sizes) && product.sizes.map((size, index) => {
                // Handle both string and object formats
                const sizeValue = typeof size === 'string' ? size : size.size || size.value || size.name;
                return (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-md">{sizeValue}</span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Link 
            to={`/product/${product.id}`}
            className="flex-1 bg-white border border-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 text-center"
          >
            View Details
          </Link>
          <button 
            className="w-12 h-10 bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center justify-center"
            aria-label="Add to wishlist"
            onClick={addToWishlist}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={wishlistAdded ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
        
        {/* Success message */}
        {wishlistAdded && (
          <div className="mt-2 text-sm text-green-600 text-center">
            Added to wishlist!
          </div>
        )}
      </div>
    </div>
  );
} 