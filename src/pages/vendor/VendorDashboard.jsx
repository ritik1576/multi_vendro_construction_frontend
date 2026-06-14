import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Package, TrendingUp, AlertTriangle, Plus, ShoppingBag, Eye, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVendorOrders, getVendorDashboard } from '../../services/vendorApi';
import VendorLayout from '../../components/vendor/VendorLayout';

const VendorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId;
  const userId = user?.userId || user?.id;

  const [orders, setOrders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoadingDashboard(true);
      setLoadingOrders(true);
      setErrorDashboard(null);

      const [dashboardResult, ordersResult] = await Promise.allSettled([
        getVendorDashboard(userId),
        getVendorOrders(vendorId)
      ]);

      if (!isMounted) return;

      if (dashboardResult.status === 'fulfilled') {
        setDashboard(dashboardResult.value || null);
      } else {
        console.error('Failed to fetch dashboard data:', dashboardResult.reason);
        setErrorDashboard('Failed to load dashboard metrics.');
      }
      setLoadingDashboard(false);

      if (ordersResult.status === 'fulfilled') {
        const ordersData = ordersResult.value;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        console.error('Failed to fetch orders data:', ordersResult.reason);
      }
      setLoadingOrders(false);
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [vendorId, userId]);

  const activeOrdersCount = dashboard ? (Number(dashboard.pendingOrders || 0) + Number(dashboard.confirmedOrders || 0) + Number(dashboard.shippedOrders || 0)) : 0;
  const totalRevenue = dashboard?.totalRevenue || 0;
  const totalProducts = dashboard?.totalProducts || 0;
  const lowStockCount = dashboard?.lowStockAlerts || 0;
  const formatAmount = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const kpis = [
    { title: 'Total Products', value: totalProducts.toString(), icon: Package, iconBg: 'bg-slate-50', iconColor: 'text-[#0F172A]' },
    { title: 'Total Revenue', value: formatAmount(totalRevenue), icon: TrendingUp, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { title: 'Active Orders', value: activeOrdersCount.toString(), icon: ShoppingBag, iconBg: 'bg-orange-50', iconColor: 'text-[#EA580C]' },
    { title: 'Low Stock Alerts', value: lowStockCount.toString(), icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
  ];

  const recentOrders = orders.slice(0, 5).map(o => ({
    id: o.orderNumber || o.order_number || o.orderNo || o.orderId || o.id || o._id || '',
    customer: o.customerName || o.customer || '',
    date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''),
    amount: o.amount ? o.amount : formatAmount(o.totalAmount || o.total || 0),
    status: o.status || o.orderStatus || ''
  }));

  return (
    <VendorLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Dashboard</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Business summary and performance metrics.</p>
          </div>
        </div>

        {/* KPI Section */}
        {errorDashboard ? (
          <div className="flex justify-center items-center py-6 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-500 font-medium">{errorDashboard}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.title}</p>
                    {loadingDashboard ? (
                      <div className="h-8 w-24 bg-slate-200 animate-pulse rounded"></div>
                    ) : (
                      <h3 className="text-2xl font-extrabold text-[#0F172A] leading-none">
                        {kpi.value}
                      </h3>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Orders - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-[#0F172A]">Recent Orders</h2>
                <Link to="/vendor/orders" className="text-sm font-bold text-[#1E3A8A] hover:underline transition-colors">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Order Number</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingOrders ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32 mb-1"></div><div className="h-3 bg-slate-200 rounded w-24"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                          <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                          <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 rounded w-16 ml-auto"></div></td>
                        </tr>
                      ))
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                          No recent orders found.
                        </td>
                      </tr>
                    ) : recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-[13px] font-bold text-[#0F172A]">#{order.id}</td>
                        <td className="px-6 py-4">
                          {order.customer ? <div className="text-[14px] font-extrabold text-[#0F172A]">{order.customer}</div> : null}
                          {order.date ? <div className="text-[12px] font-medium text-slate-500 mt-0.5">{order.date}</div> : null}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-extrabold text-[#0F172A]">{order.amount}</td>
                        <td className="px-6 py-4">
                          {order.status ? (
                            <span className="inline-flex items-center rounded bg-blue-50 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase text-[#1E3A8A]">
                              {order.status}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to="/vendor/orders" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-[#0F172A] text-[12px] font-extrabold rounded-lg shadow-sm transition-colors" title="View Order">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#EA580C]" />
                  Quick Actions
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <Link
                  to="/vendor/products/add"
                  className="flex items-center justify-between w-full p-4 rounded-xl border border-slate-200 hover:border-[#EA580C] hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-[#EA580C] p-2.5 rounded-xl">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[#0F172A] group-hover:text-[#EA580C] transition-colors">Add Product</h3>
                      <p className="text-[12px] font-medium text-slate-500">Create a new listing</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#EA580C] transition-colors" />
                </Link>
                
                <Link
                  to="/vendor/inventory"
                  className="flex items-center justify-between w-full p-4 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-[#1E3A8A] p-2.5 rounded-xl">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">Manage Inventory</h3>
                      <p className="text-[12px] font-medium text-slate-500">Update stock & pricing</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E3A8A] transition-colors" />
                </Link>
              </div>
            </div>

            {/* Low Stock Summary Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Attention Needed
                </h2>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center">
                {loadingDashboard ? (
                  <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse mb-4 flex items-center justify-center"></div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                    <span className="text-2xl font-extrabold leading-none">{lowStockCount}</span>
                  </div>
                )}
                <h3 className="text-[15px] font-extrabold text-[#0F172A] mb-1">Products Low on Stock</h3>
                <p className="text-[13px] font-medium leading-relaxed text-slate-500 mb-6 max-w-[240px]">
                  {loadingDashboard ? 'Loading stock alerts...' : `You have ${lowStockCount} products that need immediate restocking.`}
                </p>
                
                <Link
                  to="/vendor/inventory"
                  className="inline-flex min-h-11 items-center justify-center w-full rounded-lg bg-[#1E3A8A] px-5 text-sm font-extrabold text-white hover:bg-[#172554] transition-colors shadow-sm"
                >
                  Review Inventory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
