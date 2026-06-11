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

  const handleSave = async (payload) => {
    if (!user?.vendorId) {
      alert("Vendor ID not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.addProduct(payload);
      alert('Product created successfully!');
      navigate('/vendor/inventory');
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.title || error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/vendor/inventory');
  };

  return (
    <VendorLayout>
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
