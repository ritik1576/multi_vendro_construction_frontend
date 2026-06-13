import { Search, ShoppingCart, Bell, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authActions';
import SearchDropdown from '../customer/catalog/SearchDropdown';

const Navbar = ({ searchTerm, onSearchChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.cart?.cart || []);
  const cartItems = Array.isArray(cartState) ? cartState : (cartState?.items || []);
  const cartCount = cartItems.length;
  const isLandingPage = location.pathname === '/'; // Restore original landing page check for Navbar
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

  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-customBorder-light sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-1">
            <Link to="/" className="text-[28px] font-bold tracking-tight flex items-center">
              <span className="text-primary-dark">Infra</span>
              <span className="text-secondary-main">Mart</span>
              <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-secondary-main ml-1">
                <path d="M12 2L22 22L12 17L2 22Z" />
              </svg>
            </Link>
          </div>

          {/* Search Bar */}


          {!hideSearchAndIcons && !isProductsPage && (
            <div className="hidden md:flex flex-1 max-w-md mx-5 relative z-[100]">
              <SearchDropdown 
                searchTerm={searchTerm} 
                onSearchChange={onSearchChange} 
                placeholder="Search 10,000+ construction products..."
              />
            </div>
          )}



          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-4 ml-auto">
            {!hideSearchAndIcons && (
              <>
                <Link className="text-customText-secondary hover:text-primary-main relative p-2 rounded-md hover:bg-orange-50 transition-colors" to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#F97316] px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button className="text-customText-secondary hover:text-primary-main hidden sm:block p-2 rounded-md hover:bg-orange-50 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
              </>
            )}
            
            <div className="hidden md:flex items-center space-x-2 ml-2 pl-4 border-l border-customBorder-light">
              {isLandingPage ? (
                <>
                  <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-primary-dark hover:text-primary-main hover:bg-orange-50 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium text-primary-main bg-orange-50 hover:bg-orange-100 transition-colors">
                    Register
                  </Link>
                </>
              ) : isAuthenticated ? (
                <>
                  <span className="text-sm font-medium text-slate-700 mr-2">
                    Hi, {user?.name || user?.firstName || 'User'}
                  </span>
                  <Link 
                    to="/orders"
                    className="px-4 py-2 rounded-md text-sm font-medium text-primary-dark hover:text-primary-main hover:bg-orange-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {isAuthPage && (
                    <Link to="/" className="px-4 py-2 rounded-md text-sm font-medium text-primary-dark hover:text-primary-main hover:bg-orange-50 transition-colors">
                      Home
                    </Link>
                  )}
                  {(!isLoginPage || isForgotPasswordPage) && (
                    <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-primary-dark hover:text-primary-main hover:bg-orange-50 transition-colors">
                      Sign In
                    </Link>
                  )}
                  {(!isRegisterPage || isForgotPasswordPage) && (
                    <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium text-primary-main bg-orange-50 hover:bg-orange-100 transition-colors">
                      Register
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
