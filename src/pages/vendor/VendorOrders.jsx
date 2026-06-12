import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VendorLayout from '../../components/vendor/VendorLayout';
import { 
  ShoppingCart, Clock, Package, CheckCircle, 
  Search, Filter, Calendar, ChevronDown, 
  MapPin, Box, ChevronLeft, ChevronRight, Eye, Trash2, X
} from 'lucide-react';
import { getVendorOrders, deleteVendorOrder, updateOrderStatus, getVendorOrderDetails } from '../../services/vendorApi';

const VendorOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      alert('Failed to load order details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDrawer = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
  };

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, sortBy]);

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

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(vendorId, orderId, status);
      fetchOrders();
      alert(`Order successfully marked as ${status}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status. Please try again.');
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

  const filteredOrders = orders.map(o => ({
    id: o.orderId,
    displayId: o.orderNumber,
    date: o.placedAt ? new Date(o.placedAt).toLocaleDateString() : (o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Unknown')),
    time: o.placedAt ? new Date(o.placedAt).toLocaleTimeString() : (o.time || (o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : '')),
    customer: o.customer?.fullName || o.customerName || o.customer || 'Unknown Customer',
    location: o.deliveryAddress?.city || o.deliveryAddress?.state || o.location || o.shippingAddress?.city || 'Unknown Location',
    items: o.itemsSummary || (Array.isArray(o.items) ? `${o.items.length} items` : 'Various Items'),
    total: formatAmount(o.totalAmount || o.amount || o.total || 0),
    status: o.orderStatus || o.status || 'Processing'
  })).filter(o => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = !s || o.displayId?.toLowerCase().includes(s) || o.customer?.toLowerCase().includes(s);
    const matchesStatus = statusFilter === 'All Status' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const displayOrders = filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);



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
                placeholder="Search Order Number / Customer" 
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

          {!loading && !error && displayOrders.map((order, idx) => (
            <div key={order.id || idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
              
              {/* Top Row: Order Number, Date, Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono font-extrabold text-[#1E3A8A] text-lg">#{order.displayId}</span>
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {order.date} {order.time ? `• ${order.time}` : ''}
                  </span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Middle Row: Customer, Items, Total */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer Details</p>
                  <h3 className="font-extrabold text-[#0F172A] text-base">{order.customer}</h3>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Items Summary</p>
                  <p className="text-sm font-semibold text-slate-700 flex items-start gap-1.5 line-clamp-2 mt-1">
                    <Box className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> {order.items}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center items-end text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Value</p>
                  <p className="text-2xl font-black text-[#1E3A8A]">{order.total}</p>
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                {(() => {
                  const s = (order.status || '').toLowerCase();
                  if (s === 'pending approval' || s === 'pending') {
                    return (
                      <>
                        <button onClick={() => handleUpdateStatus(order.id, 'confirmed')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-md shadow-sm transition-colors active:scale-95">Approve</button>
                        <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="px-4 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm font-extrabold rounded-md transition-colors active:scale-95">Reject</button>
                      </>
                    );
                  }
                  if (s === 'confirmed' || s === 'processing') {
                    return (
                      <button onClick={() => handleUpdateStatus(order.id, 'shipped')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-md shadow-sm transition-colors active:scale-95">Mark Shipped</button>
                    );
                  }
                  if (s === 'shipped') {
                    return (
                      <button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-md shadow-sm transition-colors active:scale-95">Mark Delivered</button>
                    );
                  }
                  return null;
                })()}
                <button 
                  onClick={() => fetchOrderDetails(order.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 hover:border-[#1E3A8A] text-slate-700 hover:text-[#1E3A8A] text-sm font-extrabold rounded-md transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
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
                  const s = (orderDetails?.orderStatus || orderDetails?.status || '').toLowerCase();
                  if (s === 'pending approval' || s === 'pending') {
                    return (
                      <>
                        <button onClick={() => { handleUpdateStatus(orderDetails.orderId || orderDetails.id, 'confirmed'); closeDrawer(); }} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors active:scale-95">Approve</button>
                        <button onClick={() => { handleUpdateStatus(orderDetails.orderId || orderDetails.id, 'cancelled'); closeDrawer(); }} className="flex-1 py-2.5 border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-extrabold rounded-lg transition-colors active:scale-95">Reject</button>
                      </>
                    );
                  }
                  if (s === 'confirmed' || s === 'processing') {
                    return (
                      <button onClick={() => { handleUpdateStatus(orderDetails.orderId || orderDetails.id, 'shipped'); closeDrawer(); }} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors active:scale-95">Mark Shipped</button>
                    );
                  }
                  if (s === 'shipped') {
                    return (
                      <button onClick={() => { handleUpdateStatus(orderDetails.orderId || orderDetails.id, 'delivered'); closeDrawer(); }} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors active:scale-95">Mark Delivered</button>
                    );
                  }
                  return null;
              })()}
              <button 
                onClick={closeDrawer}
                className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-extrabold rounded-lg shadow-sm transition-colors"
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
