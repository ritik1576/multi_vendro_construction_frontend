import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesBanner from '../components/landing/FeaturesBanner';
import CategorySection from '../components/landing/CategorySection';
import FeaturedProducts from '../components/landing/FeaturedProducts';
import PartnerSection from '../components/landing/PartnerSection';
import BrandsSection from '../components/landing/BrandsSection';
import Footer from '../components/landing/Footer';

import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-customBackground-default">
      <Navbar />
      <main className="flex-grow">
        {/* Temporary Quick Link to bypass auth and view products */}
        <div className="bg-primary-500 text-white text-center py-3">
          <Link to="/products" className="font-bold underline hover:text-gray-200">
            Click here to view all Products (No Login Required)
          </Link>
        </div>
        <HeroSection />
        <FeaturesBanner />
        <CategorySection />
        <FeaturedProducts />
        <PartnerSection />
        <BrandsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
