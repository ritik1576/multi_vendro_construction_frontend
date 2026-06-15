import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is a vendor trying to access customer protected routes,
  // push them to their vendor dashboard.
  if (user?.vendorId || user?.role === 'vendor') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
