import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersRequest } from '../../redux/orderActions';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import { formatCurrency } from '../../context/cartUtils';
import { Package, ChevronRight, Clock, ArrowLeft } from 'lucide-react';

const badgeClass = (status) => {
  const s = String(status).toLowerCase();
  if (s.includes('delivered')) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
  if (s.includes('out for delivery')) return 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20';
  if (s.includes('confirmed')) return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20';
  if (s.includes('packed')) return 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20';
  if (s.includes('pending')) return 'bg-yellow-50 text-yellow-800 ring-1 ring-yellow-600/20';
  if (s.includes('cancelled')) return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
  return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const userId = user?.id || user?.userId || user?._id || 21;
    if (userId) {
      dispatch(getOrdersRequest(userId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const hideLinksByText = (text) => {
      const allLinks = document.querySelectorAll('nav a');
      const linkElements = [];
      allLinks.forEach((link) => {
        if (link.textContent.trim() === text) {
          link.style.display = 'none';
          linkElements.push(link);
        }
      });
      return linkElements;
    };
    
    const hiddenLinks = [
      ...hideLinksByText('Categories'),
      ...hideLinksByText('Bulk Orders'),
      ...hideLinksByText('Verified Sellers'),
    ];
    
    return () => {
      hiddenLinks.forEach((link) => link.style.display = '');
    };
  }, []);

  const hasOrders = !loading && !error && orders.length > 0;
  const showEmpty = !loading && !error && orders.length === 0;
  const showError = !loading && Boolean(error);

  // Sort orders by date descending if possible
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date || 0);
    const dateB = new Date(b.createdAt || b.date || 0);
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <ProductListingNavbar />
      
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Header Card */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
                <Package className="h-6 w-6 text-[#F97316]" />
                Order History
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Track, manage, and review your procurement orders
              </p>
            </div>
            {hasOrders && (
              <div className="text-sm font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                Total Orders: <span className="text-[#0F172A]">{orders.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1E3A8A] border-r-transparent mb-4"></div>
              <p className="text-sm font-bold text-slate-600">Loading your orders...</p>
            </div>
          )}

          {showError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <p className="text-lg font-bold text-red-800">Unable to load orders</p>
              <p className="mt-2 text-sm font-medium text-red-600">Please try again later or contact support.</p>
            </div>
          )}

          {showEmpty && (
            <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-sm">
              <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h2 className="text-lg font-extrabold text-[#0F172A]">No active orders</h2>
              <p className="mt-2 text-sm font-medium text-slate-500 max-w-sm mx-auto">
                You haven't placed any procurement orders yet. Browse our catalog to start building your inventory.
              </p>
              <Link
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#F97316] px-6 text-sm font-extrabold text-white hover:bg-orange-600 transition-colors shadow-sm"
                to="/products"
              >
                Browse Products
              </Link>
            </div>
          )}

          {hasOrders && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Desktop Header row */}
              <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50 border-b border-slate-200 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-3">Order Details</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Items</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-3 text-right">Status</div>
              </div>

              <div className="divide-y divide-slate-100">
                {sortedOrders.map((order) => {
                  const orderId = order.id || order._id;
                  const orderDate = order.date || (order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Unknown date');
                  const orderTotal = order.totalAmount || order.total || 0;
                  const itemsCount = order.itemCount || order.itemsCount || (Array.isArray(order.items) ? order.items.length : Number(order.items || 0));
                  const orderStatus = order.displayStatus || order.orderStatus || order.status || 'Processing';

                  return (
                    <Link
                      key={orderId}
                      to={`/orders/${orderId}`}
                      className="block hover:bg-slate-50 transition-colors group"
                    >
                      <div className="px-6 py-5 md:grid md:grid-cols-12 md:items-center gap-4 flex flex-col">
                        
                        {/* Mobile Header / Desktop Col 1 */}
                        <div className="md:col-span-3 flex items-start justify-between">
                          <div>
                            <p className="text-sm font-extrabold text-[#1E3A8A] group-hover:text-blue-700">
                              #{String(orderId).slice(-8).toUpperCase()}
                            </p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 md:hidden">
                              <Clock className="inline-block w-3 h-3 mr-1" /> {orderDate}
                            </p>
                          </div>
                          
                          {/* Mobile Status Badge */}
                          <div className="md:hidden">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${badgeClass(orderStatus)}`}>
                              {orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* Desktop Date */}
                        <div className="hidden md:block col-span-2">
                          <p className="text-sm font-medium text-slate-700">{orderDate}</p>
                        </div>

                        {/* Items Count */}
                        <div className="md:col-span-2 flex justify-between md:block md:text-right">
                          <span className="text-xs font-bold text-slate-500 md:hidden">Items</span>
                          <p className="text-sm font-medium text-slate-700">{itemsCount} product{itemsCount !== 1 ? 's' : ''}</p>
                        </div>

                        {/* Total Amount */}
                        <div className="md:col-span-2 flex justify-between md:block md:text-right">
                          <span className="text-xs font-bold text-slate-500 md:hidden">Total</span>
                          <p className="text-sm font-extrabold text-[#0F172A]">{formatCurrency(orderTotal)}</p>
                        </div>

                        {/* Desktop Status & Action */}
                        <div className="hidden md:flex col-span-3 items-center justify-end gap-4">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${badgeClass(orderStatus)}`}>
                            {orderStatus}
                          </span>
                          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-[#F97316] transition-colors" />
                        </div>

                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
