import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminVendorsRequest, fetchAdminUsersRequest, fetchAdminOrdersRequest } from '../../redux/adminActions';
import { getProductsRequest } from '../../redux/productActions';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, CheckCircle, Package, ShoppingCart, Banknote, TrendingUp,
  ChevronRight, Check, X, Eye, ArrowUpRight, ArrowDownRight, PackageCheck, PackageX, Clock, MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendors = [], users = [], orders = [], vendorsLoading, loading: usersLoading, ordersLoading } = useSelector((state) => state.admin);
  const { products = [], loading: productsLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAdminVendorsRequest());
    dispatch(fetchAdminUsersRequest());
    dispatch(getProductsRequest());
    dispatch(fetchAdminOrdersRequest());
  }, [dispatch]);

  const isLoading = vendorsLoading || usersLoading || productsLoading || ordersLoading;

  // Derivations
  const totalVendors = vendors.length;
  const pendingVendorsList = vendors.filter(v => v.approval_status === 'Pending Approval');
  const pendingApprovals = pendingVendorsList.length;
  const totalCustomers = users.length;
  const totalProducts = products.length;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  const kpis = [
    { title: 'Total Vendors', value: totalVendors.toLocaleString(), growth: 'Up to date', isPositive: true, icon: Users },
    { title: 'Pending Approvals', value: pendingApprovals.toLocaleString(), growth: 'Action needed', isPositive: false, icon: CheckCircle },
    { title: 'Total Customers', value: totalCustomers.toLocaleString(), growth: 'Up to date', isPositive: true, icon: Users },
    { title: 'Total Products', value: totalProducts.toLocaleString(), growth: 'Up to date', isPositive: true, icon: Package },
    { title: 'Total Orders', value: totalOrders.toLocaleString(), growth: 'Live data', isPositive: true, icon: ShoppingCart },
  ];

  const orderStats = [
    { title: 'Pending Orders', count: pendingOrders.toString(), icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50' },
    { title: 'Processing Orders', count: processingOrders.toString(), icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Completed Orders', count: completedOrders.toString(), icon: PackageCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { title: 'Cancelled Orders', count: cancelledOrders.toString(), icon: PackageX, color: 'text-red-500', bgColor: 'bg-red-50' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-10">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Admin Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Marketplace operations and platform management.</p>
        </div>

        {/* ROW 1: Platform Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const isPending = kpi.title === 'Pending Approvals';
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">{kpi.title}</span>
                  <div className={`p-1.5 rounded-lg ${isPending ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {isLoading ? <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div> : kpi.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROW 2: Pending Vendor Approvals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Pending Vendor Approvals</h2>
            <button 
              onClick={() => navigate('/admin/vendors', { state: { filter: 'Pending' } })}
              className="text-sm font-bold text-[#1E3A8A] hover:text-blue-800 flex items-center gap-1 group"
            >
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-1 lg:col-span-2 py-8 flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2410C]"></div>
              </div>
            ) : pendingVendorsList.length === 0 ? (
              <div className="col-span-1 lg:col-span-2 py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-extrabold text-slate-700">You're all caught up!</h3>
                <p className="text-xs font-bold text-slate-500 mt-1">There are no pending vendor approvals at the moment.</p>
              </div>
            ) : (
              pendingVendorsList.slice(0,4).map((vendor, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-extrabold text-slate-900">{vendor.business_name}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wider">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-500">{vendor.name || vendor.business_email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Applied On</p>
                        <p className="font-bold text-slate-700">{new Date(vendor.joined || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact</p>
                        <p className="font-bold text-slate-700">{vendor.business_phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                        <p className="font-bold text-slate-700">{vendor.business_email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 justify-center sm:justify-start sm:border-l border-slate-100 sm:pl-6">
                    <button 
                      onClick={() => navigate(`/admin/vendors/${vendor.id}`, { state: { vendor } })}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-lg transition-colors border border-slate-200 shadow-sm"
                    >
                      <Eye className="w-4 h-4" /> Review Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ROW 3: Operations Overview */}
        <div className="flex flex-col gap-8">
          
          {/* Order Monitoring */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">Order Monitoring</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orderStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-slate-900">{stat.count}</div>
                      <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mt-0.5">{stat.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
