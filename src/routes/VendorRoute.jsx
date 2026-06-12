import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getVendorStatus } from '../services/vendorApi';

const VendorRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [vendorStatus, setVendorStatus] = useState(user?.status);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      // Only fetch if authenticated, user is vendor, and status is missing
      if (isAuthenticated && user?.vendorId && !user?.status) {
        setLoading(true);
        try {
          const data = await getVendorStatus(user.vendorId);
          const status = data?.status || data || 'pending';
          if (isMounted) {
            setVendorStatus(status);
            dispatch({ type: 'UPDATE_VENDOR_STATUS', payload: status });
          }
        } catch (error) {
          if (isMounted) setVendorStatus('pending');
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setVendorStatus(user?.status || 'pending');
      }
    };

    fetchStatus();
    return () => { isMounted = false; };
  }, [isAuthenticated, user?.status, user?.vendorId, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ensure only vendors can access
  if (!user?.vendorId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="text-slate-500 font-medium">Checking approval status...</p>
      </div>
    );
  }

  if (vendorStatus !== 'approved') {
    return <Navigate to="/vendor/approval-status" replace />;
  }

  return children;
};

export default VendorRoute;
