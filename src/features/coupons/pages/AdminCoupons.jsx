import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CouponTable } from '../components/CouponTable';
import { CouponForm } from '../components/CouponForm';
import { useAdminCoupons } from '../hooks/useAdminCoupons';
import { Plus, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const {
    coupons,
    loading,
    error,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon
  } = useAdminCoupons();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleOpenForm = (coupon = null) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id || editingCoupon._id, formData);
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(formData);
        toast.success("Coupon created successfully");
      }
      handleCloseForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await updateCouponStatus(id, newStatus);
      toast.success("Coupon status updated");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        toast.success("Coupon deleted successfully");
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2 mb-2">
            <Tag className="h-6 w-6 text-[#1E3A8A]" />
            Coupon Management
          </h1>
          <p className="text-sm text-slate-500">
            Create and manage discount codes for the InfraMart platform.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-lg text-sm font-extrabold hover:bg-[#152e63] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600 font-bold">{error}</p>
        </div>
      )}

      {loading && !coupons.length ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#1E3A8A] border-r-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <CouponTable 
          coupons={coupons}
          isReadOnly={false}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {isFormOpen && (
        <CouponForm 
          initialData={editingCoupon}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          isLoading={isSubmitting}
        />
      )}
    </AdminLayout>
  );
};

export default AdminCoupons;
