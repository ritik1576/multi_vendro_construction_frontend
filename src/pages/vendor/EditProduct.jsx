import { useParams } from 'react-router-dom';
import VendorLayout from '../../components/vendor/VendorLayout';
import ProductForm from '../../components/vendor/ProductForm';

const EditProduct = () => {
  const { productId } = useParams();

  // Dummy data based on productId for demonstration
  const dummyData = {
    name: 'UltraTech Cement 50kg',
    category: 'Cement',
    brand: 'UltraTech',
    price: '400.00',
    discountPrice: '380.00',
    stock: '150',
    sku: 'CEM-UTC-50',
    unit: 'Bag',
    shortDescription: 'Premium quality ordinary portland cement for general construction.',
    description: 'Premium quality ordinary portland cement suitable for all general construction purposes. High strength and durability.',
  };

  return (
    <VendorLayout>
      <div className="mb-6">
        <p className="text-sm text-slate-500">Editing Product ID: <span className="font-bold text-[#1E3A8A]">{productId}</span></p>
      </div>
      <ProductForm mode="edit" initialData={dummyData} />
    </VendorLayout>
  );
};

export default EditProduct;
