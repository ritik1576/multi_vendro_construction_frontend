import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productService } from '../../services/productService';
import VendorLayout from '../../components/vendor/VendorLayout';
import ProductForm from '../../components/vendor/ProductForm';
import { Edit2, ArrowLeft, Image as ImageIcon, Package, Tag, Hash, Box, FileText, AlignLeft, Trash2 } from 'lucide-react';
import { normalizeProductImage } from '../../utils/productImages';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useSelector(state => state.auth);

  // Initialize with empty/fallback data, then update from router state
  const [productData, setProductData] = useState({
    name: 'Unknown Product',
    category: '',
    brand: '',
    price: '0.00',
    discountPrice: '0.00',
    stock: '0',
    sku: '',
    unit: '',
    shortDescription: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    // If the user clicked "View Details" from Inventory, we have the product data
    if (location.state && location.state.product) {
      const product = location.state.product;
      setProductData({
        name: product.name || product.productName || 'Unknown Product',
        category: product.category || product.categoryName || '',
        brand: product.brand || '',
        price: product.price ? product.price.toString() : '0.00',
        discountPrice: product.discountPrice ? product.discountPrice.toString() : '0.00',
        stock: (product.stockQuantity || product.quantity || product.qty || 0).toString(),
        sku: product.sku || '',
        unit: product.unit || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        image: product.thumbnail || product.image || null,
      });
    } else {
      // Fallback: If they refresh the page, we don't have the data since we only have a "get all" API.
      // We could try to fetch all products again and filter by ID, but for now we'll just show empty.
      console.warn("No product data passed in location state.");
    }
  }, [location.state]);

  const handleSave = async (payload) => {
    if (!user?.vendorId) {
      toast.error("Vendor ID not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.updateProduct(productId, payload);
      toast.success('Product updated successfully!');
      navigate('/vendor/inventory');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.title || error.message || 'Failed to update product. Ensure your backend handles CORS for PUT requests.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    toast((t) => (
      <div>
        <p className="mb-3 text-sm font-medium">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            setIsDeleting(true);
            try {
              await productService.deleteProduct(productId);
              toast.success('Product deleted successfully');
              navigate('/vendor/inventory');
            } catch (error) {
              console.error('Error deleting product:', error);
              toast.error(error.response?.data?.title || error.message || 'Failed to delete product.');
              setIsDeleting(false);
            }
          }} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded">Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <VendorLayout>
      <div className="max-w-6xl mx-auto pb-10">
        
        {/* Back navigation */}
        <div className="mb-6">
          <Link to="/vendor/inventory" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1E3A8A] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Inventory
          </Link>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">{productData.name}</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Product ID: {productId} • SKU: {productData.sku}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-extrabold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-red-500/20 active:scale-95 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white text-sm font-extrabold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-orange-500/20 active:scale-95"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Image & Status */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Image Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center aspect-square">
                  {productData.image ? (
                    <img src={normalizeProductImage(productData.image)} alt={productData.name} className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <ImageIcon className="w-16 h-16 mb-2 text-slate-200" />
                      <span className="text-sm font-bold text-slate-400">No Image Provided</span>
                    </div>
                  )}
                </div>

                {/* Status Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Inventory Status</h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Status</span>
                    {Number(productData.stock) > 20 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                        Healthy
                      </span>
                    ) : Number(productData.stock) > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wider">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-red-100 text-red-700 uppercase tracking-wider">
                        Out Of Stock
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-slate-500">Available Stock</span>
                    <span className={`text-2xl font-extrabold ${Number(productData.stock) > 0 ? 'text-slate-900' : 'text-red-600'}`}>
                      {productData.stock} <span className="text-sm font-medium text-slate-500">{productData.unit}s</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Tabular Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Basic Details Table/Grid */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="p-6 space-y-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5"><Tag className="w-3.5 h-3.5" /> Category</div>
                        <div className="text-sm font-extrabold text-slate-900">{productData.category || '-'}</div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5"><Package className="w-3.5 h-3.5" /> Unit Type</div>
                        <div className="text-sm font-extrabold text-slate-900">{productData.unit || '-'}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5"><Box className="w-3.5 h-3.5" /> Base Price</div>
                        <div className="text-sm font-extrabold text-slate-900">₹{productData.price || '0.00'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Table/Grid */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Product Descriptions</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"><AlignLeft className="w-3.5 h-3.5" /> Short Description</div>
                      <div className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed shadow-inner">
                        {productData.shortDescription || 'No short description provided.'}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"><FileText className="w-3.5 h-3.5" /> Full Description</div>
                      <div className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed shadow-inner whitespace-pre-wrap">
                        {productData.description || 'No detailed description provided.'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <ProductForm 
            mode="edit" 
            initialData={productData} 
            onCancel={() => setIsEditing(false)} 
            onSave={handleSave} 
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </VendorLayout>
  );
};

export default EditProduct;
