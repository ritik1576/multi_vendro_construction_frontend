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
import VendorApprovalStatus from '../pages/vendor/VendorApprovalStatus';
import AddProduct from '../pages/vendor/AddProduct';
import EditProduct from '../pages/vendor/EditProduct';
import Inventory from '../pages/vendor/Inventory';
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
        <Route path="/vendor/dashboard" element={<VendorApprovalStatus />} />
        <Route path="/vendor/products/add" element={<AddProduct />} />
        <Route path="/vendor/products/edit/:productId" element={<EditProduct />} />
        <Route path="/vendor/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;