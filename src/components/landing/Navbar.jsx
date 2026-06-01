import { Search, ShoppingCart, Bell, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/useCart';

const Navbar = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const isLandingPage = location.pathname === '/';
  const isRegisterPage = location.pathname.includes('/register');
  const isLoginPage = location.pathname.includes('/login');
  const isForgotPasswordPage = location.pathname.includes('/forgot-password');
  const isProductsPage = location.pathname === '/products';
  const isProductDetailPage = location.pathname.startsWith('/product/');
  const isCartPage = location.pathname === '/cart';
  const isOrderPage = location.pathname.startsWith('/orders/');
  const isCustomerProductPage = isProductsPage || isProductDetailPage || isCartPage || isOrderPage;
  const isAuthPage = isRegisterPage || isLoginPage || isForgotPasswordPage;
  const hideSearchAndIcons = isLandingPage || isAuthPage;

  return (
    <nav className="bg-white border-b border-customBorder-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-1">
            <Link to="/" className="text-[28px] font-extrabold tracking-tight flex items-center">
              <span className="text-primary-dark">Infra</span>
              <span className="text-secondary-main">Mart</span>
              <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-secondary-main ml-1">
                <path d="M12 2L22 22L12 17L2 22Z" />
              </svg>
            </Link>
          </div>

          {/* Search Bar */}
          {!hideSearchAndIcons && (
            <button className="hidden lg:flex items-center gap-2 rounded-md border border-customBorder-light bg-gray-50 px-3 py-2 text-left hover:bg-orange-50 transition-colors" type="button">
              <MapPin className="h-4 w-4 text-secondary-main" />
              <span className="flex flex-col leading-none">
                <span className="text-[10px] font-bold uppercase text-customText-disabled">Deliver to</span>
                <span className="mt-1 text-xs font-bold text-customText-primary">Mumbai GPO</span>
              </span>
            </button>
          )}

          {!hideSearchAndIcons && !isProductsPage && (
            <div className="hidden md:flex flex-1 max-w-md mx-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-customText-disabled" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-customBorder-light rounded-md leading-5 bg-gray-50 placeholder-customText-disabled focus:outline-none focus:ring-1 focus:ring-primary-main focus:border-primary-main sm:text-sm"
                placeholder="Search 10,000+ construction products..."
              />
            </div>
          )}

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 text-sm font-medium text-customText-secondary ml-8">
            <Link to="#" className="px-3 py-2 rounded-md hover:text-primary-main hover:bg-orange-50 transition-colors">Categories</Link>
            <Link to="#" className="px-3 py-2 rounded-md hover:text-primary-main hover:bg-orange-50 transition-colors">Bulk Orders</Link>
            <Link to="#" className="px-3 py-2 rounded-md hover:text-primary-main hover:bg-orange-50 transition-colors">Verified Sellers</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-4 ml-auto">
            {!hideSearchAndIcons && (
              <>
                <Link className="text-customText-secondary hover:text-primary-main relative p-2 rounded-md hover:bg-orange-50 transition-colors" to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#F97316] px-1 text-[10px] font-extrabold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button className="text-customText-secondary hover:text-primary-main hidden sm:block p-2 rounded-md hover:bg-orange-50 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
              </>
            )}
            
            {!isCustomerProductPage && (
              <div className="hidden md:flex items-center space-x-2 ml-2 pl-4 border-l border-customBorder-light">
              {isAuthPage && (
                <Link to="/" className="px-4 py-2 rounded-md text-sm font-bold text-primary-dark hover:text-primary-main hover:bg-orange-50 transition-colors">
                  Home
                </Link>
              )}
              {(!isLoginPage || isForgotPasswordPage) && (
                <Link to="/login" className="px-4 py-2 rounded-md text-sm font-bold text-primary-dark hover:text-primary-main hover:bg-orange-50 transition-colors">
                  Sign In
                </Link>
              )}
              {(!isRegisterPage || isForgotPasswordPage) && (
                <Link to="/register" className="px-4 py-2 rounded-md text-sm font-bold text-primary-main bg-orange-50 hover:bg-orange-100 transition-colors">
                  Register
                </Link>
              )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
