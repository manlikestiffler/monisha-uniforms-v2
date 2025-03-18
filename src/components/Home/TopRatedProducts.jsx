import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProductCard from '../ProductCard';

const TopRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schools, setSchools] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch top rated uniforms
        const data = await api.getTopRatedProducts();
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
        setError(err.message || "Failed to load top rated products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Top Rated Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white h-[300px] rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Rated Products</h2>
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          Error: {error}
        </div>
      </div>
    </section>
  );

  if (!products || products.length === 0) return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Rated Products</h2>
        <p className="text-gray-500">No top rated products available.</p>
      </div>
    </section>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Top Rated Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              schoolData={product.schoolId ? schools[product.schoolId] : null}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedProducts; 