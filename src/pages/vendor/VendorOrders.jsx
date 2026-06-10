import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VendorLayout from '../../components/vendor/VendorLayout';
import { 
  ShoppingCart, Clock, Package, CheckCircle, 
  Search, Filter, Calendar, ChevronDown, 
  MapPin, Box, ChevronLeft, ChevronRight, Eye, Trash2
} from 'lucide-react';
import { getVendorOrders, deleteVendorOrder } from '../../services/vendorApi';

const VendorOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId || 3;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [sortBy, setSortBy] = useState('Newest First');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVendorOrders(vendorId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [vendorId]);

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteVendorOrder(vendorId, orderId);
      fetchOrders();
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Failed to delete order. Please try again.');
    }
  };

  const pendingCount = orders.filter(o => ['Pending Approval', 'Pending'].includes(o.status || o.orderStatus)).length;
  const processingCount = orders.filter(o => ['Processing', 'Shipped'].includes(o.status || o.orderStatus)).length;
  const completedCount = orders.filter(o => ['Completed', 'Delivered'].includes(o.status || o.orderStatus)).length;

  const stats = [
    { title: 'Total Orders', value: orders.length.toString(), helper: 'All time', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-l-blue-600' },
    { title: 'Pending Approval', value: pendingCount.toString(), helper: 'Needs action', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-l-amber-600' },
    { title: 'Processing Orders', value: processingCount.toString(), helper: 'In logistics pipeline', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-l-indigo-600' },
    { title: 'Completed Orders', value: completedCount.toString(), helper: 'Successfully delivered', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-l-emerald-600' }
  ];

  const formatAmount = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const displayOrders = orders.map(o => ({
    id: o.id || o._id || 'N/A',
    date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Unknown'),
    time: o.time || (o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : ''),
    customer: o.customerName || o.customer || 'Unknown Customer',
    location: o.location || o.shippingAddress?.city || 'Unknown Location',
    items: o.itemsSummary || (Array.isArray(o.items) ? `${o.items.length} items` : 'Various Items'),
    total: o.amount ? o.amount : formatAmount(o.totalAmount || o.total || 0),
    status: o.status || o.orderStatus || 'Processing'
  }));



  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending Approval': return 'bg-amber-100 text-amber-700';
      case 'Processing': return 'bg-indigo-100 text-indigo-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <VendorLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Order Management</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Review, process, and track customer orders.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 border-l-4 ${stat.border}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">{stat.title}</span>
                </div>
                <div className="text-3xl font-extrabold text-[#0F172A]">
                  {stat.value}
                </div>
                {stat.helper && <p className="mt-2 text-xs font-semibold text-slate-500">{stat.helper}</p>}
              </div>
            );
          })}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Order ID / Customer" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select 
                className="w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Pending Approval</option>
                <option>Processing</option>
                <option>Completed</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option>All Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Sort By: Newest First</option>
                <option>Sort By: Oldest First</option>
                <option>Sort By: Highest Value</option>
                <option>Sort By: Lowest Value</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <p className="text-slate-500 font-medium">Loading orders...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={fetchOrders} className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && displayOrders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <p className="text-slate-500 font-medium">No orders found.</p>
            </div>
          )}

          {!loading && !error && displayOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Order Meta & Customer Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-[#1E3A8A] text-lg">{order.id}</span>
                      <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {order.date} • {order.time}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Details</p>
                      <h3 className="font-extrabold text-[#0F172A] text-base">{order.customer}</h3>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Items Summary</p>
                      <p className="text-sm font-semibold text-slate-700 flex items-start gap-1.5 line-clamp-2">
                        <Box className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> {order.items}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Values & Actions */}
                <div className="lg:w-64 shrink-0 flex flex-col justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="mb-3 text-center lg:text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Value</p>
                    <p className="text-3xl font-black text-[#1E3A8A]">{order.total}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {order.status === 'Pending Approval' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-md shadow-sm transition-colors active:scale-95">
                          Approve
                        </button>
                        <button className="px-3 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-extrabold rounded-md transition-colors active:scale-95">
                          Reject
                        </button>
                      </div>
                    ) : null}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 hover:border-[#1E3A8A] text-slate-700 hover:text-[#1E3A8A] text-sm font-extrabold rounded-md transition-colors">
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="px-3 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-md transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="font-extrabold text-slate-700">1</span> to <span className="font-extrabold text-slate-700">4</span> of <span className="font-extrabold text-slate-700">450</span> orders
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#F97316] text-white font-extrabold text-sm flex items-center justify-center">1</button>
            <button className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-extrabold text-sm hover:bg-slate-50 flex items-center justify-center transition-colors">2</button>
            <button className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-extrabold text-sm hover:bg-slate-50 flex items-center justify-center transition-colors">3</button>
            <span className="text-slate-400 font-bold px-1">...</span>
            <button className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-extrabold text-sm hover:bg-slate-50 flex items-center justify-center transition-colors">45</button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </VendorLayout>
  );
};

export default VendorOrders;
