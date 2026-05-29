import React from 'react';
import { ShieldCheck, UserCheck, Truck, HeadphonesIcon } from 'lucide-react';

const FeaturesBanner = () => {
  const features = [
    { icon: <ShieldCheck className="h-6 w-6 text-primary-main" />, text: "100% Genuine Products" },
    { icon: <UserCheck className="h-6 w-6 text-primary-main" />, text: "Verified Sellers Only" },
    { icon: <Truck className="h-6 w-6 text-primary-main" />, text: "Free Bulk Delivery" },
    { icon: <HeadphonesIcon className="h-6 w-6 text-primary-main" />, text: "24/7 Expert Support" },
  ];

  return (
    <div className="bg-white border-b border-customBorder-light shadow-sm relative z-20 -mt-8 mx-4 sm:mx-6 lg:mx-8 rounded-xl max-w-7xl xl:mx-auto">
      <div className="px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-4 group">
              <div className="p-4 bg-blue-50 rounded-full group-hover:bg-primary-main group-hover:-translate-y-1 transition-all duration-300 shadow-sm">
                {React.cloneElement(feature.icon, { className: "h-8 w-8 text-primary-main group-hover:text-white transition-colors" })}
              </div>
              <span className="font-bold text-customText-primary text-sm md:text-base">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesBanner;
