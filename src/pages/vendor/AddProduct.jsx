import VendorLayout from '../../components/vendor/VendorLayout';
import ProductForm from '../../components/vendor/ProductForm';

const AddProduct = () => {
  return (
    <VendorLayout>
      <ProductForm mode="add" />
    </VendorLayout>
  );
};

export default AddProduct;
