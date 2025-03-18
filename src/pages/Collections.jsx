import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/Collections/ProductGrid';
import { Search, SlidersHorizontal, ArrowDownWideNarrow, Sparkles } from 'lucide-react';

const Collections = () => {
  // Add loading state management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    schools: '20+',
    products: '500+',
    satisfaction: '98%'
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call or add your actual API call here
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Loading state UI
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-100"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Light Theme Hero Section with Radiant Colors */}
      <div className="relative bg-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Radiant Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-white to-indigo-100/40"></div>
          
          {/* Colorful Circles */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-pink-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-cyan-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          {/* Animated Mesh Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.15) 1px, transparent 0)
              `,
              backgroundSize: '48px 48px'
            }}
          />

          {/* Floating Elements */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-24 h-24 rounded-full opacity-20 animate-float-slow`}
              style={{
                background: `linear-gradient(135deg, ${['#60A5FA', '#F472B6', '#34D399'][i]}, transparent)`,
                top: `${20 + i * 30}%`,
                left: `${10 + i * 25}%`,
                animationDelay: `${i * 0.5}s`,
                filter: 'blur(40px)'
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-100 shadow-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-primary-900">Premium School Uniforms</span>
            </div>

            {/* Enhanced Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-gray-900">
              Discover Our
              <span className="relative inline-block px-4 mx-2">
                <span className="relative z-10 bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                  Uniform
                </span>
                <div className="absolute bottom-2 left-0 w-full h-3 bg-primary-100 -rotate-1"></div>
              </span>
              Collection
            </h1>

            {/* Enhanced Subheading */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore our comprehensive range of high-quality school uniforms, 
              designed for comfort and durability.
            </p>

            {/* Enhanced Search Bar with Error Prevention */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by school name or uniform type..."
                  className="w-full pl-14 pr-6 py-4 rounded-2xl 
                           bg-white border-2 border-gray-100
                           focus:border-primary-500 focus:ring focus:ring-primary-100 
                           transition-all duration-300 text-gray-900 placeholder-gray-400
                           shadow-sm hover:border-gray-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Handle search
                    }
                  }}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Enhanced Popular Searches */}
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Popular:</span>
                {['Winter Blazer', 'Summer Shirt', 'Sports Uniform'].map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1.5 text-sm bg-white shadow-sm border border-gray-100
                             rounded-full text-gray-600 hover:border-primary-500 hover:bg-primary-50
                             hover:text-primary-600 transition-colors duration-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Stats with Error Prevention */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                  <div className="text-sm text-gray-500">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid />
      </div>
    </div>
  );
};

// Add these keyframes to your globals.css
const styles = `
@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Collections; 