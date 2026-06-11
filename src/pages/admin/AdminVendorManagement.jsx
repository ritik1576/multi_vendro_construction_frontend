import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminVendorsRequest } from '../../redux/adminActions';
import { Link, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, Hourglass, Search, ChevronDown, 
  ArrowUpRight, Mail, Phone, FileText, Loader2, AlertCircle
} from 'lucide-react';

const AdminVendorManagement = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(location.state?.filter || 'All Vendors');
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const { vendors, vendorsLoading: isLoading, vendorsError: error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminVendorsRequest());
  }, [dispatch]);

  // KPIs
  const kpis = [
    { title: 'Total Vendors', value: vendors.length.toString(), icon: Users, isPending: false },
    { title: 'Pending Approval', value: vendors.filter(v => v.approval_status === 'Pending Approval').length.toString(), icon: Hourglass, isPending: true },
  ];

  // Helper to generate a background color based on name for the avatar
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-emerald-100 text-emerald-700',
      'bg-purple-100 text-purple-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredAndSortedVendors = vendors
    .filter(vendor => {
      // 1. Filter by Active Filter
      if (activeFilter === 'Pending' && vendor.approval_status !== 'Pending Approval') return false;
      if (activeFilter === 'Approved' && vendor.approval_status !== 'Approved' && vendor.approval_status !== 'Verified') return false;
      
      // 2. Filter by Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          vendor.business_name.toLowerCase().includes(query) ||
          vendor.business_email.toLowerCase().includes(query) ||
          vendor.gst_number.toLowerCase().includes(query) ||
          vendor.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
      return true;
    });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage, review, verify, and monitor marketplace vendors.</p>
        </div>

        {/* Section 1: Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">{kpi.title}</span>
                <div className={`p-1.5 rounded-lg ${kpi.isPending ? 'bg-amber-50 text-amber-500' : 'bg-[#1E3A8A]/10 text-[#1E3A8A]'}`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
                {kpi.growth ? (
                  <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> {kpi.growth} <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">this month</span>
                  </div>
                ) : (
                  <div className="mt-2 text-xs font-bold text-slate-500">
                    {kpi.text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Management Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search vendor name, email, GST..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors"
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg">
                {['All Vendors', 'Pending', 'Approved'].map(filter => (
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

        {/* Section 3: Vendor Directory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider w-1/3">Vendor Info</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider w-1/4">Contact</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider w-1/5">GST Number</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 mb-3 animate-spin text-[#C2410C]" />
                        <span className="text-sm font-bold">Loading vendors...</span>
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
                ) : filteredAndSortedVendors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <span className="text-sm font-bold">No vendors found matching your criteria.</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSortedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm group-hover:text-[#1E3A8A] transition-colors">
                            {vendor.business_name}
                          </div>
                          <div className="text-xs font-bold text-slate-500 mt-0.5">
                            {vendor.name} • {vendor.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1.5">
                      <div className="flex items-center text-sm font-bold text-slate-700">
                        <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" /> {vendor.business_email}
                      </div>
                      <div className="flex items-center text-xs font-bold text-slate-500">
                        <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> {vendor.business_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-600 tracking-wide">
                        <FileText className="w-3 h-3 mr-1.5 text-slate-400" /> {vendor.gst_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {vendor.approval_status === 'Pending Approval' ? (
                          <Link 
                            to={`/admin/vendors/${vendor.id}`} 
                            state={{ vendor }}
                            className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#EA580C] text-white text-[10px] font-extrabold uppercase tracking-wider rounded transition-colors shadow-sm"
                          >
                            Review
                          </Link>
                        ) : (
                          <Link 
                            to={`/admin/vendors/${vendor.id}`}
                            state={{ vendor }}
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 hover:border-blue-200 text-[10px] font-extrabold uppercase tracking-wider rounded transition-colors"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500">Showing {filteredAndSortedVendors.length} entries</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>Prev</button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-[#C2410C] text-white text-xs font-extrabold shadow-sm">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors">3</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-[#C2410C]">Next</button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminVendorManagement;
