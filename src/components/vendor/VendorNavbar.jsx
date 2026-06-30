import { Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authActions';
import { NotificationDropdown } from '../../features/notifications/components/NotificationDropdown';
const VendorNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
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
            <NotificationDropdown role="vendor" />
            
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
