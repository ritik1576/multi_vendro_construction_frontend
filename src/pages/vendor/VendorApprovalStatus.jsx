import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ApprovalStateCard from '../../components/vendor/ApprovalStateCard';
import VendorDashboard from './VendorDashboard';
import VendorLayout from '../../components/vendor/VendorLayout';
import { getVendorStatus } from '../../services/vendorApi';

const VendorApprovalStatus = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId || 3;

  const [vendorStatus, setVendorStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getVendorStatus(vendorId);
        // Assuming data could be { status: 'approved' } or just a string
        setVendorStatus(data?.status || data || 'pending');
      } catch (error) {
        console.error('Failed to fetch vendor status:', error);
        setVendorStatus('pending');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [vendorId]);

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-slate-500 font-medium">Loading vendor status...</p>
        </div>
      </VendorLayout>
    );
  }

  if (vendorStatus === 'pending') {
    return (
      <VendorLayout>
        <ApprovalStateCard state="pending" />
      </VendorLayout>
    );
  }

  if (vendorStatus === 'rejected') {
    return (
      <VendorLayout>
        <ApprovalStateCard state="rejected" />
      </VendorLayout>
    );
  }

  // If approved, show dashboard
  return (
    <VendorLayout>
      <VendorDashboard />
    </VendorLayout>
  );
};

export default VendorApprovalStatus;
