import { Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authActions';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-1">
            <Link to="/admin/dashboard" className="text-[28px] font-extrabold tracking-tight flex items-center">
              <span className="text-primary-dark">Infra</span>
              <span className="text-secondary-main">Mart</span>
              <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-secondary-main ml-1">
                <path d="M12 2L22 22L12 17L2 22Z" />
              </svg>
              <span className="ml-2 rounded-md bg-[#1E3A8A]/10 px-2 py-0.5 text-xs font-bold text-[#1E3A8A]">Admin</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-4 ml-auto">
            <button className="text-slate-500 hover:text-[#1E3A8A] p-2 rounded-md hover:bg-slate-50 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
              </span>
            </button>
            
            <div className="hidden md:flex items-center space-x-2 ml-2 pl-4 border-l border-slate-200">
              <span className="text-sm font-bold text-slate-700 mr-2">
                Hi, {user?.name || user?.firstName || 'Admin'}
              </span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
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

export default AdminNavbar;
