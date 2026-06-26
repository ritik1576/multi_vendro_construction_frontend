import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAdminVendorsRequest } from '../../redux/adminActions';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { 
  ArrowLeft, Building2, Mail, Phone, FileText, 
  CheckCircle2, XCircle, ShieldCheck, Ban, Clock, Loader2, CreditCard, AlertCircle
} from 'lucide-react';

const AdminVendorDetails = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [vendor, setVendor] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  const buildFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://multi-vendro-construction-backend-4.onrender.com';
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const isPdfFile = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const fetchKycData = async () => {
    try {
      const data = await adminService.getVendorKycDetails(vendorId);
      setKycDetails(data);
      if (data && data.vendorStatus) {
        setVendor(prev => ({ ...prev, approval_status: data.vendorStatus }));
      }
    } catch (error) {
      console.warn('Failed to fetch KYC details:', error);
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    setApiMessage(null);
    try {
      const response = await adminService.approveVendor(vendorId);
      if (response.success || response.vendorStatus === 'Approved') {
        dispatch(fetchAdminVendorsRequest({ forceRefresh: true }));
        await fetchKycData();
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
      const response = await adminService.rejectVendor(vendorId, rejectReason);
      if (response.success || response.vendorStatus === 'Rejected') {
        setShowRejectReason(false);
        dispatch(fetchAdminVendorsRequest({ forceRefresh: true }));
        await fetchKycData();
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

  useEffect(() => {
    if (location.state?.vendor) {
      setVendor(location.state.vendor);
    } else {
      setVendor({
        id: vendorId,
        business_name: 'Loading...',
        approval_status: 'Pending'
      });
    }
    fetchKycData();
  }, [vendorId, location.state]);

  if (!vendor) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A]"></div>
        </div>
      </AdminLayout>
    );
  }

  const kycStatus = kycDetails?.kycStatus || 'Not Submitted';
  const vendorStatus = kycDetails?.vendorStatus || vendor.approval_status;

  const isRejected = vendorStatus === 'Rejected' || kycStatus === 'Rejected';
  const isApproved = vendorStatus === 'Approved' || vendorStatus === 'Verified' || kycStatus === 'Verified';
  const isPending = !isRejected && !isApproved;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
      case 'Active':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 uppercase tracking-wider border border-emerald-200"><ShieldCheck className="w-3.5 h-3.5" /> {status}</span>;
      case 'Rejected':
      case 'Blocked':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 uppercase tracking-wider border border-red-200"><Ban className="w-3.5 h-3.5" /> {status}</span>;
      case 'UnderReview':
      case 'Pending Approval':
      case 'Pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wider border border-amber-200"><Clock className="w-3.5 h-3.5" /> Under Review</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 uppercase tracking-wider border border-slate-200">{status}</span>;
    }
  };

  const renderDocumentCard = (title, url) => {
    if (!url) return null;
    const fullUrl = buildFileUrl(url);
    const isPdf = isPdfFile(url);

    return (
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col h-full">
        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">{title}</h4>
        <div className="flex-1 flex flex-col justify-center">
          {isPdf ? (
            <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-lg h-32">
              <FileText className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-xs font-bold text-slate-700 mb-3">PDF Document</span>
              <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-bold rounded shadow-sm hover:bg-[#152e75] transition-colors">
                Open PDF
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-full">
              <div className="h-24 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src={fullUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 w-full flex justify-center bg-white">
                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-bold rounded shadow-sm hover:bg-[#152e75] transition-colors w-full text-center">
                  View Image
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-10">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/admin/vendors')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1E3A8A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vendors
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{kycDetails?.shopName || vendor.business_name}</h1>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Vendor ID: VEND-{vendorId}
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">Vendor Status</span>
              {getStatusBadge(vendorStatus)}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">KYC Status</span>
              {getStatusBadge(kycStatus)}
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

        {/* Rejection Note */}
        {kycStatus === 'Rejected' && kycDetails?.rejectionReason && (
          <div className="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-800">Application Rejected</h4>
                <p className="text-sm text-red-600 mt-1">{kycDetails.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendor Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-extrabold text-slate-800">Basic Information</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Business Legal Name</th>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-900">{kycDetails?.businessLegalName || '-'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email Address</th>
                  <td className="px-6 py-4 text-sm font-extrabold text-[#1E3A8A]">
                    {kycDetails?.vendorEmail || vendor.business_email || '-'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Phone Number</th>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-900">{kycDetails?.vendorPhone || vendor.business_phone || '-'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Business Address</th>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{kycDetails?.businessAddress || '-'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Submitted At</th>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{formatDate(kycDetails?.submittedAt)}</td>
                </tr>
                {kycDetails?.verifiedAt && (
                  <tr className="hover:bg-slate-50 transition-colors">
                    <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Verified At</th>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-700">{formatDate(kycDetails.verifiedAt)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* KYC Documents Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-extrabold text-slate-800">Identity & Banking</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">GST Number</th>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-sm font-mono font-bold text-slate-700 tracking-wider">
                      {kycDetails?.gstNumber || vendor.gst_number || '-'}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">PAN Number</th>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-sm font-mono font-bold text-slate-700 tracking-wider">
                      {kycDetails?.panNumber || '-'}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Account Holder</th>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-900">{kycDetails?.bankAccountName || '-'}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Account Number</th>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-sm font-mono font-bold text-slate-700">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      {kycDetails?.bankAccountNumber || '-'}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <th className="px-6 py-4 w-1/3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">IFSC Code</th>
                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">{kycDetails?.ifscCode || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Previews */}
        {kycDetails && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4">Document Previews</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {renderDocumentCard('Aadhaar Document', kycDetails.aadhaarDocumentUrl)}
              {renderDocumentCard('PAN Card', kycDetails.panCardUrl)}
              {renderDocumentCard('GST Certificate', kycDetails.gstCertificateUrl)}
              {renderDocumentCard('Bank Statement', kycDetails.bankStatementUrl)}
            </div>
            {!kycDetails.aadhaarDocumentUrl && !kycDetails.panCardUrl && !kycDetails.gstCertificateUrl && !kycDetails.bankStatementUrl && (
              <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg text-center">
                No documents uploaded.
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!showRejectReason && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex justify-end gap-3">
            {!isRejected && (
              <button 
                onClick={() => setShowRejectReason(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-extrabold rounded-lg shadow-sm transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject Vendor
              </button>
            )}
            {isPending && (
              <button 
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve Vendor
              </button>
            )}
            {isRejected && (
              <button 
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-extrabold rounded-lg shadow-sm transition-colors"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve Again
              </button>
            )}
          </div>
        )}

        {/* Reject Form */}
        {showRejectReason && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
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
