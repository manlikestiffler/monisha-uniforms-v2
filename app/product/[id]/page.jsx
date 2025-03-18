'use client';
import { useEffect, useState } from 'react';
import ProductDetails from '@/src/pages/ProductDetails';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching product with ID:', params.id); // Debug log
    fetch(`http://localhost:3005/products/${params.id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Product not found');
        }
        return res.json();
      })
      .then(data => {
        console.log('Product data:', data); // Debug log
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-600">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <ProductDetails product={product} />
    </div>
  );
} 