import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsersRequest } from '../../redux/adminActions';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, UserCheck, UserX, UserPlus, Search, ChevronDown, 
  ArrowUpRight, Mail, Phone, MapPin, Package, Clock, 
  AlertCircle, ShieldAlert, X, ShieldBan, ShieldCheck, Link as LinkIcon, Loader2
} from 'lucide-react';

const AdminUserManagement = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);
  const dispatch = useDispatch();
  const { users, loading: isLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminUsersRequest());
  }, [dispatch]);

  // KPIs
  const kpis = [
    { title: 'Total Customers', value: users.length.toString(), icon: Users, isNegative: false },
    { title: 'Suspended Customers', value: users.filter(u => u.status === 'Suspended').length.toString(), icon: UserX, isNegative: true },
    { title: 'New Registrations Today', value: '0', icon: UserPlus, isNegative: false },
  ];

  // Helper to generate a background color based on name for the avatar
  const getAvatarColor = (name) => {
    const colors = [
      'bg-[#1E3A8A]/10 text-[#1E3A8A]',
      'bg-emerald-100 text-emerald-700',
      'bg-purple-100 text-purple-700',
      'bg-[#C2410C]/10 text-[#C2410C]',
      'bg-rose-100 text-rose-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatusBadge = (status) => {
    if (status === 'Suspended') {
      return <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-extrabold bg-red-100 text-red-700 uppercase tracking-wider">Suspended</span>;
    }
    return null;
  };

  // Filtering Logic
  const filteredUsers = users.filter(user => {
    if (activeFilter === 'Active' && Number(user.orders || 0) <= 0) return false;
    if (activeFilter === 'Suspended' && user.status !== 'Suspended') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.id.toString().includes(query)
      );
    }
    return true;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Customer Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage customers, monitor activity, resolve complaints, and control account access.</p>
        </div>

        {/* Section 1: Customer Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${kpi.isNegative ? 'bg-red-50 text-red-500' : 'bg-[#1E3A8A]/10 text-[#1E3A8A]'}`}>
                    <kpi.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">{kpi.title}</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Search, Filter & Sort Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search Customer Name, Email, Phone, Customer ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors"
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg">
                {['All', 'Active', 'Suspended'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 text-xs font-extrabold rounded-md transition-all whitespace-nowrap ${
                      activeFilter === filter 
                        ? 'bg-[#C2410C] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Customer Directory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <Users className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-extrabold text-slate-700">Customer Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-1/4">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-1/4">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center w-1/6">Orders</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-1/6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 mb-3 animate-spin text-[#C2410C]" />
                        <span className="text-sm font-bold">Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-red-400">
                        <AlertCircle className="w-8 h-8 mb-3 text-red-500" />
                        <span className="text-sm font-bold">{error}</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <span className="text-sm font-bold">No customers found matching your criteria.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="font-extrabold text-slate-900 text-sm">{user.full_name}</div>
                          <div className="text-[11px] font-bold text-slate-400 mt-0.5">{user.id}</div>
                          <div className="mt-1.5">
                            {getStatusBadge(user.status)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="text-sm font-medium text-slate-700">{user.email}</div>
                        <div className="text-xs font-medium text-slate-500">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-extrabold text-slate-900">{user.orders}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/admin/customers/${user.id}`}
                          state={{ user }}
                          className="px-3 py-1.5 text-[#C2410C] hover:bg-orange-50 text-[10px] font-extrabold uppercase tracking-wider rounded transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500">
              Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              
              {getPageNumbers().map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`dots-${idx}`} className="text-slate-400 text-xs px-1">...</span>
                ) : (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-colors ${currentPage === pageNum ? 'bg-[#C2410C] text-white shadow-sm font-extrabold' : 'hover:bg-slate-200 text-slate-600 font-bold'}`}
                  >
                    {pageNum}
                  </button>
                )
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-[#C2410C] disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
};

export default AdminUserManagement;
