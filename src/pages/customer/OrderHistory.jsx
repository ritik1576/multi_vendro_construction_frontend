import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersRequest } from '../../redux/orderActions';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import { Package, ArrowLeft } from 'lucide-react';
import OrderHeader from '../../components/customer/orders/OrderHeader';
import OrderFilters from '../../components/customer/orders/OrderFilters';
import OrderCard from '../../components/customer/orders/OrderCard';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    statuses: [],
    dateRanges: []
  });

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

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleClearFilters = () => {
    setFilters({ statuses: [], dateRanges: [] });
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status Filter
    if (filters.statuses.length > 0) {
      result = result.filter(order => {
        const status = String(order.orderStatus || order.status || order.displayStatus || '').toLowerCase();
        return filters.statuses.some(fStatus => status.includes(fStatus.toLowerCase()));
      });
    }

    // Date Filter
    if (filters.dateRanges.length > 0) {
      const now = new Date();
      result = result.filter(order => {
        const orderDate = new Date(order.placedAt || order.createdAt || order.date || 0);
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const orderYear = orderDate.getFullYear();
        
        return filters.dateRanges.some(range => {
          if (range === '30_days') return diffDays <= 30;
          if (range === '6_months') return diffDays <= 180;
          if (range === '2024') return orderYear === 2024;
          if (range === '2023') return orderYear === 2023;
          if (range === 'older') return orderYear < 2023;
          return false;
        });
      });
    }

    // Sort descending
    return result.sort((a, b) => {
      const dateA = new Date(a.placedAt || a.createdAt || a.date || 0);
      const dateB = new Date(b.placedAt || b.createdAt || b.date || 0);
      return dateB - dateA;
    });
  }, [orders, filters]);

  const hasOrders = !loading && !error && orders.length > 0;
  const showEmpty = !loading && !error && orders.length === 0;
  const showError = !loading && Boolean(error);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">
      <ProductListingNavbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Header Hero */}
        <OrderHeader />

        {/* Loading & Errors */}
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
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#1E3A8A] px-6 text-sm font-extrabold text-white hover:bg-[#172554] transition-colors shadow-sm"
              to="/products"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Main Layout: Filters + Cards */}
        {hasOrders && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Sidebar Filters */}
            <OrderFilters 
              filters={filters} 
              onFilterChange={setFilters} 
              onClearFilters={handleClearFilters} 
            />

            {/* Order Cards List */}
            <div className="flex-1 w-full space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <OrderCard 
                    key={order.id || order._id} 
                    order={order} 
                    onClick={handleOrderClick} 
                  />
                ))
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <p className="text-sm font-bold text-slate-600">No orders match your selected filters.</p>
                  <button 
                    onClick={handleClearFilters}
                    className="mt-4 text-[#F97316] font-bold text-sm hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;

