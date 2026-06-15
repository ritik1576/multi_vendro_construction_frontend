import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VendorLayout from '../../components/vendor/VendorLayout';
import ProductForm from '../../components/vendor/ProductForm';
import { productService } from '../../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSave = async (payload, imageFile) => {
    if (!user?.vendorId) {
      setErrorMsg("Vendor ID not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      let finalPayload = { ...payload };
      
      if (imageFile) {
        const uploadRes = await productService.uploadImage(imageFile);
        finalPayload.thumbnail = uploadRes.imageUrl || uploadRes.url || uploadRes.data?.imageUrl || '';
      }

      await productService.addProduct(finalPayload);
      alert('Product created successfully!');
      navigate('/vendor/inventory');
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMsg(error.response?.data?.message || error.response?.data?.title || error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/vendor/inventory');
  };

  return (
    <VendorLayout>
      {errorMsg && (
        <div className="mx-auto max-w-6xl mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-extrabold text-red-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMsg}
          </p>
        </div>
      )}
      <ProductForm 
        mode="add" 
        onSave={handleSave} 
        onCancel={handleCancel}
        isSubmitting={isSubmitting} 
      />
    </VendorLayout>
  );
};

export default AddProduct;
