import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Shield, Package, RefreshCcw, MessageCircle, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import Slider from 'react-slick';
import api from '../services/api';
import firebaseService from '../services/firebase';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    name: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [schoolData, setSchoolData] = useState(null);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);

  // Helper function to get actual sizes from the database
  const getActualSizesFromDatabase = (productData) => {
    if (!productData) return [];
    
    const actualSizes = [];
    
    // Check if product has variant-specific sizes
    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants.forEach(variant => {
        if (variant && typeof variant === 'object') {
          // Get sizes from variant's sizes array
          if (variant.sizes && Array.isArray(variant.sizes)) {
            variant.sizes.forEach(size => {
              if (typeof size === 'string') {
                actualSizes.push({ size, inStock: true });
              } else if (typeof size === 'object' && size !== null) {
                if (size.size) actualSizes.push({ size: size.size, inStock: size.inStock !== false });
                else if (size.value) actualSizes.push({ size: size.value, inStock: size.inStock !== false });
                else if (size.name) actualSizes.push({ size: size.name, inStock: size.inStock !== false });
              }
            });
          }
          // Get size from variant's size property
          else if (variant.size) {
            if (typeof variant.size === 'string') {
              actualSizes.push({ size: variant.size, inStock: true });
            } else if (typeof variant.size === 'object' && variant.size !== null) {
              if (variant.size.size) actualSizes.push({ size: variant.size.size, inStock: variant.size.inStock !== false });
              else if (variant.size.value) actualSizes.push({ size: variant.size.value, inStock: variant.size.inStock !== false });
              else if (variant.size.name) actualSizes.push({ size: variant.size.name, inStock: variant.size.inStock !== false });
            }
          }
        }
      });
    }
    
    // Check if product has direct sizes property
    if (productData.sizes && Array.isArray(productData.sizes)) {
      productData.sizes.forEach(size => {
        if (typeof size === 'string') {
          actualSizes.push({ size, inStock: true });
        } else if (typeof size === 'object' && size !== null) {
          if (size.size) actualSizes.push({ size: size.size, inStock: size.inStock !== false });
          else if (size.value) actualSizes.push({ size: size.value, inStock: size.inStock !== false });
          else if (size.name) actualSizes.push({ size: size.name, inStock: size.inStock !== false });
        }
      });
    }
    
    // Filter out duplicate sizes (keeping the first occurrence)
    const uniqueSizesMap = new Map();
    actualSizes.forEach(sizeObj => {
      if (!uniqueSizesMap.has(sizeObj.size)) {
        uniqueSizesMap.set(sizeObj.size, sizeObj);
      }
    });
    const uniqueSizes = Array.from(uniqueSizesMap.values());
    
    // Filter out hardcoded S, M, L if they were added by default and not actually from database
    // Only remove S, M, L if they come from the hardcoded default values, not if they're actually in the database
    const defaultSizes = new Set(['S', 'M', 'L']);
    
    // Special filtering logic for S, M, L 
    // We assume these are hardcoded if:
    // 1. All three (S, M, L) are present
    // 2. They all have the same inStock status (all true or all false)
    // 3. They appear consecutively in the array
    const filterDefaultSizes = uniqueSizes.length >= 3 && 
                            uniqueSizes.some((s, i) => 
                              i <= uniqueSizes.length - 3 &&
                              s.size === 'S' && 
                              uniqueSizes[i+1].size === 'M' && 
                              uniqueSizes[i+2].size === 'L' &&
                              s.inStock === uniqueSizes[i+1].inStock &&
                              s.inStock === uniqueSizes[i+2].inStock);
    
    if (filterDefaultSizes) {
      // Remove the default S, M, L sizes
      return uniqueSizes.filter(sizeObj => !defaultSizes.has(sizeObj.size));
    }
    
    return uniqueSizes;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        
        const productData = await api.getProductById(id);
        console.log('Fetched product data:', productData);
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        if (!productData.images || !productData.images.length) {
          productData.images = [
            'https://placehold.co/400x300?text=Image+Not+Found'
          ];
        }
        
        // Process sizes to eliminate hardcoded values
        const processedSizes = getActualSizesFromDatabase(productData);
        setFilteredSizes(processedSizes);
        
        setProduct(productData);
        
        if (productData.schoolId) {
          try {
            const school = await api.getSchoolById(productData.schoolId);
            setSchoolData(school);
            
            if (!productData.schoolName && school && school.name) {
              setProduct(prev => ({
                ...prev,
                schoolName: school.name
              }));
            }
          } catch (schoolErr) {
            console.error('Error fetching school data:', schoolErr);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.rating || !newReview.comment || !newReview.name) {
      setReviewError('Please fill in all fields');
      return;
    }

    setReviewSubmitting(true);
    try {
      const review = {
        id: Date.now(),
        ...newReview,
        date: new Date().toISOString(),
        helpful: 0,
        notHelpful: 0
      };
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 0, comment: '', name: '' });
      setReviewError(null);
    } catch (error) {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleVote = (reviewId, voteType) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          [voteType]: review[voteType] + 1
        };
      }
      return review;
    }));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    
    // Create a cart item with selected information
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      size: selectedSize,
      quantity: 1,
      schoolName: product.schoolName || (schoolData ? schoolData.name : "School Uniform"),
      addedAt: new Date()
    };
    
    try {
      // Call Firebase service to add to cart
      const success = await firebaseService.addToCart(cartItem);
      
      if (success) {
        // Show success feedback
        setAddedToCart(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setAddedToCart(false);
        }, 3000);
        
        // Trigger storage event so other components can update
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Could show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/collections')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Collections
        </button>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImage]}
                  alt={`${product.name} view ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                  }}
                />
              </div>

              <div className="flex justify-center gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                      ${selectedImage === index 
                        ? 'border-primary-500 shadow-md' 
                        : 'border-gray-200 hover:border-primary-300'}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/100x100?text=Thumbnail';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full">
                    {product.type}
                  </span>
                  <span className={`text-sm font-medium px-2.5 py-1 rounded-full
                    ${product.category === 'winter' ? 'bg-blue-50 text-blue-600' : 
                      product.category === 'summer' ? 'bg-orange-50 text-orange-600' : 
                      'bg-gray-50 text-gray-600'}`}>
                    {product.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600">{product.schoolName}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} out of 5
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">Inc. tax</span>
              </div>

              {product.stock < 10 ? (
                <div className="text-yellow-600 text-sm font-medium">
                  Only {product.stock} items left in stock
                </div>
              ) : (
                <div className="text-green-600 text-sm font-medium">
                  In stock
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Size
                </label>
                <div className="flex gap-2">
                  {/* Use filteredSizes instead of product.sizes */}
                  {filteredSizes.length > 0 ? (
                    filteredSizes.map((sizeInfo, index) => (
                      <div key={index} className="group/size relative">
                      <button
                        onClick={() => setSelectedSize(sizeInfo.size)}
                        disabled={!sizeInfo.inStock}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors
                            ${!sizeInfo.inStock
                              ? 'border-2 border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : selectedSize === sizeInfo.size
                              ? 'bg-primary-600 text-white'
                                : 'border-2 border-gray-200 hover:border-primary-500 hover:text-primary-600'}`}
                      >
                        {sizeInfo.size}
                      </button>
                      {!sizeInfo.inStock && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded
                                     opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all">
                          Out of stock
                        </div>
                      )}
                    </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No sizes available</p>
                  )}
                </div>
              </div>

              <button
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                  ${selectedSize
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-300 cursor-not-allowed'}`}
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              {/* Success message */}
              {addedToCart && (
                <div className="mt-2 text-sm text-green-600 flex items-center justify-center">
                  <span>Added to cart successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Quality Guarantee</h4>
                    <p className="text-xs text-gray-500">Premium materials used</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Free Shipping</h4>
                    <p className="text-xs text-gray-500">On orders over $299</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <RefreshCcw className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Easy Returns</h4>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {['description', 'features', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= newReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        className="w-full rounded-lg border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Share your experience with this product..."
                      />
                    </div>

                    {reviewError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{reviewError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{review.name}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleVote(review.id, 'helpful')}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.helpful}</span>
                          </button>
                          <button 
                            onClick={() => handleVote(review.id, 'notHelpful')}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span>{review.notHelpful}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 