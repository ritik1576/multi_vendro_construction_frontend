import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Search, Package, Clock, Truck, Ban, X, ArrowUpRight, CheckCircle2,
  Building2, Mail, Phone, FileText, MapPin, CreditCard, Loader2
} from 'lucide-react';
import { fetchAdminOrdersRequest } from '../../redux/adminActions';
import { useReviews } from '../../features/reviews/hooks/useReviews';
import { RatingStars } from '../../features/reviews/components/RatingStars';

// --- Helper Component for Ordered Items with Review ---
const AdminOrderItemWithReview = ({ item, order }) => {
  const pId = item?.productId || item?.product_id || item?.product?.id || item?.id || '1';
  const { reviews, isLoading } = useReviews({ productId: pId });
  
  const oId = order?.id || order?._id || order?.orderId;
  const review = reviews?.find(r => r.orderId === oId || r.productId === pId); // simplified matching
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0">
          <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror=null; e.target.src='https://placehold.co/150x150/e2e8f0/94a3b8?text=Item'; }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">{item.name}</h4>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">SKU: {item.sku}</span>
        </div>
        <div className="text-right shrink-0">
          <span className="block text-xs font-bold text-slate-500">${item.price?.toFixed(2)} × {item.qty}</span>
          <span className="block text-sm font-extrabold text-slate-900 mt-1">${(item.price * item.qty)?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      </div>
      
      {/* Review Block */}
      <div className="ml-16 bg-slate-50 rounded border border-slate-100 p-3">
        <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Customer Review</h5>
        {isLoading ? (
          <div className="animate-pulse h-4 bg-slate-200 rounded w-1/3"></div>
        ) : review ? (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-[11px] font-bold text-slate-600">{review.customerName || review.userName || 'Customer'}</span>
              <span className="text-[10px] font-medium text-slate-400">&bull; {new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <p className="text-xs font-medium text-slate-700 italic">"{review.review || review.comment}"</p>
          </div>
        ) : (
          <p className="text-xs font-bold text-slate-500 italic">No review submitted</p>
        )}
      </div>
    </div>
  );
};

