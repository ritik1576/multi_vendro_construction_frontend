import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { 
  ArrowLeft, Building2, Mail, Phone, FileText, 
  CheckCircle2, XCircle, ShieldCheck, Ban, Clock, Loader2
} from 'lucide-react';

const AdminVendorDetails = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [vendor, setVendor] = useState(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  const handleApprove = async () => {
    setIsProcessing(true);
    setApiMessage(null);
    try {
      const response = await adminService.approveVendor(vendor.id);
      if (response.success) {
        setVendor(prev => ({ ...prev, approval_status: 'Approved' }));
        setApiMessage({ type: 'success', text: response.message || 'Vendor approved successfully!' });
      } else {
        setApiMessage({ type: 'error', text: response.message || 'Failed to approve vendor.' });
      }
    } catch (error) {
      setApiMessage({ type: 'error', text: 'Failed to approve vendor due to a network error.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    setApiMessage(null);
    try {
      const response = await adminService.rejectVendor(vendor.id, rejectReason);
      if (response.success) {
        setVendor(prev => ({ ...prev, approval_status: 'Rejected' }));
        setShowRejectReason(false);
        setApiMessage({ type: 'success', text: response.message || 'Vendor rejected successfully!' });
      } else {
        setApiMessage({ type: 'error', text: response.message || 'Failed to reject vendor.' });
      }
    } catch (error) {
      setApiMessage({ type: 'error', text: 'Failed to reject vendor due to a network error.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlock = async () => {
    setIsProcessing(true);
    setApiMessage(null);
    try {
      const response = await adminService.rejectVendor(vendor.id, "Admin blocked the vendor.");
      if (response.success) {
        setVendor(prev => ({ ...prev, approval_status: 'Blocked' }));
        setApiMessage({ type: 'success', text: response.message || 'Vendor blocked successfully!' });
      } else {
        setApiMessage({ type: 'error', text: response.message || 'Failed to block vendor.' });
      }
    } catch (error) {
      setApiMessage({ type: 'error', text: 'Failed to block vendor due to a network error.' });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // If passed via navigation state, use it. Otherwise, mock fetch based on ID.
    if (location.state?.vendor) {
      setVendor(location.state.vendor);
    } else {
      // Mock fetch
      setVendor({
        id: vendorId,
        business_name: 'SteelCorp Industries',
        business_email: 'admin@steelcorp.com',
        business_phone: '+91 98765 43210',
        gst_number: '29ABCDE1234F1Z5',
        approval_status: 'Pending Approval' // Can be 'Pending Approval', 'Approved', 'Blocked'
      });
    }
  }, [vendorId, location.state]);

  if (!vendor) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2410C]"></div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
      case 'Active':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 uppercase tracking-wider border border-emerald-200"><ShieldCheck className="w-3.5 h-3.5" /> Approved</span>;
      case 'Rejected':
      case 'Blocked':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 uppercase tracking-wider border border-red-200"><Ban className="w-3.5 h-3.5" /> {status}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wider border border-amber-200"><Clock className="w-3.5 h-3.5" /> Pending Approval</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/admin/vendors')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#C2410C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vendors
        </button>

        {/* Header Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-24 bg-slate-900"></div>
          <div className="px-8 pb-8">
            <div className="relative flex items-end -mt-10 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-md border border-slate-100">
                <div className="w-full h-full rounded-xl bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center font-extrabold text-3xl">
                  {vendor.business_name.charAt(0)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900">{vendor.business_name}</h1>
                  {getStatusBadge(vendor.approval_status)}
                </div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Vendor ID: VEND-{vendor.id?.toString().padStart(4, '0')}
                </p>
              </div>

              {/* Actions */}
              {!showRejectReason && (
                <div className="flex gap-3">
                  {vendor.approval_status === 'Pending Approval' && (
                    <>
                      <button 
                        onClick={() => setShowRejectReason(true)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-extrabold rounded-lg shadow-sm transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button 
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors"
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve
                      </button>
                    </>
                  )}
                  
                  {vendor.approval_status === 'Approved' && (
                    <button 
                      onClick={handleBlock}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 text-sm font-extrabold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />} Block Vendor
                    </button>
                  )}
                  
                  {(vendor.approval_status === 'Blocked' || vendor.approval_status === 'Rejected') && (
                    <button 
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 text-sm font-extrabold rounded-lg shadow-sm transition-colors"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve Back
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {apiMessage && (
          <div className={`p-4 rounded-xl text-sm font-bold border flex items-start gap-3 ${
            apiMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {apiMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
            {apiMessage.text}
          </div>
        )}

        {/* Details Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">Business Name</th>
                <td className="px-6 py-4 text-sm font-extrabold text-slate-900">{vendor.business_name}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">Description</th>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{vendor.description || 'No description provided.'}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">Business Email</th>
                <td className="px-6 py-4 text-sm font-extrabold text-[#1E3A8A]">
                  <a href={`mailto:${vendor.business_email}`} className="hover:underline">{vendor.business_email}</a>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">Business Phone</th>
                <td className="px-6 py-4 text-sm font-extrabold text-slate-900">{vendor.business_phone}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">GST Number</th>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-sm font-mono font-bold text-slate-700 tracking-wider">
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {vendor.gst_number}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">Approval Status</th>
                <td className="px-6 py-4">
                  {getStatusBadge(vendor.approval_status)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Actions */}
        {vendor.approval_status === 'Pending Approval' && showRejectReason && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 mt-4">
            <h3 className="text-sm font-extrabold text-red-600 mb-2">Reason for Rejection</h3>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a detailed reason for rejecting this vendor application..."
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px] bg-slate-50 mb-4"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setShowRejectReason(false); setRejectReason(''); }}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-extrabold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!rejectReason.trim() || isProcessing}
                onClick={handleReject}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Confirm Rejection
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVendorDetails;
