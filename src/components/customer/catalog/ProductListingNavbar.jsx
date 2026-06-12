import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, MapPin, User, ChevronDown, Menu, Grid, Wrench, Zap, Droplet, Hammer, Truck, Shield, Lightbulb } from 'lucide-react';
import { logout } from '../../../redux/authActions';

export default function ProductListingNavbar({ 
  searchTerm, 
  onSearchChange,
  categoryOptions = [],
  selectedCategory = 'All',
  onCategoryChange = () => {},
  showCategories = false
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;
  
  // Extract unique items count from cart
  const rawCartState = useSelector((state) => state.cart?.cart);
  const cartState = rawCartState || [];
  const cartItems = Array.isArray(cartState) ? cartState : (cartState?.items || []);
  const cartCount = cartItems.length;
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userName = user?.name?.split(' ')[0] || user?.username || 'User Name';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const iconMap = {
    'For You': Grid,
    'All': Grid,
    'Civil Works': Truck,
    'Paints': Droplet,
    'Electricals': Zap,
    'Plumbing': Wrench,
    'Hardware': Hammer,
    'Wood & Ply': Hammer,
    'Glass': Grid,
    'Lighting': Lightbulb,
    'Safety Gear': Shield,
    'Power Tools': Wrench,
    'Machinery': Truck,
    'Cement': Truck,
    'Steel': Hammer,
    'Bricks': Grid
  };

  const infraMartCategories = [
    'All', 'Civil Works', 'Paints', 'Electricals', 'Plumbing', 
    'Hardware', 'Wood & Ply', 'Glass', 'Lighting', 'Safety Gear', 
    'Power Tools', 'Machinery', 'Bricks', 'Cement', 'Steel'
  ];

  const categories = infraMartCategories.map(catName => {
    const label = catName === 'All' ? 'For You' : catName;
    return {
      id: catName,
      label,
      icon: iconMap[label] || iconMap[catName] || null,
      active: selectedCategory === catName || (selectedCategory === '' && catName === 'All')
    };
  });

  return (
    <div className="w-full relative z-50 bg-white">
      {/* Top Navbar */}
      <div className="w-full h-[72px] px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        
        {/* Left: Logo & Location */}
        <div className="flex items-center gap-6 min-w-max">
          <button 
            className="md:hidden p-1 text-slate-600 hover:bg-slate-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/" className="text-[28px] font-bold tracking-tight flex items-center">
            <span className="text-[#0F172A]">Infra</span>
            <span className="text-[#F97316]">Mart</span>
            <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#F97316] ml-1">
              <path d="M12 2L22 22L12 17L2 22Z" />
            </svg>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-4xl px-8 hidden md:block">
          <div className="relative w-full group flex items-center bg-[#F1F3F6] rounded overflow-hidden">
            <div className="pl-3 pr-2 flex items-center pointer-events-none text-slate-500">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="w-full bg-transparent text-slate-800 text-[15px] font-medium py-2.5 pr-4 focus:outline-none placeholder-slate-500"
              placeholder="Search for Products, Brands and More"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6 ml-auto min-w-max">
          
          {/* User Profile / Menu */}
          {user ? (
            <div className="relative group">
              <button 
                className="flex items-center gap-2 py-2 hover:text-[#1E3A8A] transition-colors"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User className="w-5 h-5 text-slate-700 group-hover:text-[#1E3A8A]" />
                <span className="hidden lg:block text-[14px] font-bold text-slate-700">{userName}</span>
                <ChevronDown className="hidden lg:block w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
              </button>

              {isProfileOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-[200px] bg-white rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-slate-200 py-2 z-[100]"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <Link to="/profile" className="flex items-center px-5 py-2.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setIsProfileOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/orders" className="flex items-center px-5 py-2.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setIsProfileOpen(false)}>
                    My Orders
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button 
                    onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                    className="w-full text-left px-5 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-[15px] font-bold text-[#1E3A8A] bg-white border border-slate-200 hover:border-[#1E3A8A] rounded transition-colors shadow-sm">
              Login
            </Link>
          )}

          {/* Orders */}
          {user && (
            <Link to="/orders" className="hidden sm:flex items-center gap-2 py-2 text-slate-700 hover:text-[#1E3A8A] transition-colors">
              <span className="text-[14px] font-bold">Orders</span>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-2 py-2 text-slate-700 hover:text-[#1E3A8A] transition-colors group">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden xl:block text-[14px] font-bold">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white p-3 border-b border-slate-100 shadow-sm">
          <div className="relative w-full flex items-center bg-[#F1F3F6] rounded overflow-hidden">
            <div className="pl-3 pr-2 text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              className="w-full bg-transparent text-sm py-2.5 pr-4 focus:outline-none"
              placeholder="Search for Products, Brands and More"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Category Sub-Navbar */}
      {showCategories && (
        <div className="w-full bg-white border-b border-slate-100 shadow-sm overflow-x-auto hide-scrollbar">
          <div className="flex items-center justify-between min-w-max px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-4 min-w-[70px] transition-colors relative ${
                    cat.active ? 'text-[#1E3A8A]' : 'text-slate-600 hover:text-[#1E3A8A]'
                  }`}
                >
                  {Icon && <Icon className={`w-5 h-5 ${cat.active ? 'text-[#1E3A8A]' : 'text-slate-500'}`} strokeWidth={1.5} />}
                  <span className={`text-[11px] font-bold whitespace-nowrap ${cat.active ? 'text-[#0F172A]' : 'text-slate-700'}`}>
                    {cat.label}
                  </span>
                  {cat.active && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F97316] rounded-t-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
