import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Package, TrendingUp, AlertTriangle, Plus, ShoppingBag, Eye, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVendorOrders } from '../../services/vendorApi';

const VendorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId || user?.id || 2;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getVendorOrders(vendorId);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch vendor orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [vendorId]);

  const activeOrdersCount = orders.filter(o => o.status !== 'Completed' && o.status !== 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.total || o.amount) || 0), 0);
  const formatAmount = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const kpis = [
    { title: 'Total Products', value: '124', icon: Package, color: 'border-l-[#0F172A]', textColor: 'text-[#0F172A]' },
    { title: 'Total Revenue', value: formatAmount(totalRevenue), icon: TrendingUp, color: 'border-l-[#0F172A]', textColor: 'text-[#0F172A]' },
    { title: 'Active Orders', value: activeOrdersCount.toString(), icon: ShoppingBag, color: 'border-l-[#F59E0B]', textColor: 'text-[#F59E0B]' },
    { title: 'Low Stock Alerts', value: '8', icon: AlertTriangle, color: 'border-l-[#EF4444]', textColor: 'text-[#EF4444]' },
  ];

  const recentOrders = orders.slice(0, 5).map(o => ({
    id: o.id || o._id || 'N/A',
    customer: o.customerName || o.customer || 'Unknown Customer',
    date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Unknown Date'),
    amount: o.amount ? o.amount : formatAmount(o.totalAmount || o.total || 0),
    status: o.status || o.orderStatus || 'Processing'
  }));

  const lowStockCount = 8; // Match the KPI value

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Business summary and performance metrics.</p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 border-l-4 ${kpi.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${kpi.textColor}`} />
                <span className="text-sm font-bold text-slate-500">{kpi.title}</span>
              </div>
              <div className={`text-3xl font-extrabold ${kpi.textColor}`}>
                {kpi.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#0F172A]">Recent Orders</h2>
              <button className="text-sm font-bold text-[#F97316] hover:text-orange-600 transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                        No recent orders found.
                      </td>
                    </tr>
                  ) : recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-extrabold text-[#0F172A]">{order.customer}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{order.date}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-extrabold text-slate-700">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-[#1E3A8A] transition-colors p-1.5 rounded-lg hover:bg-slate-100" title="View Order">
                          <Eye className="w-4 h-4" />
                        </button>
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
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F97316]" />
                Quick Actions
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <Link
                to="/vendor/products/add"
                className="flex items-center justify-between w-full p-4 rounded-lg border border-slate-200 hover:border-[#F97316] hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 text-[#F97316] p-2 rounded-lg">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 group-hover:text-[#F97316] transition-colors">Add Product</h3>
                    <p className="text-xs font-medium text-slate-500">Create a new listing</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F97316] transition-colors" />
              </Link>
              
              <Link
                to="/vendor/inventory"
                className="flex items-center justify-between w-full p-4 rounded-lg border border-slate-200 hover:border-[#1E3A8A] hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-[#1E3A8A] p-2 rounded-lg">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 group-hover:text-[#1E3A8A] transition-colors">Manage Inventory</h3>
                    <p className="text-xs font-medium text-slate-500">Update stock & pricing</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E3A8A] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Low Stock Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Attention Needed
              </h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-extrabold text-red-600">{lowStockCount}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-1">Products Low on Stock</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">You have {lowStockCount} products that need immediate restocking to prevent missing out on sales.</p>
              
              <Link
                to="/vendor/inventory"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-lg transition-colors"
              >
                Review Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
