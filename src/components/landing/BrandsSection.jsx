import React from 'react';

const BrandsSection = () => {
  const brands = [
    "UltraTech", "TATA Steel", "Asian Paints", "Havells", "Kajaria", "JSW Steel", "Greenply"
  ];

  return (
    <div className="bg-white py-12 border-t border-customBorder-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-customText-disabled uppercase tracking-widest mb-8">
          Trusted Construction Brands
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand, index) => (
            <div key={index} className="text-xl md:text-2xl font-bold text-customText-primary">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsSection;
