import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/products" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
        <Route path="/product/:name" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><MyCart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

        {/* Vendor Routes */}
        <Route path="/vendor/approval-status" element={<ProtectedRoute><VendorApprovalStatus /></ProtectedRoute>} />
        <Route path="/vendor/dashboard" element={<VendorRoute><VendorDashboard /></VendorRoute>} />
        <Route path="/vendor/orders" element={<VendorRoute><VendorOrders /></VendorRoute>} />
        <Route path="/vendor/products/add" element={<VendorRoute><AddProduct /></VendorRoute>} />
        <Route path="/vendor/products/edit/:productId" element={<VendorRoute><EditProduct /></VendorRoute>} />
        <Route path="/vendor/inventory" element={<VendorRoute><Inventory /></VendorRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;