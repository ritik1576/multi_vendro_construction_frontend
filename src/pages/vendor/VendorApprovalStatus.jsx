import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ApprovalStateCard from '../../components/vendor/ApprovalStateCard';
import VendorNavbar from '../../components/vendor/VendorNavbar';
import { getVendorStatusRequest } from '../../redux/vendorActions';

const VendorApprovalStatus = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const vendorId = user?.vendorId;

  const { status, loading: vendorLoading } = useSelector((state) => state.vendor || {});
  const isStatusLoading = vendorLoading?.status || !user?.status;

  // Use either the redux state status, or fallback to user status from auth
  const currentStatus = status?.status || status || user?.status;

  const fetchStatus = () => {
    dispatch(getVendorStatusRequest(vendorId, true));
  };

  useEffect(() => {
    if (vendorId) {
      dispatch(getVendorStatusRequest(vendorId));
    }
  }, [vendorId, dispatch]);

  if (isStatusLoading && !currentStatus) {
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

  if (String(currentStatus || '').toLowerCase() === 'approved') {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="sticky top-0 z-50">
        <VendorNavbar />
      </div>
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full flex flex-col items-center">
        <ApprovalStateCard state={String(currentStatus || 'pending').toLowerCase()} />
        
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
