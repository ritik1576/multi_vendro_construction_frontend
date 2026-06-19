import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VendorLayout from '../../components/vendor/VendorLayout';
import { 
  ShoppingCart, Clock, Package, CheckCircle, 
  Search, Filter, Calendar, ChevronDown, 
  MapPin, Box, ChevronLeft, ChevronRight, Eye, Trash2, X
} from 'lucide-react';
import { getVendorOrderDetails } from '../../services/vendorApi';
import { getVendorOrdersRequest, deleteVendorOrderRequest, updateVendorOrderStatusRequest } from '../../redux/vendorActions';
import toast from 'react-hot-toast';

const ALLOWED_ORDER_ACTIONS = {
  'pending approval': [
    { label: 'Approve', actionStatus: 'confirmed', style: 'bg-[#1E3A8A] hover:bg-[#172554] text-white' },
    { label: 'Reject', actionStatus: 'cancelled', style: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300' }
  ],
  'pending': [
    { label: 'Approve', actionStatus: 'confirmed', style: 'bg-[#1E3A8A] hover:bg-[#172554] text-white' },
    { label: 'Reject', actionStatus: 'cancelled', style: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300' }
  ],
  'confirmed': [
    { label: 'Mark Packed', actionStatus: 'packed', style: 'bg-[#1E3A8A] hover:bg-[#172554] text-white' },
    { label: 'Cancel', actionStatus: 'cancelled', style: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300' }
  ],
  'processing': [
    { label: 'Mark Packed', actionStatus: 'packed', style: 'bg-[#1E3A8A] hover:bg-[#172554] text-white' },
    { label: 'Cancel', actionStatus: 'cancelled', style: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300' }
  ],
  'packed': [
    { label: 'Mark Shipped', actionStatus: 'shipped', style: 'bg-[#1E3A8A] hover:bg-[#172554] text-white' },
    { label: 'Cancel', actionStatus: 'cancelled', style: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300' }
  ],
  'shipped': [
    { label: 'Out for Delivery', actionStatus: 'outfordelivery', style: 'bg-[#1E3A8A] hover:bg-[#172554] text-white' },
    { label: 'Mark Delivered', actionStatus: 'delivered', style: 'bg-[#EA580C] hover:bg-[#C2410C] text-white' },
    { label: 'Cancel', actionStatus: 'cancelled', style: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300' }
  ],
  'outfordelivery': [
    { label: 'Mark Delivered', actionStatus: 'delivered', style: 'bg-[#EA580C] hover:bg-[#C2410C] text-white' },
    { label: 'Cancel', actionStatus: 'cancelled', style: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300' }
  ]
};

const VendorOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId;

  const dispatch = useDispatch();
  const { orders = [], loading = {}, error } = useSelector((state) => state.vendor || {});
  const isOrdersLoading = loading.orders;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [sortBy, setSortBy] = useState('Newest First');

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchOrderDetails = async (id) => {
    try {
      setSelectedOrderId(id);
      setDetailsLoading(true);
      setOrderDetails(null);
      const data = await getVendorOrderDetails(vendorId, id);
      setOrderDetails(data);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      toast.error('Failed to load order details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDrawer = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
  };

  useEffect(() => {
    if (vendorId) {
      dispatch(getVendorOrdersRequest(vendorId));
    }
  }, [dispatch, vendorId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, sortBy]);

  const handleDelete = (orderId) => {
    toast((t) => (
      <div>
        <p className="mb-3 text-sm font-medium">Are you sure you want to delete this order?</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded">Cancel</button>
          <button onClick={() => {
            toast.dismiss(t.id);
            dispatch(deleteVendorOrderRequest(vendorId, orderId));
          }} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded">Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleUpdateStatus = (orderId, requestedStatus, currentStatus) => {
    if (loading.updateOrder === orderId) return; // Prevent double click
    
    const s = (currentStatus || '').toLowerCase();
    const allowed = ALLOWED_ORDER_ACTIONS[s] || [];
    
    const isValidTransition = allowed.some(action => action.actionStatus === requestedStatus);
    if (!isValidTransition) {
      toast.error('Invalid status transition requested');
      return;
    }
    
    dispatch(updateVendorOrderStatusRequest(vendorId, orderId, requestedStatus));
  };

  const pendingCount = orders.filter(o => ['Pending Approval', 'Pending'].includes(o.status || o.orderStatus)).length;
  const processingCount = orders.filter(o => ['Processing', 'Shipped'].includes(o.status || o.orderStatus)).length;
  const completedCount = orders.filter(o => ['Completed', 'Delivered'].includes(o.status || o.orderStatus)).length;

  const stats = [
    { title: 'Total Orders', value: orders.length.toString(), helper: 'All time', icon: ShoppingCart, iconBg: 'bg-slate-50', iconColor: 'text-[#0F172A]' },
    { title: 'Pending Approval', value: pendingCount.toString(), helper: 'Needs action', icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { title: 'Processing Orders', value: processingCount.toString(), helper: 'In logistics pipeline', icon: Package, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Completed Orders', value: completedCount.toString(), helper: 'Successfully delivered', icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' }
  ];

  const formatAmount = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const filteredOrders = orders.map(o => ({
    ...o,
    apiOrderId: o.id || o.orderId || o._id,
    displayId: o.orderNumber || o.displayOrderId || o.orderNo || o.orderId || o.id || o._id || '',
    date: o.placedAt ? new Date(o.placedAt).toLocaleDateString() : (o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '')),
    time: o.placedAt ? new Date(o.placedAt).toLocaleTimeString() : (o.time || (o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : '')),
    customer: o.customer?.fullName || o.customerName || o.customer || '',
    location: o.deliveryAddress?.city || o.deliveryAddress?.state || o.location || o.shippingAddress?.city || '',
    items: o.itemsSummary || (Array.isArray(o.items) ? `${o.items.length} items` : ''),
    total: formatAmount(o.totalAmount || o.amount || o.total || 0),
    status: o.orderStatus || o.status || o.displayStatus || ''
  })).filter(o => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = !s || o.displayId?.toLowerCase().includes(s) || o.customer?.toLowerCase().includes(s);
    const matchesStatus = statusFilter === 'All Status' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const displayOrders = filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);



  const getStatusBadge = (status) => {
    switch((status || '').toLowerCase()) {
      case 'pending approval':
      case 'pending': return 'bg-amber-50 text-amber-600';
      case 'processing': return 'bg-indigo-50 text-indigo-600';
      case 'shipped': return 'bg-blue-50 text-blue-600';
      case 'completed':
      case 'delivered': return 'bg-emerald-50 text-emerald-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
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
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-extrabold text-[#0F172A] leading-none mb-1">
                    {stat.value}
                  </h3>
                  {stat.helper && <p className="text-[11px] font-semibold text-slate-400">{stat.helper}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Order Number / Customer" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select 
                className="w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 cursor-pointer"
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
                className="w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 cursor-pointer"
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
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 cursor-pointer"
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
          {isOrdersLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm max-w-2xl mx-auto mt-8">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-50 mb-5">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E3A8A] border-r-transparent"></div>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Loading orders</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Please wait while we fetch your orders...
              </p>
            </div>
          )}

          {!isOrdersLoading && error && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm max-w-2xl mx-auto mt-8">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600 mb-5">
                <Package className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Unable to load orders</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                {error}
              </p>
              <button 
                onClick={() => dispatch(getVendorOrdersRequest(vendorId, true))}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E3A8A] px-5 text-sm font-extrabold text-white hover:bg-[#172554]"
              >
                Retry
              </button>
            </div>
          )}

          {!isOrdersLoading && !error && displayOrders.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm max-w-2xl mx-auto mt-8">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-[#F97316] mb-5">
                <Package className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">No orders found</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                You do not have any orders matching the current filters.
              </p>
            </div>
          )}

          {!isOrdersLoading && !error && displayOrders.map((order, idx) => (
            <div key={order.apiOrderId || idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col gap-5">
              
              {/* Top Row: Order Number, Date, Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  {order.displayId && <span className="font-mono font-extrabold text-[#0F172A] text-[15px]">#{order.displayId}</span>}
                  {(order.date || order.time) && (
                    <span className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> {order.date} {order.time ? `• ${order.time}` : ''}
                    </span>
                  )}
                </div>
                {order.status && (
                  <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                )}
              </div>

              {/* Middle Row: Customer, Items, Total */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Customer Details</p>
                  {order.customer && <h3 className="font-extrabold text-[#0F172A] text-[15px]">{order.customer}</h3>}
                  {order.location && (
                    <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.location}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Items Summary</p>
                  {order.items && (
                    <p className="text-[13px] font-bold text-[#0F172A] flex items-start gap-1.5 line-clamp-2 mt-1">
                      <Box className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" /> {order.items}
                    </p>
                  )}
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center sm:items-end sm:text-right">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Total Value</p>
                  <p className="text-2xl font-extrabold text-[#1E3A8A] leading-none">{order.total}</p>
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {(() => {
                  const s = (order.status || '').toLowerCase();
                  const isUpdating = loading.updateOrder === order.apiOrderId;
                  const availableActions = ALLOWED_ORDER_ACTIONS[s] || [];

                  return availableActions.map((action, idx) => (
                    <button
                      key={idx}
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order.apiOrderId, action.actionStatus, s)}
                      className={`px-5 py-2.5 text-[13px] font-extrabold rounded-lg shadow-sm transition-colors active:scale-95 disabled:opacity-50 ${action.style}`}
                    >
                      {action.label}
                    </button>
                  ));
                })()}
                <button 
                  onClick={() => fetchOrderDetails(order.apiOrderId)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 bg-white hover:border-[#1E3A8A] text-slate-700 hover:text-[#1E3A8A] text-[13px] font-extrabold rounded-lg shadow-sm transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  View Details
                </button>
                <button 
                  onClick={() => handleDelete(order.apiOrderId)}
                  className="p-2.5 border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-colors"
                  title="Delete Order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="font-extrabold text-slate-700">{filteredOrders.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to <span className="font-extrabold text-slate-700">{Math.min(currentPage * rowsPerPage, filteredOrders.length)}</span> of <span className="font-extrabold text-slate-700">{filteredOrders.length}</span> orders
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-extrabold text-sm flex items-center justify-center transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-[#F97316] text-white' 
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Order Details Drawer Overlay */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity" onClick={closeDrawer}>
          <div 
            className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-extrabold text-[#0F172A]">Order Details</h2>
              <button onClick={closeDrawer} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {detailsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-slate-500 font-medium">Loading details...</p>
                </div>
              ) : orderDetails ? (
                <div className="space-y-8">
                  {/* General Info */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">General Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Order Number</p>
                        <p className="font-extrabold text-[#0F172A]">{orderDetails.orderNumber || orderDetails.order_number || orderDetails.orderNo || orderDetails.orderId || orderDetails.id || orderDetails._id || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Placed At</p>
                        <p className="font-extrabold text-[#0F172A]">{orderDetails.placedAt ? new Date(orderDetails.placedAt).toLocaleString() : (orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : 'Unknown')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                        <p className="font-extrabold text-[#0F172A] uppercase">{orderDetails.orderStatus || orderDetails.status || 'Processing'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Payment Status</p>
                        <p className="font-extrabold text-[#0F172A] uppercase">{orderDetails.paymentStatus || 'Pending'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Customer Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Name</p>
                        <p className="font-extrabold text-[#0F172A]">{orderDetails.customer?.fullName || orderDetails.customerName || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Email</p>
                          <p className="font-extrabold text-[#0F172A] break-all">{orderDetails.customer?.email || orderDetails.customerEmail || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Phone</p>
                          <p className="font-extrabold text-[#0F172A]">{orderDetails.customer?.phone || orderDetails.deliveryAddress?.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Delivery Address</h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="text-sm font-semibold text-slate-700 leading-relaxed">
                        {orderDetails.deliveryAddress ? (
                          <>
                            {orderDetails.deliveryAddress.fullName && <div className="font-extrabold text-[#0F172A] mb-1">{orderDetails.deliveryAddress.fullName}</div>}
                            {orderDetails.deliveryAddress.addressLine1 && <>{orderDetails.deliveryAddress.addressLine1}<br /></>}
                            {orderDetails.deliveryAddress.addressLine2 && <>{orderDetails.deliveryAddress.addressLine2}<br /></>}
                            {orderDetails.deliveryAddress.street && !orderDetails.deliveryAddress.addressLine1 && <>{orderDetails.deliveryAddress.street}<br /></>}
                            {orderDetails.deliveryAddress.city && <>{orderDetails.deliveryAddress.city}, </>}
                            {orderDetails.deliveryAddress.state && <>{orderDetails.deliveryAddress.state} </>}
                            {orderDetails.deliveryAddress.postalCode && <>{orderDetails.deliveryAddress.postalCode}<br /></>}
                            {orderDetails.deliveryAddress.zipCode && !orderDetails.deliveryAddress.postalCode && <>{orderDetails.deliveryAddress.zipCode}<br /></>}
                            {orderDetails.deliveryAddress.country && <>{orderDetails.deliveryAddress.country}</>}
                          </>
                        ) : orderDetails.shippingAddress ? (
                          <>
                            {orderDetails.shippingAddress.address && <>{orderDetails.shippingAddress.address}<br /></>}
                            {orderDetails.shippingAddress.city && <>{orderDetails.shippingAddress.city}, </>}
                            {orderDetails.shippingAddress.state && <>{orderDetails.shippingAddress.state} </>}
                            {orderDetails.shippingAddress.zipCode && <>{orderDetails.shippingAddress.zipCode}<br /></>}
                            {orderDetails.shippingAddress.country && <>{orderDetails.shippingAddress.country}</>}
                          </>
                        ) : (
                          'Address not available'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Order Items</h3>
                    <div className="space-y-4">
                      {orderDetails.items && orderDetails.items.length > 0 ? (
                        orderDetails.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                            <div className="flex-1 mr-4">
                              <p className="font-extrabold text-[#0F172A] text-sm mb-1">{item.product?.name || item.name || 'Unknown Product'}</p>
                              <p className="text-xs font-medium text-slate-500">
                                SKU: {item.product?.sku || item.sku || 'N/A'}
                                {item.product?.categoryName ? ` • Category: ${item.product.categoryName}` : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-extrabold text-[#1E3A8A] text-sm">{formatAmount(item.unitPrice || item.price || 0)}</p>
                              <p className="text-xs font-medium text-slate-500 mt-1">Qty: {item.quantity || 1}</p>
                              <p className="text-xs font-bold text-[#F97316] mt-1">Total: {formatAmount(item.totalPrice || ((item.unitPrice || item.price || 0) * (item.quantity || 1)))}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No items found.</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Payment Summary</h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                        <span>Subtotal</span>
                        <span>{formatAmount(orderDetails.subtotal || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                        <span>Shipping Charge</span>
                        <span>{formatAmount(orderDetails.shippingCharge || orderDetails.shippingFee || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                        <span>Discount</span>
                        <span className="text-emerald-600">-{formatAmount(orderDetails.discountAmount || orderDetails.discount || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-3">
                        <span className="font-extrabold text-[#0F172A]">Total Amount</span>
                        <span className="text-xl font-black text-[#1E3A8A]">{formatAmount(orderDetails.totalAmount || orderDetails.amount || orderDetails.total || 0)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-red-500 font-medium">Failed to load details.</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              {(() => {
                  const s = (orderDetails?.orderStatus || orderDetails?.status || orderDetails?.displayStatus || '').toLowerCase();
                  const currentApiOrderId = orderDetails?.id || orderDetails?.orderId || orderDetails?._id;
                  const isUpdating = loading.updateOrder === currentApiOrderId;
                  const availableActions = ALLOWED_ORDER_ACTIONS[s] || [];

                  return availableActions.map((action, idx) => (
                    <button
                      key={idx}
                      disabled={isUpdating}
                      onClick={() => {
                        handleUpdateStatus(currentApiOrderId, action.actionStatus, s);
                        closeDrawer();
                      }}
                      className={`flex-1 py-2.5 text-[13px] font-extrabold rounded-lg shadow-sm transition-colors active:scale-95 disabled:opacity-50 ${action.style}`}
                    >
                      {action.label}
                    </button>
                  ));
              })()}
              <button 
                onClick={closeDrawer}
                className="flex-1 py-2.5 bg-white border border-slate-200 hover:border-[#1E3A8A] text-slate-700 hover:text-[#1E3A8A] text-[13px] font-extrabold rounded-lg shadow-sm transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </VendorLayout>
  );
};

export default VendorOrders;
