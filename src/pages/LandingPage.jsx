import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProductsRequest } from '../redux/productActions';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesBanner from '../components/landing/FeaturesBanner';
import FeaturedProducts from '../components/landing/FeaturedProducts';
import PartnerSection from '../components/landing/PartnerSection';
import BrandsSection from '../components/landing/BrandsSection';
import Footer from '../components/landing/Footer';

import { Link } from 'react-router-dom';

const LandingPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsRequest());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-customBackground-default">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesBanner />
        <FeaturedProducts />
        <PartnerSection />
        <BrandsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
