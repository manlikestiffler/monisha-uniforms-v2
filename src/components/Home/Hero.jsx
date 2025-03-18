import React from 'react';
import { Search, ArrowRight, Shield, Truck, Clock } from 'lucide-react';

const Hero = () => {
  const popularSchools = [
    "Delhi Public School",
    "St. Mary's",
    "Ryan International",
    "Cambridge School"
  ];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        
        {/* Animated Circles */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
          <div className="w-[500px] h-[500px] rounded-full bg-primary-100/50 animate-float" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4">
          <div className="w-[500px] h-[500px] rounded-full bg-secondary-100/50 animate-float delay-150" />
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
               backgroundSize: '40px 40px'
             }}
        />

        {/* Diagonal Stripes */}
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-primary-100/30 to-transparent transform-gpu" />
        </div>

        {/* Animated Dots */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full bg-primary-400/30
                         animate-float delay-${i * 200}`}
              style={{
                top: `${20 + i * 30}%`,
                left: `${10 + i * 25}%`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>

        {/* Glowing Effect */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-center py-6 sm:py-8 lg:py-12">
          {/* Left Column */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left space-y-6 relative">
            {/* Enhanced Background Effects */}
            <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-br from-red-50 via-white to-red-50/50 
                            rounded-3xl blur-xl -z-10" />
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-red-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-red-100/30 to-white rounded-full blur-2xl -z-10" />

            {/* Delivery Badge - Enhanced */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r 
                            from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20
                            transform hover:scale-105 transition-all duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-sm font-medium">Free Delivery for Orders Above $299</span>
            </div>

            {/* Main Heading - Enhanced */}
            <div className="space-y-4 relative">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight">
                <span className="block text-gray-900 mb-2">Your School's</span>
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-red-600 to-red-500 
                                  bg-clip-text text-transparent">
                    Trusted Partner
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-red-100 -rotate-1 rounded"></span>
                </span>
                <span className="block text-gray-800 mt-2">in Uniforms</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Crafting premium school uniforms that combine comfort, durability, and style. 
                <span className="font-medium text-red-600"> Trusted by leading schools for over two decades.</span>
              </p>
            </div>

            {/* CTA Button - Enhanced */}
            <div className="pt-6">
              <a
                href="/collections"
                className="inline-flex items-center px-8 py-4 rounded-xl 
                          bg-gradient-to-r from-red-600 to-red-500 text-white 
                          font-medium shadow-lg shadow-red-500/30
                          hover:shadow-xl hover:shadow-red-500/40 
                          transform hover:-translate-y-0.5 transition-all duration-300
                          relative overflow-hidden group"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-red-400 
                              transition-transform duration-300 transform translate-x-full 
                              group-hover:translate-x-0" />
                
                <span className="relative flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -left-4 top-1/4 w-24 h-24 bg-gradient-to-br from-red-100 to-white 
                            rounded-full blur-2xl opacity-80" />
            <div className="absolute right-0 bottom-1/3 w-32 h-32 bg-gradient-to-tl from-red-50 to-white 
                            rounded-full blur-2xl opacity-80" />
          </div>

          {/* Right Column - Features */}
          <div className="mt-8 lg:mt-0">
            <div className="relative lg:pl-8">
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100/50 
                            aspect-[16/12] lg:aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="School Uniforms"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Feature Cards - More Compact */}
              <div className="absolute -left-4 top-8 max-w-[250px] bg-white rounded-xl shadow-lg p-3 animate-float">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Premium Quality</h3>
                    <p className="text-sm text-gray-500">Durable materials that last longer</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-1/2 max-w-[250px] bg-white rounded-xl shadow-lg p-3 animate-float delay-150">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Fast Delivery</h3>
                    <p className="text-sm text-gray-500">Quick & reliable shipping</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-8 max-w-[250px] bg-white rounded-xl shadow-lg p-3 animate-float delay-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Easy Returns</h3>
                    <p className="text-sm text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 