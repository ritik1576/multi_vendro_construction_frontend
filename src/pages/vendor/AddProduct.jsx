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

  const handleSave = async (formData) => {
    if (!user?.vendorId) {
      alert("Vendor ID not found. Please log in again.");
      return;
    }

    const price = Number(formData.price || 0);
    const discountPrice = Number(formData.discountPrice || 0);
    const quantity = Number(formData.stock || 0);
    
    // Auto-generate slug from name
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const payload = {
      vendorId: user.vendorId,
      name: formData.name,
      slug: slug,
      shortDescription: formData.shortDescription,
      description: formData.description,
      price: price,
      discountPrice: discountPrice,
      sku: formData.sku,
      thumbnail: formData.image || '', // This is the R2 URL passed from ProductForm
      inStock: quantity > 0,
      createdAt: new Date().toISOString(),
      quantity: quantity,
      category: formData.category
    };

    setIsSubmitting(true);
    try {
      await productService.addProduct(payload);
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
