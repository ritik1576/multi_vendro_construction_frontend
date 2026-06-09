import { useState, useEffect } from 'react';
import { Save, X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ mode = 'add', initialData = null, onCancel, onSave }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    unit: '',
    shortDescription: '',
    description: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if (initialData.image) setImagePreview(initialData.image);
    }
  }, [initialData, mode]);

  useEffect(() => {
    // Validation is temporarily disabled for UI testing
    setIsFormValid(true);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, image: imagePreview };
    console.log('Form data to submit:', dataToSubmit);
    if (onSave) {
      onSave(dataToSubmit);
    } else {
      navigate('/vendor/inventory');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputBaseClass = "block w-full min-h-[44px] rounded-lg border px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all bg-slate-50 focus:bg-white placeholder-slate-400 font-medium";
  const getErrorClass = (field) => errors[field] ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:border-slate-300";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl pb-10">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Fill in the details below to {mode === 'add' ? 'create a new product catalog entry' : 'update this product information'}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {mode === 'edit' && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200/50 shadow-sm"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#F97316] hover:bg-orange-600 focus:ring-orange-500/30 px-6 py-2 text-sm font-extrabold text-white transition-all focus:outline-none focus:ring-4 shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {mode === 'add' ? 'Save Product' : 'Update Product'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left Column: Image Upload */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wider">Product Image</h3>
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-all hover:border-[#F97316] hover:bg-orange-50 h-64 group cursor-pointer">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-3 -right-3 grid h-7 w-7 place-items-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-transform hover:scale-105"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center group-hover:text-[#F97316] transition-colors">
                  <UploadCloud className="mx-auto h-10 w-10 text-slate-400 group-hover:text-[#F97316] transition-colors mb-3" />
                  <p className="text-sm font-extrabold text-slate-700 group-hover:text-[#F97316]">Click to upload image</p>
                  <p className="text-xs font-medium text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                title=""
              />
            </div>
          </div>
        </div>

        {/* Right Column: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700">Product Name</label>
                  {errors.name && <span className="text-xs font-bold text-red-500">{errors.name}</span>}
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${getErrorClass('name')}`}
                  placeholder="e.g., UltraTech Cement 50kg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="category" className="block text-sm font-bold text-slate-700">Category</label>
                  {errors.category && <span className="text-xs font-bold text-red-500">{errors.category}</span>}
                </div>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${getErrorClass('category')}`}
                >
                  <option value="">Select Category</option>
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Plywood">Plywood</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Fasteners">Fasteners</option>
                  <option value="Conductors">Conductors</option>
                  <option value="Pumps">Pumps</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="brand" className="block text-sm font-bold text-slate-700">Brand / Vendor</label>
                  {errors.brand && <span className="text-xs font-bold text-red-500">{errors.brand}</span>}
                </div>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${getErrorClass('brand')}`}
                  placeholder="e.g., UltraTech"
                />
              </div>
            </div>
          </div>

          {/* Inventory & Pricing Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Inventory & Pricing</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="sku" className="block text-sm font-bold text-slate-700">SKU</label>
                  {errors.sku && <span className="text-xs font-bold text-red-500">{errors.sku}</span>}
                </div>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${getErrorClass('sku')} uppercase`}
                  placeholder="CEM-UTC-50"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="stock" className="block text-sm font-bold text-slate-700">Stock Qty</label>
                  {errors.stock && <span className="text-xs font-bold text-red-500">{errors.stock}</span>}
                </div>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={`${inputBaseClass} ${getErrorClass('stock')}`}
                  placeholder="0"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="unit" className="block text-sm font-bold text-slate-700">Unit</label>
                  {errors.unit && <span className="text-xs font-bold text-red-500">{errors.unit}</span>}
                </div>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${getErrorClass('unit')}`}
                  placeholder="Bag, Kg"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="price" className="block text-sm font-bold text-slate-700">Price (₹)</label>
                  {errors.price && <span className="text-xs font-bold text-red-500">{errors.price}</span>}
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`${inputBaseClass} ${getErrorClass('price')}`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Descriptions</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="shortDescription" className="block text-sm font-bold text-slate-700">Short Description</label>
                  <div className="flex gap-2">
                    {errors.shortDescription && <span className="text-xs font-bold text-red-500">{errors.shortDescription}</span>}
                    <span className={`text-xs font-medium ${formData.shortDescription.length > 120 ? 'text-red-500' : 'text-slate-500'}`}>
                      {formData.shortDescription.length}/120
                    </span>
                  </div>
                </div>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  className={`${inputBaseClass} ${getErrorClass('shortDescription')} resize-none py-3`}
                  placeholder="Brief summary for product cards..."
                ></textarea>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="description" className="block text-sm font-bold text-slate-700">Full Description</label>
                  {errors.description && <span className="text-xs font-bold text-red-500">{errors.description}</span>}
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputBaseClass} ${getErrorClass('description')} resize-none py-3`}
                  placeholder="Detailed specifications, features, and information..."
                ></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
};

export default ProductForm;
