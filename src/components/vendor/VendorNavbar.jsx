import { Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authActions';
const VendorNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-1">
            <Link to="/vendor/dashboard" className="text-[28px] font-bold tracking-tight flex items-center">
              <span className="text-[#0F172A]">Infra</span>
              <span className="text-[#F97316]">Mart</span>
              <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#F97316] ml-1">
                <path d="M12 2L22 22L12 17L2 22Z" />
              </svg>
              <span className="ml-3 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Vendor</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-auto">
            <button className="text-slate-500 hover:text-[#1E3A8A] p-2 rounded-md hover:bg-blue-50 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
              </span>
            </button>
            
            <div className="hidden md:flex items-center space-x-4 ml-2 pl-4 border-l border-slate-200">
              <span className="text-[13px] font-extrabold text-[#0F172A]">
                Hi, {user?.businessName || user?.shopName || user?.fullName || 'Vendor'}
              </span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-[13px] font-extrabold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default VendorNavbar;
