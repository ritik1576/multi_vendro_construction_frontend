import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUserDetailsRequest } from '../../redux/adminActions';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  ArrowLeft, Mail, Phone, MapPin, Package, Clock, 
  ShieldAlert, ShieldBan, ShieldCheck, Link as LinkIcon, Loader2, AlertCircle
} from 'lucide-react';

const AdminUserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedUser: user, selectedUserLoading: isLoading, selectedUserError: error } = useSelector(state => state.admin);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  useEffect(() => {
    // Extract actual raw ID from USR-123 if necessary, but the API might just take the raw string.
    // The previous page navigates to /admin/customers/USR-76. We need to pass the raw ID '76' to the API.
    const rawId = userId.replace('USR-', '');
    dispatch(fetchAdminUserDetailsRequest(rawId));
  }, [dispatch, userId]);

  if (isLoading || !user) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400">
          <Loader2 className="w-10 h-10 mb-4 animate-spin text-[#C2410C]" />
          <p className="text-sm font-bold">Loading customer details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500">
          <AlertCircle className="w-10 h-10 mb-4" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => navigate('/admin/customers')} className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Go Back</button>
        </div>
      </AdminLayout>
    );
  }

  const getAvatarColor = (name) => {
    const colors = [
      'bg-[#1E3A8A]/10 text-[#1E3A8A]',
      'bg-emerald-100 text-emerald-700',
      'bg-purple-100 text-purple-700',
      'bg-[#C2410C]/10 text-[#C2410C]',
      'bg-rose-100 text-rose-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatusBadge = (status) => {
    if (status === 'Suspended') {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 uppercase tracking-wider">Suspended</span>;
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/admin/customers')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#C2410C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-24 bg-slate-900"></div>
          <div className="px-8 pb-8">
            <div className="relative flex items-end -mt-10 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-md border border-slate-100">
                <div className={`w-full h-full rounded-xl flex items-center justify-center font-extrabold text-3xl ${getAvatarColor(user.full_name)}`}>
                  {user.full_name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900">{user.full_name}</h1>
                  {getStatusBadge(user.status)}
                </div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  User ID: {user.id}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {user.status !== 'Suspended' ? (
                  <button 
                    onClick={() => setIsSuspendModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-extrabold rounded-lg shadow-sm transition-colors"
                  >
                    <ShieldBan className="w-4 h-4" /> Suspend User
                  </button>
                ) : (
                  <button className="flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors">
                    <ShieldCheck className="w-4 h-4" /> Reactivate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid (Row 1: Contact & Address) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Card: Contact & Business Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              Contact & Business Information
            </h2>
            <div className="flex flex-col space-y-5">
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</span>
                <span className="block text-sm font-extrabold text-slate-900">{user.full_name}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
                <a href={`mailto:${user.email}`} className="inline-flex items-center text-sm font-extrabold text-[#1E3A8A] hover:underline break-all">
                  <Mail className="w-4 h-4 mr-2 shrink-0 text-slate-400" /> {user.email}
                </a>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</span>
                <a href={`tel:${user.phone}`} className="inline-flex items-center text-sm font-extrabold text-slate-900 hover:text-[#1E3A8A] transition-colors">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" /> {user.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Card: Address Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              Address Information
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1E3A8A]"></div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Billing Address (Default)</span>
                    <span className="block text-sm font-extrabold text-slate-700">{user.addresses.billing.line}</span>
                    <span className="block text-xs font-bold text-slate-500">{user.addresses.billing.city}, {user.addresses.billing.state} {user.addresses.billing.zip}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Shipping Address</span>
                    <span className="block text-sm font-extrabold text-slate-700">{user.addresses.shipping.line}</span>
                    <span className="block text-xs font-bold text-slate-500">{user.addresses.shipping.city}, {user.addresses.shipping.state} {user.addresses.shipping.zip}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            Order History
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4 lg:col-span-1">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders</span>
                <span className="block text-2xl font-extrabold text-slate-900">{user.orders}</span>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Orders</h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100 bg-slate-50">
                    {user.recent_orders.map((order, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-extrabold text-slate-900">{order.id}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-bold">{order.date}</td>
                        <td className="px-4 py-3 font-extrabold text-slate-900">{order.amount}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-white border border-slate-200 text-slate-600">{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Suspend Confirmation Modal */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSuspendModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 transform scale-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Suspend User Account?</h2>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Are you sure you want to suspend <span className="font-bold text-slate-900">{user.full_name}</span>? They will immediately lose access to the platform and will not be able to log in or place orders.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsSuspendModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-extrabold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Mock suspension
                  setIsSuspendModalOpen(false);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminUserDetails;
