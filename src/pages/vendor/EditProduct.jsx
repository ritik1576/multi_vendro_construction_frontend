import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VendorLayout from '../../components/vendor/VendorLayout';
import ProductForm from '../../components/vendor/ProductForm';
import { Edit2, ArrowLeft, Image as ImageIcon, Package, Tag, Hash, Box, FileText, AlignLeft } from 'lucide-react';

const EditProduct = () => {
  const { productId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // Simulated product data that would normally be fetched from an API
  const [productData, setProductData] = useState({
    name: 'UltraTech Cement 50kg',
    category: 'Cement',
    brand: 'UltraTech',
    price: '400.00',
    discountPrice: '380.00',
    stock: '150',
    sku: 'CEM-UTC-50',
    unit: 'Bag',
    shortDescription: 'Premium quality ordinary portland cement for general construction.',
    description: 'Premium quality ordinary portland cement suitable for all general construction purposes. High strength and durability. Ideal for concrete applications, plastering, and masonry.',
    image: null,
  });

  const handleSave = (updatedData) => {
    // In a real app, you would make an API call here to update the backend
    setProductData(updatedData);
    setIsEditing(false); // Switch back to view mode
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
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white text-sm font-extrabold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-orange-500/20 active:scale-95"
              >
                <Edit2 className="w-4 h-4" />
                Edit Details
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Image & Status */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Image Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center aspect-square">
                  {productData.image ? (
                    <img src={productData.image} alt={productData.name} className="w-full h-full object-contain rounded-xl" />
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
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5"><Hash className="w-3.5 h-3.5" /> Brand / Vendor</div>
                        <div className="text-sm font-extrabold text-slate-900">{productData.brand || '-'}</div>
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
          />
        )}
      </div>
    </VendorLayout>
  );
};

export default EditProduct;