// --- MOCK DATA ---
const mockOrders = [
  {
    id: '99382',
    date: 'Oct 24, 2023 at 08:30 PST',
    customerName: 'Acme Corp Ltd.',
    customerEmail: 'procurement@acme.co',
    customerPhone: '+1 (555) 123-4567',
    vendorName: 'SteelTech Heavy Industries',
    vendorId: 'VND-1042',
    status: 'Pending',
    items: [
      { id: 1, name: 'Industrial Steel Beams - 20ft', sku: 'ST-BEAM-20', price: 450, qty: 10, thumbnail: 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Steel+Beams' },
      { id: 2, name: 'High-Tensile Bolts (Pack of 100)', sku: 'HT-BOLT-100', price: 45, qty: 5, thumbnail: 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Bolts' }
    ],
    freight: 450.00,
    tax: 310.50,
    total: 5485.50
  },
  {
    id: '99381',
    date: 'Oct 23, 2023 at 09:15 PST',
    customerName: 'BuildIt Municipal',
    customerEmail: 'cityworks@buildit.gov',
    customerPhone: '+1 (555) 019-2834',
    vendorName: 'Cement Logistics Pro',
    vendorId: 'VND-8821',
    status: 'Processing',
    items: [
      { id: 1, name: 'Industrial Portland Cement Type I/II', sku: 'CEM-T12-BULK', price: 145, qty: 200, thumbnail: 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Cement' },
      { id: 2, name: 'Reinforced Steel Rebar - #4', sku: 'REB-004-60GR', price: 6.50, qty: 2000, thumbnail: 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Rebar' }
    ],
    freight: 1200.00,
    tax: 2000.50,
    total: 45200.50
  },
  {
    id: '99380',
    date: 'Oct 22, 2023 at 14:20 PST',
    customerName: 'Nova Construct',
    customerEmail: 'billing@nova.io',
    customerPhone: '+1 (555) 998-7765',
    vendorName: 'ElectroMach Global',
    vendorId: 'VND-5531',
    status: 'Delivered',
    items: [
      { id: 1, name: 'Heavy Duty Copper Wiring - 1000m', sku: 'WIR-COP-HD', price: 1200, qty: 5, thumbnail: 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Copper' }
    ],
    freight: 200.00,
    tax: 420.00,
    total: 6620.00
  },
  {
    id: '99379',
    date: 'Oct 21, 2023 at 11:05 PST',
    customerName: 'Apex Infrastructure',
    customerEmail: 'orders@apexinfra.com',
    customerPhone: '+1 (555) 332-1100',
    vendorName: 'Valley Woods Timber',
    vendorId: 'VND-2211',
    status: 'Cancelled',
    items: [
      { id: 1, name: 'Treated Pine Planks - 2x4', sku: 'TMP-PN-2X4', price: 12, qty: 500, thumbnail: 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Timber' }
    ],
    freight: 800.00,
    tax: 420.00,
    total: 7220.00
  }
];

const AdminOrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders = [], ordersLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminOrdersRequest());
  }, [dispatch]);

  // State
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Drawer & Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle closing drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300); // Wait for transition
  };

  // Filter Logic
  const filteredOrders = orders.filter(o => {
    if (activeFilter !== 'All' && o.status !== activeFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!o.id.toString().toLowerCase().includes(q) && 
          !o.customerName.toLowerCase().includes(q) && 
          !o.vendorName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  // KPIs
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const processingCount = orders.filter(o => o.status === 'Processing').length;

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    if (status === 'Delivered') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 uppercase tracking-wider border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
    if (status === 'Pending') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wider border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
    if (status === 'Processing') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#1E3A8A]/10 text-[#1E3A8A] uppercase tracking-wider border border-[#1E3A8A]/20"><Package className="w-3 h-3" /> Processing</span>;
    if (status === 'Cancelled') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 uppercase tracking-wider border border-red-200"><Ban className="w-3 h-3" /> Cancelled</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase tracking-wider">{status}</span>;
  };

  // Timeline Component
  const OrderTimeline = ({ currentStatus, date }) => {
    const steps = [
      { status: 'Pending', label: 'Order Placed & Pending', desc: date },
      { status: 'Processing', label: 'Processing at Vendor Facility', desc: 'Vendor is preparing the items.' },
      { status: 'Delivered', label: 'Delivered', desc: 'Order completed successfully.' }
    ];

    let currentStepIndex = steps.findIndex(s => s.status === currentStatus);
    if (currentStatus === 'Cancelled') currentStepIndex = -1; // Cancelled breaks the flow

    return (
      <div className="space-y-4">
        {currentStatus === 'Cancelled' ? (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-50"></div>
            </div>
            <div className="-mt-1.5 pb-4">
              <h4 className="text-sm font-extrabold text-red-600">Order Cancelled</h4>
              <p className="text-xs font-medium text-slate-500 mt-1">This order was cancelled and will not be processed.</p>
            </div>
          </div>
        ) : (
          steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={idx} className="flex gap-4 relative">
                {/* Vertical Line */}
                {idx !== steps.length - 1 && (
                  <div className={`absolute top-3 left-1.5 w-0.5 h-full -ml-px ${isCompleted ? 'bg-[#C2410C]' : 'bg-slate-200'}`}></div>
                )}
                
                {/* Dot */}
                <div className="flex flex-col items-center z-10">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    isCurrent ? 'bg-[#C2410C] ring-4 ring-[#C2410C]/20' : 
                    isCompleted ? 'bg-[#C2410C]' : 'bg-slate-200 ring-4 ring-white'
                  }`}></div>
                </div>

                {/* Content */}
                <div className="pb-6">
                  <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-[#C2410C]' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label} {isCurrent && '(Current)'}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">{step.desc}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10 relative">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Order Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor marketplace orders and track order statuses.</p>
        </div>

        {/* Section 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Total Orders</span>
              <div className="p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{totalOrdersCount}</div>
              <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 8.2% <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">this month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Pending Orders</span>
              <div className="p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{pendingCount}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Needs action
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Processing Orders</span>
              <div className="p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{processingCount}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Stable volume
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Search & Filter Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search Order ID, Customer, Vendor..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
                {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                    className={`px-4 py-1.5 text-[11px] font-extrabold rounded-md transition-all whitespace-nowrap ${
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

        {/* Section 3: Orders Directory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordersLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2410C]"></div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-500">No orders found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); }}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <span className="block text-sm font-extrabold text-slate-900 group-hover:text-[#C2410C] transition-colors">#ORD-{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-sm font-extrabold text-slate-900">{order.customerName}</span>
                        <a href={`mailto:${order.customerEmail}`} onClick={(e) => e.stopPropagation()} className="block text-[11px] font-bold text-[#1E3A8A] hover:underline mt-0.5">{order.customerEmail}</a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center text-[9px] font-extrabold shrink-0">
                            {order.vendorName.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-sm font-extrabold text-slate-700">{order.vendorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-200 transition-colors">
                           <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalItems > 0 && (
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
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeDrawer}></div>
      )}

      {/* Order Details Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-[#F8FAFC] shadow-2xl transform transition-all duration-300 ease-in-out border-l border-slate-200 overflow-hidden flex flex-col ${isDrawerOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible pointer-events-none'}`}>
        {selectedOrder && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-5 bg-white border-b border-slate-200 flex flex-col justify-center sticky top-0 z-10 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                    Order #ORD-{selectedOrder.id}
                    <StatusBadge status={selectedOrder.status} />
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">Placed on {selectedOrder.date}</p>
                </div>
                <button onClick={closeDrawer} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* CARD 1 & 2: Customer & Vendor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Customer</h3>
                  <div className="space-y-1">
                    <span className="block text-sm font-extrabold text-slate-900">{selectedOrder.customerName}</span>
                    <a href={`mailto:${selectedOrder.customerEmail}`} className="block text-xs font-bold text-[#1E3A8A] hover:underline">{selectedOrder.customerEmail}</a>
                    <span className="block text-xs font-medium text-slate-500 pt-1">{selectedOrder.customerPhone}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Vendor</h3>
                  <div className="space-y-1">
                    <span className="block text-sm font-extrabold text-slate-900 line-clamp-1">{selectedOrder.vendorName}</span>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID: {selectedOrder.vendorId}</span>
                    <button className="text-[11px] font-bold text-[#C2410C] hover:text-[#C2410C]/80 mt-1 flex items-center gap-0.5 group transition-colors">
                      View Profile <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 3: Ordered Items */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Ordered Items</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items.map(item => (
                    <AdminOrderItemWithReview key={item.id} item={item} order={selectedOrder} />
                  ))}
                </div>
              </div>

              {/* CARD 4: Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500">Subtotal</span>
                    <span className="font-extrabold text-slate-900">${(selectedOrder.total - selectedOrder.freight - selectedOrder.tax).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500">Freight & Logistics</span>
                    <span className="font-extrabold text-slate-900">${selectedOrder.freight.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500">Tax (State)</span>
                    <span className="font-extrabold text-slate-900">${selectedOrder.tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-lg font-extrabold text-slate-900">Total</span>
                  <span className="text-xl font-extrabold text-slate-900">${selectedOrder.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              {/* CARD 5: Order Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Order Timeline</h3>
                <OrderTimeline currentStatus={selectedOrder.status} date={selectedOrder.date} />
              </div>

            </div>

          </>
        )}
      </div>

    </AdminLayout>
  );
};

// Add Store icon since it was missed in lucide imports but used in vendor details
function Store(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}

export default AdminOrderManagement;
