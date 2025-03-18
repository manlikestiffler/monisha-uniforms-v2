import React from 'react';
import Hero from '../components/Home/Hero';
import RecentProducts from '../components/Home/RecentProducts';
import TopRatedProducts from '../components/Home/TopRatedProducts';

const Home = () => {
  return (
    <main className="pt-[88px] pb-16">
      <Hero />
      <div className="space-y-16">
        <RecentProducts />
        <TopRatedProducts />
      </div>
    </main>
  );
};

export default Home; 