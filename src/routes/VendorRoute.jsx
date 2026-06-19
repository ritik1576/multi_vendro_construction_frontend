import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VendorRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isKycPage = location.pathname === '/vendor/kyc';

  if (!isAuthenticated) {
    if (isKycPage && sessionStorage.getItem('pendingVendorId')) {
      return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'vendor' && !user?.vendorId) {
    return <Navigate to="/" replace />;
  }

  if (user?.needsKyc && !isKycPage) {
    return <Navigate to="/vendor/kyc" replace />;
  }

  return children;
};

export default VendorRoute;
