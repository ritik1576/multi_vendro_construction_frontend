import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ApprovalStateCard from '../../components/vendor/ApprovalStateCard';
import VendorNavbar from '../../components/vendor/VendorNavbar';
import { getVendorStatus } from '../../services/vendorApi';

const VendorApprovalStatus = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const vendorId = user?.vendorId;

  const [vendorStatus, setVendorStatus] = useState(user?.status);
  const [loading, setLoading] = useState(!user?.status);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await getVendorStatus(vendorId);
      const status = data?.status || data || 'pending';
      setVendorStatus(status);
      dispatch({ type: 'UPDATE_VENDOR_STATUS', payload: status });
    } catch (error) {
      console.error('Failed to fetch vendor status:', error);
      setVendorStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.status) {
      fetchStatus();
    }
  }, [user?.status, vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <div className="sticky top-0 z-50">
          <VendorNavbar />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <p className="text-slate-500 font-medium">Loading vendor status...</p>
        </div>
      </div>
    );
  }

  if (vendorStatus === 'approved') {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="sticky top-0 z-50">
        <VendorNavbar />
      </div>
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full flex flex-col items-center">
        <ApprovalStateCard state={vendorStatus || 'pending'} />
        
        {/* Check Button to refresh status */}
        <div className="mt-8 text-center">
          <button 
            onClick={fetchStatus}
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-6 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            <RefreshCw className="h-4 w-4" />
            Check Status Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorApprovalStatus;
