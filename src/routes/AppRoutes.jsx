import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LandingPage from '../pages/LandingPage';
import Register from '../pages/authentication/Register';
import Login from '../pages/authentication/Login';
import ForgotPassword from '../pages/authentication/ForgotPassword';
import ResetPassword from '../pages/authentication/ResetPassword';

import ProductListing from '../pages/customer/ProductListing';
import ProductDetail from '../pages/customer/ProductDetail';
import MyCart from '../pages/customer/MyCart';
import Checkout from '../pages/customer/Checkout';
import ConfirmOrder from '../pages/customer/ConfirmOrder';
import OrderHistory from '../pages/customer/OrderHistory';
import OrderDetail from '../pages/customer/OrderDetail';
import ProtectedRoute from './ProtectedRoute';
import VendorRoute from './VendorRoute';
import VendorApprovalStatus from '../pages/vendor/VendorApprovalStatus';
import VendorDashboard from '../pages/vendor/VendorDashboard';
import AddProduct from '../pages/vendor/AddProduct';
import EditProduct from '../pages/vendor/EditProduct';
import Inventory from '../pages/vendor/Inventory';
import VendorOrders from '../pages/vendor/VendorOrders';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVendorManagement from '../pages/admin/AdminVendorManagement';
import AdminVendorDetails from '../pages/admin/AdminVendorDetails';
import AdminUserManagement from '../pages/admin/AdminUserManagement';
import AdminUserDetails from '../pages/admin/AdminUserDetails';
import AdminProductManagement from '../pages/admin/AdminProductManagement';
import AdminOrderManagement from '../pages/admin/AdminOrderManagement';
import AdminReports from '../pages/admin/AdminReports';

// Admin Auth
import AdminLogin from '../pages/admin/auth/AdminLogin';
import AdminForgotPassword from '../pages/admin/auth/AdminForgotPassword';
import AdminResetPassword from '../pages/admin/auth/AdminResetPassword';

// Notifications
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';

// Reviews
import VendorReviews from '../features/reviews/pages/VendorReviews';
import AdminReviews from '../features/reviews/pages/AdminReviews';

// Coupons
import AdminCoupons from '../features/coupons/pages/AdminCoupons';
import VendorCoupons from '../features/coupons/pages/VendorCoupons';

// Profile Pages
import CustomerProfile from '../features/profile/pages/CustomerProfile';
import VendorProfile from '../features/profile/pages/VendorProfile';
import AdminProfile from '../features/profile/pages/AdminProfile';

// KYC Pages
import VendorKyc from '../features/profile/pages/VendorKyc';

const RootRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If vendor
  if (user?.vendorId || user?.role === 'vendor') {
    if (user?.status === 'approved') {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    return <Navigate to="/vendor/approval-status" replace />;
  }

  // If customer
  return <Navigate to="/products" replace />;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const VendorBaseRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.vendorId && user?.role !== 'vendor') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ProtectedRoute><MyCart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage role="customer" /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />

        {/* Vendor Routes */}
        <Route path="/vendor/approval-status" element={<VendorBaseRoute><VendorApprovalStatus /></VendorBaseRoute>} />
        <Route path="/vendor/dashboard" element={<VendorRoute><VendorDashboard /></VendorRoute>} />
        <Route path="/vendor/orders" element={<VendorRoute><VendorOrders /></VendorRoute>} />
        <Route path="/vendor/products/add" element={<VendorRoute><AddProduct /></VendorRoute>} />
        <Route path="/vendor/products/edit/:productId" element={<VendorRoute><EditProduct /></VendorRoute>} />
        <Route path="/vendor/inventory" element={<VendorRoute><Inventory /></VendorRoute>} />
        <Route path="/vendor/notifications" element={<VendorRoute><NotificationsPage role="vendor" /></VendorRoute>} />
        <Route path="/vendor/reviews" element={<VendorRoute><VendorReviews /></VendorRoute>} />
        <Route path="/vendor/profile" element={<VendorRoute><VendorProfile /></VendorRoute>} />
        <Route path="/vendor/kyc" element={<VendorRoute><VendorKyc /></VendorRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/vendors" element={<AdminProtectedRoute><AdminVendorManagement /></AdminProtectedRoute>} />
        <Route path="/admin/vendors/:vendorId" element={<AdminProtectedRoute><AdminVendorDetails /></AdminProtectedRoute>} />
        <Route path="/admin/customers" element={<AdminProtectedRoute><AdminUserManagement /></AdminProtectedRoute>} />
        <Route path="/admin/customers/:userId" element={<AdminProtectedRoute><AdminUserDetails /></AdminProtectedRoute>} />
        <Route path="/admin/products" element={<AdminProtectedRoute><AdminProductManagement /></AdminProtectedRoute>} />
        <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrderManagement /></AdminProtectedRoute>} />
        <Route path="/admin/reports" element={<AdminProtectedRoute><AdminReports /></AdminProtectedRoute>} />
        <Route path="/admin/notifications" element={<AdminProtectedRoute><NotificationsPage role="admin" /></AdminProtectedRoute>} />
        <Route path="/admin/reviews" element={<AdminProtectedRoute><AdminReviews /></AdminProtectedRoute>} />
        <Route path="/admin/coupons" element={<AdminProtectedRoute><AdminCoupons /></AdminProtectedRoute>} />
        <Route path="/admin/profile" element={<AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;