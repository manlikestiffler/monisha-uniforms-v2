import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Ruler, Check, Paintbrush, Heart } from 'lucide-react';
import firebaseService from '../services/firebase';

const ProductCard = ({ product, schoolData, showDetailedVariants = false }) => {
  // State for wishlist
  const [isInWishlist, setIsInWishlist] = useState(false);
  // State for cart feedback (keeping for compatibility)
  const [isInCart, setIsInCart] = useState(false);
  
  // Check if product is in wishlist and cart on mount
  useEffect(() => {
    // Check if product is in wishlist
    const checkWishlist = async () => {
      const wishlistStatus = await firebaseService.isInWishlist(product.id);
      setIsInWishlist(wishlistStatus);
    };
    
    // Check if product is in cart (any size)
    const checkCart = async () => {
      const cartStatus = await firebaseService.isInCart(product.id);
      setIsInCart(cartStatus);
    };
    
    checkWishlist();
    checkCart();
    
    // Listen for storage events from other components
    const handleStorageChange = () => {
      checkWishlist();
      checkCart();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [product.id]);
  
  // Toggle wishlist
  const toggleWishlist = async (e) => {
    e.preventDefault();
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await firebaseService.removeFromWishlist(product.id);
      } else {
        // Add to wishlist
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          addedAt: new Date()
        };
        await firebaseService.addToWishlist(wishlistItem);
      }
      
      // Update local state
      setIsInWishlist(!isInWishlist);
      
      // Trigger storage event so other components can update
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  // View product details
  const viewDetails = (e) => {
    // No implementation needed as we use direct Link component
    // This is just a placeholder in case we need to add logic before navigation
  };

  // Handle image errors
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = `https://placehold.co/600x600/f3f4f6/64748b?text=${encodeURIComponent('School Uniform')}`;
  };

  // Get school name from either the product or the school data
  const getSchoolName = () => {
    if (schoolData && schoolData.name) {
      return schoolData.name;
    }
    return product.schoolName || "School Uniform";
  };
  
  // Get actual product sizes from database data
  const getActualSizesFromDatabase = () => {
    // If no product or variants, return empty array
    if (!product) return [];
    
    const actualSizes = [];
    
    // Check if product has variant-specific sizes
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach(variant => {
        if (variant && typeof variant === 'object') {
          // Get sizes from variant's sizes array
          if (variant.sizes && Array.isArray(variant.sizes)) {
            variant.sizes.forEach(size => {
              if (typeof size === 'string') {
                actualSizes.push(size);
              } else if (typeof size === 'object' && size !== null) {
                if (size.size) actualSizes.push(size.size);
                else if (size.value) actualSizes.push(size.value);
                else if (size.name) actualSizes.push(size.name);
              }
            });
          }
          // Get size from variant's size property
          else if (variant.size) {
            if (typeof variant.size === 'string') {
              actualSizes.push(variant.size);
            } else if (typeof variant.size === 'object' && variant.size !== null) {
              if (variant.size.size) actualSizes.push(variant.size.size);
              else if (variant.size.value) actualSizes.push(variant.size.value);
              else if (variant.size.name) actualSizes.push(variant.size.name);
            }
          }
        }
      });
    }
    
    // Check if product has direct sizes property
    if (product.sizes && Array.isArray(product.sizes)) {
      product.sizes.forEach(size => {
        if (typeof size === 'string') {
          actualSizes.push(size);
        } else if (typeof size === 'object' && size !== null) {
          if (size.size) actualSizes.push(size.size);
          else if (size.value) actualSizes.push(size.value);
          else if (size.name) actualSizes.push(size.name);
        }
      });
    }
    
    // Remove duplicates first
    const uniqueSizes = [...new Set(actualSizes)];
    
    // DIRECT APPROACH: Simply filter out S, M, L completely without any validation
    // The user has confirmed these specific sizes aren't valid database values
    const filteredSizes = uniqueSizes.filter(size => {
      // Convert to string and normalize to handle cases where size might be a number or other type
      const sizeStr = String(size).trim();
      return sizeStr !== "S" && sizeStr !== "M" && sizeStr !== "L";
    });
    
    return filteredSizes;
  };
  
  // Get all variant types from variants
  const getVariantTypesFromProduct = () => {
    const variantTypes = [];
    
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach(variant => {
        if (typeof variant === 'string') {
          variantTypes.push(variant);
          return;
        }
        
        if (variant && typeof variant === 'object') {
          // Check for type properties
          if (variant.type) variantTypes.push(variant.type);
          else if (variant.variantType) variantTypes.push(variant.variantType);
          else if (variant.style) variantTypes.push(variant.style);
          else if (variant.name) variantTypes.push(variant.name);
          else {
            // Look for any string property that might be a type
            for (const key in variant) {
              if (typeof variant[key] === 'string' && 
                  !['color', 'colour', 'price', 'id', 'productId', 'image', 'images'].includes(key)) {
                variantTypes.push(variant[key]);
                break;
              }
            }
          }
        }
      });
    }
    
    // Return unique types
    return [...new Set(variantTypes)];
  };
  
  // Get all colors from product and variants
  const getColorsFromProduct = () => {
    const allColors = [];
    
    // First try to get colors directly from product
    if (product.colors && Array.isArray(product.colors)) {
      product.colors.forEach(color => {
        if (color) allColors.push(color);
      });
    }
    
    // Extract colors from variants
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach(variant => {
        if (variant && typeof variant === 'object') {
          // Check for color property
          if (variant.color) {
            allColors.push(variant.color);
          }
          
          // Check for colors array
          if (variant.colors && Array.isArray(variant.colors)) {
            variant.colors.forEach(color => {
              if (color) allColors.push(color);
            });
          }
          
          // Check for colour or colours (British spelling)
          if (variant.colour) {
            allColors.push(variant.colour);
          }
          if (variant.colours && Array.isArray(variant.colours)) {
            variant.colours.forEach(color => {
              if (color) allColors.push(color);
            });
          }
        }
      });
    }
    
    // Return unique colors
    return [...new Set(allColors)];
  };

  // Get the color name from hex or just return the color
  const getColorName = (color) => {
    const colorMap = {
      '#ffffff': 'White',
      '#000000': 'Black',
      '#0000ff': 'Blue',
      '#ff0000': 'Red',
      '#008000': 'Green',
      '#ffff00': 'Yellow',
      '#a52a2a': 'Brown',
      '#808080': 'Gray',
      '#ffc0cb': 'Pink',
      '#800080': 'Purple',
      '#ffa500': 'Orange',
    };
    
    if (!color) return 'Unknown';
    
    // If color is an object with a color property, use that
    if (typeof color === 'object' && color !== null) {
      if (color.name) return color.name;
      if (color.color) return color.color;
      if (color.value) return color.value;
      
      // Find any property that might be a color name
      for (const key in color) {
        if (typeof color[key] === 'string') {
          return color[key];
        }
      }
      
      return 'Color';
    }
    
    // If it's a hex color and in our map, return the name
    if (typeof color === 'string') {
      const lowerColor = color.toLowerCase();
      if (colorMap[lowerColor]) {
        return colorMap[lowerColor];
      }
      
      // It's a string but not a hex in our map, just return it
      return color;
    }
    
    return 'Color';
  };

  // Extract color value for display
  const getColorValue = (color) => {
    if (!color) return '#cccccc';
    
    if (typeof color === 'object' && color !== null) {
      // Try several possible properties for color value
      if (color.value && typeof color.value === 'string' && 
          (color.value.startsWith('#') || color.value.startsWith('rgb'))) {
        return color.value;
      }
      if (color.color && typeof color.color === 'string' && 
          (color.color.startsWith('#') || color.color.startsWith('rgb'))) {
        return color.color;
      }
      if (color.hex) return color.hex;
      if (color.code) return color.code;
      
      // Common color names to hex
      const nameToHex = {
        'white': '#ffffff',
        'black': '#000000',
        'blue': '#0000ff',
        'red': '#ff0000',
        'green': '#008000',
        'yellow': '#ffff00',
        'brown': '#a52a2a',
        'gray': '#808080',
        'pink': '#ffc0cb',
        'purple': '#800080',
        'orange': '#ffa500',
      };
      
      // Check if any property is a color name we can convert
      for (const key in color) {
        if (typeof color[key] === 'string') {
          const val = color[key].toLowerCase();
          if (nameToHex[val]) {
            return nameToHex[val];
          }
          if (val.startsWith('#') || val.startsWith('rgb')) {
            return val;
          }
        }
      }
      
      return '#cccccc';
    }
    
    if (typeof color === 'string') {
      if (color.startsWith('#') || color.startsWith('rgb')) {
        return color;
      }
      
      // Try to convert common color names to hex
      const nameToHex = {
        'white': '#ffffff',
        'black': '#000000',
        'blue': '#0000ff',
        'red': '#ff0000',
        'green': '#008000',
        'yellow': '#ffff00',
        'brown': '#a52a2a',
        'gray': '#808080',
        'pink': '#ffc0cb',
        'purple': '#800080',
        'orange': '#ffa500',
      };
      
      const lowerColor = color.toLowerCase();
      if (nameToHex[lowerColor]) {
        return nameToHex[lowerColor];
      }
    }
    
    return '#cccccc'; // Default gray color
  };

  // Format a value for display, handling objects and arrays
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).join(', ');
    }
    
    if (typeof value === 'object') {
      // Handle common variant object patterns
      if (value.size && typeof value.size === 'string') {
        return value.size;
      }
      
      if (value.name) {
        return value.name;
      }
      
      if (value.value) {
        return value.value;
      }
      
      // Extract the first string property
      for (const key in value) {
        if (typeof value[key] === 'string') {
          return value[key];
        }
      }
      
      // If we can't find a good string representation, return a simple object notation
      return JSON.stringify(value).substring(0, 20);
    }
    
    return String(value);
  };

  // Get actual data from database
  const actualSizes = getActualSizesFromDatabase();
  const productColors = getColorsFromProduct();
  const variantTypes = getVariantTypesFromProduct();
  
  // Check if we have data
  const hasSizes = actualSizes && actualSizes.length > 0;
  const hasColors = productColors && productColors.length > 0;
  const hasVariantTypes = variantTypes && variantTypes.length > 0;

  return (
    <div className="group relative">
      <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-white border border-gray-100">
        {/* Image container with rounded corners and improved hover effect */}
        <div className="relative aspect-[1/1] overflow-hidden bg-gray-50">
          <img 
            src={product.images && product.images.length > 0 ? product.images[0] : ''}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* School badge with updated styling */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 rounded-full shadow-sm">
              {getSchoolName()}
            </span>
          </div>

          {/* Gender badge with improved styling */}
          {product.gender && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm
                ${product.gender === 'Boys' ? 'bg-blue-500 text-white' : 
                  product.gender === 'Girls' ? 'bg-pink-500 text-white' : 
                  'bg-purple-500 text-white'}`}>
                {product.gender}
              </span>
            </div>
          )}
          
          {/* View Details Button with improved styling */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
            <Link 
              to={`/product/${product.id}`}
              className="px-5 py-2.5 bg-white hover:bg-primary-600 hover:text-white text-gray-900 rounded-full font-semibold transition-all duration-300 shadow-md transform group-hover:scale-105"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Modernized content area with better spacing and visual hierarchy */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title with improved typography */}
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-base mb-2 line-clamp-2">
              {product.name}
            </h3>
          
          {/* Rating with improved styling */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-500">({product.rating})</span>
            </div>
          )}
          
          {/* Gradient divider instead of simple border */}
          <div className="h-px w-full bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 my-3"></div>
          
          {/* Improved sizes display with icon */}
          {hasSizes && (
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1.5">
                <Ruler size={14} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-500">Available Sizes:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {actualSizes.map((size, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    {size}
                  </span>
                ))}
              </div>
          </div>
          )}
          
          {/* Improved price and action row with variants in middle */}
          <div className="mt-auto pt-3 flex items-center justify-between">
            {/* Price section */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Price</span>
              <p className="text-lg font-bold text-gray-900">${product.price}</p>
            </div>
            
            {/* Center section - Modernized variant details */}
            <div className="flex items-center gap-2 mx-1">
              {/* Variant Type with icon */}
              {hasVariantTypes && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200 flex items-center gap-1">
                  <Check size={10} className="text-primary-500" />
                  {variantTypes[0]}
              </span>
              )}
              
              {/* Color with improved indicator */}
              {hasColors && (
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: getColorValue(productColors[0]) }}
                  ></div>
                  <span className="text-xs font-medium text-gray-600">
                    {getColorName(productColors[0])}
                  </span>
                </div>
              )}
            </div>
            
            {/* Wishlist button instead of eye icon */}
            <button 
              onClick={toggleWishlist}
              className={`p-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md
                ${isInWishlist 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-primary-50 hover:bg-primary-500 text-primary-500 hover:text-white'}`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 