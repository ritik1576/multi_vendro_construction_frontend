import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Share2, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="text-[28px] font-extrabold tracking-tight flex items-center">
              <span className="text-white">Infra</span>
              <span className="text-secondary-main">Mart</span>
              <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-secondary-main ml-1">
                <path d="M12 2L22 22L12 17L2 22Z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              India's trusted B2B marketplace for construction materials. Quality products, competitive prices, reliable delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-main hover:text-white transition-colors">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-main hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-main hover:text-white transition-colors">
                <Heart className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-primary-light transition-colors">Cement</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Steel & TMT</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Plywood</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Tiles & Sanitaryware</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Electrical & Plumbing</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-primary-light transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Verified Sellers</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Business Inquiries</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Contact Support</Link></li>
              <li><Link to="#" className="hover:text-primary-light transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary-main shrink-0" />
                <span>+91 77300 30005</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary-main shrink-0" />
                <span>support@inframart.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-main shrink-0" />
                <span>Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 InfraMart. A brand of Alysh Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure Payments</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Genuine Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
