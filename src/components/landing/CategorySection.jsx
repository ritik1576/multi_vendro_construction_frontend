import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CategorySection = () => {
  const { categories: apiCategories, loading } = useSelector(state => state.category);

  const staticFallbacks = [
    {
      title: "Cement & Concrete",
      desc: "Top quality OPC 53, PPC, and White Cement from trusted brands.",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Steel & TMT",
      desc: "High-grade rebars and structural steel for maximum strength.",
      image: "https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Tiles & Flooring",
      desc: "Premium ceramic, porcelain, and vitrified tiles for all spaces.",
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Electrical & Plumbing",
      desc: "Pipes, fittings, wires, and essential electrical supplies.",
      image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Map the API categories to ensure we don't break the layout. We use static fallbacks if properties are missing.
  // We'll limit to 4 categories for the landing page grid.
  const displayCategories = apiCategories?.slice(0, 4).map((c, idx) => ({
    title: c.name || c.title || staticFallbacks[idx % 4].title,
    desc: c.description || staticFallbacks[idx % 4].desc,
    image: c.image || c.thumbnail || staticFallbacks[idx % 4].image
  })) || [];

  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, idx) => (
      <div key={`cat-skel-${idx}`} className="bg-white rounded-xl shadow-sm border border-customBorder-light overflow-hidden flex flex-col">
        <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded mb-6"></div>
          <div className="mt-auto h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white py-20 border-b border-customBorder-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center relative">
          <h2 className="text-3xl md:text-4xl font-extrabold text-customText-primary mb-3">Shop by Category</h2>
          <div className="w-20 h-1.5 bg-secondary-main rounded-full mb-4"></div>
          <p className="text-customText-secondary text-sm md:text-base max-w-2xl">
            Sourced from top manufacturers across India
          </p>
          <Link to="#" className="absolute right-0 bottom-2 text-primary-main font-semibold hover:text-primary-dark hidden md:block transition-colors">
            View All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? renderSkeletons() : displayCategories.map((category, index) => (
            <Link 
              key={index} 
              to="#" 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-customBorder-light overflow-hidden transition-all duration-300 group flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden bg-gray-100">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-customText-primary mb-2 group-hover:text-primary-main transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-customText-secondary mb-6 flex-grow leading-relaxed">
                  {category.desc}
                </p>
                <div className="flex items-center text-primary-main font-semibold text-sm group-hover:text-primary-dark transition-colors">
                  Browse Category 
                  <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:hidden text-center">
          <Link to="#" className="text-primary-main font-semibold hover:text-primary-dark transition-colors inline-flex items-center">
            View All Categories &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
