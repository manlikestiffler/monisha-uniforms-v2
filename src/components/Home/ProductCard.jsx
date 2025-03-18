import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const ProductCard = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await api.products.getById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/collections')} 
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    beforeChange: (_, next) => setCurrentImageIndex(next),
    className: "product-slider",
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-[580px] mb-8">
      {/* Image Container - Increased height */}
      <div className="relative h-[340px] overflow-hidden bg-gray-100">
        {/* School Name Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-sm">
            {product.schoolName}
          </span>
        </div>

        <Slider {...sliderSettings}>
          {product.images.map((image, index) => (
            <div key={index}>
              <div className="h-[340px] w-full">
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Content - Better spacing */}
      <div className="p-4 space-y-4">
        {/* Product Title and Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-medium text-gray-900 leading-tight line-clamp-2">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
            ${product.price}
          </span>
        </div>

        {/* Type, Category and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm px-3 py-1 bg-primary-50 text-primary-600 rounded-full">
              {product.type}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full
              ${product.category === 'winter' ? 'bg-blue-50 text-blue-600' : 
                product.category === 'summer' ? 'bg-orange-50 text-orange-600' : 
                'bg-gray-50 text-gray-600'}`}>
              {product.category}
            </span>
          </div>
          {product.stock < 10 && (
            <span className="text-sm text-yellow-600 font-medium whitespace-nowrap">
              {product.stock} left
            </span>
          )}
        </div>

        {/* Sizes */}
        <div className="flex gap-2 justify-center py-2">
          {product.sizes.map((sizeInfo) => (
            <div key={sizeInfo.size} className="group/size relative">
              <button
                disabled={!sizeInfo.inStock}
                className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors
                  ${sizeInfo.inStock 
                    ? 'border-2 border-gray-200 hover:border-primary-500 hover:text-primary-600' 
                    : 'border-2 border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
              >
                {sizeInfo.size}
              </button>
              {!sizeInfo.inStock && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded
                             opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all">
                  Out of stock
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            className="p-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <a 
            href={`/product/${product.id}`}
            className="flex-1 py-2.5 px-4 rounded-lg border-2 border-gray-100 hover:border-primary-100 
                     hover:bg-primary-50 transition-colors text-center font-medium text-sm text-gray-700 
                     hover:text-primary-600"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

// Add custom CSS for the slider
const styles = `
.product-slider .slick-slide {
  height: auto;
}

.product-slider .slick-track {
  display: flex;
  align-items: stretch;
}

.product-slider .slick-slide > div {
  height: 100%;
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ProductCard; 