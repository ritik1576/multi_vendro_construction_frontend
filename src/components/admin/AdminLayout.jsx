import { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, Package, 
  ShoppingCart, BarChart3, Settings, Menu, X, MessageSquare 
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', path: '/admin/vendors', icon: UserCheck },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
];

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">
      <div className="sticky top-0 z-50">
        <AdminNavbar />
      </div>

      <div className="flex flex-1">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button 
            onClick={toggleSidebar}
            className="grid h-14 w-14 place-items-center rounded-full bg-[#1E3A8A] text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-[#1E3A8A]/30 transition-transform active:scale-95"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden transition-opacity"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 top-[64px] z-40 w-[260px] transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto px-3 py-6">
            <nav className="space-y-1.5">
              {sidebarItems.map((item) => {
                const isActive = item.path === '/admin/dashboard' 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                  
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm transition-all border-l-4 ${
                      isActive 
                        ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A] font-extrabold' 
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#1E3A8A] font-bold'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-[#1E3A8A]' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
