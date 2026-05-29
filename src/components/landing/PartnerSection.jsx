import React from 'react';
import { Search, Handshake, Truck } from 'lucide-react';

const PartnerSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-customText-primary inline-block relative">
          Your End-to-End Construction Partner
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary-main rounded-full"></div>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Decorative lines connecting steps - visible only on md+ */}
        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>

        {/* Step 1: Explore */}
        <div className="relative z-10 bg-white rounded-xl p-8 border border-customBorder-light shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary-dark rounded-xl flex items-center justify-center mb-6 shadow-md">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-customText-primary mb-3">Explore</h3>
          <p className="text-sm text-customText-secondary mb-6 leading-relaxed">
            Discover 20,000+ varieties of premium construction materials with real-time availability and certifications.
          </p>
          <ul className="text-xs text-customText-secondary space-y-2 text-left w-full">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-main"></div> Real-time stock status</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-main"></div> Detailed certifications</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-main"></div> Instant price comparison</li>
          </ul>
        </div>

        {/* Step 2: Source (Most Preferred) */}
        <div className="relative z-10 bg-white rounded-xl p-8 border-2 border-primary-dark shadow-md flex flex-col items-center text-center transform md:-translate-y-4">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-dark text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Preferred
          </div>
          <div className="w-16 h-16 bg-primary-dark rounded-xl flex items-center justify-center mb-6 shadow-md mt-2">
            <Handshake className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-customText-primary mb-3">Source</h3>
          <p className="text-sm text-customText-secondary mb-6 leading-relaxed">
            Connect directly with 500+ authenticated manufacturers and cut out intermediaries for the best rates.
          </p>
          <ul className="text-xs text-customText-secondary space-y-2 text-left w-full">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary-main"></div> Manufacturer-direct rates</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary-main"></div> Verified wholesale sellers</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary-main"></div> Bulk discount guarantee</li>
          </ul>
        </div>

        {/* Step 3: Supply */}
        <div className="relative z-10 bg-white rounded-xl p-8 border border-customBorder-light shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary-dark rounded-xl flex items-center justify-center mb-6 shadow-md">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-customText-primary mb-3">Supply</h3>
          <p className="text-sm text-customText-secondary mb-6 leading-relaxed">
            Hassle-free Pan-India delivery with integrated logistics ensuring site delivery on time.
          </p>
          <ul className="text-xs text-customText-secondary space-y-2 text-left w-full">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-main"></div> Pan-India coverage</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-main"></div> Real-time shipment tracking</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-main"></div> Dedicated logistics support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;
