import { useState, useEffect } from 'react';
import { Save, X, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { normalizeProductImage } from '../../utils/productImages';

const ProductForm = ({ mode = 'add', initialData = null, onCancel, onSave, isSubmitting = false }) => {
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
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if (initialData.thumbnail) setImagePreview(initialData.thumbnail);
    }
  }, [initialData, mode]);

  useEffect(() => {
    setIsFormValid(true);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});

    const price = Number(formData.price || 0);
    const discountPrice = Number(formData.discountPrice || 0);
    const quantity = Number(formData.stock || 0);
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const payload = {
      name: formData.name,
      slug: slug,
      shortDescription: formData.shortDescription,
      description: formData.description,
      price: price,
      discountPrice: discountPrice,
      sku: formData.sku,
      thumbnail: formData.thumbnail || '',
      inStock: quantity > 0,
      createdAt: new Date().toISOString(),
      quantity: quantity,
      unit: formData.unit,
      category: formData.category
    };

    if (onSave) {
      onSave(payload, imageFile);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // TODO: upload selected image to backend/R2 and set thumbnail URL
      setFormData(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  const inputBaseClass = "block w-full min-h-[44px] rounded-lg border px-4 py-2.5 text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 transition-all bg-slate-50 focus:bg-white placeholder-slate-400 font-medium";
  const getErrorClass = (field) => errors[field] ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20 hover:border-slate-300";

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
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-extrabold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0F172A] shadow-sm disabled:opacity-50"
            >
              <X className="h-4 w-4 text-slate-400" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] px-5 py-2.5 text-[13px] font-extrabold text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? 'Saving...' : mode === 'add' ? 'Save Product' : 'Update Product'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left Column: Thumbnail URL */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Product Thumbnail</h3>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Product Image</label>
                {errors.thumbnail && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.thumbnail}</span>}
              </div>
              
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-[#1E3A8A] hover:bg-blue-50/50 transition-colors bg-slate-50 relative group cursor-pointer overflow-hidden">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-2 text-center relative z-0 w-full">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={normalizeProductImage(imagePreview)}
                        alt="Product preview"
                        className="mx-auto h-48 w-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <p className="text-white font-bold text-sm flex items-center gap-2">
                          <UploadCloud className="w-4 h-4" /> Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-slate-400 group-hover:text-[#1E3A8A] transition-colors" />
                      <div className="flex text-[13px] text-slate-600 justify-center mt-2">
                        <span className="relative rounded-md font-extrabold text-[#1E3A8A] hover:text-[#172554]">
                          Click to upload image
                        </span>
                      </div>
                      <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="flex justify-between mb-2">
                  <label htmlFor="name" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Product Name</label>
                  {errors.name && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.name}</span>}
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
                <div className="flex justify-between mb-2">
                  <label htmlFor="category" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Category</label>
                  {errors.category && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.category}</span>}
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
                <div className="flex justify-between mb-2">
                  <label htmlFor="brand" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Brand / Vendor</label>
                  {errors.brand && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.brand}</span>}
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
            <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Inventory & Pricing</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between mb-2">
                  <label htmlFor="sku" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">SKU</label>
                  {errors.sku && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.sku}</span>}
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
                <div className="flex justify-between mb-2">
                  <label htmlFor="stock" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Stock Qty</label>
                  {errors.stock && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.stock}</span>}
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
                <div className="flex justify-between mb-2">
                  <label htmlFor="unit" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Unit</label>
                  {errors.unit && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.unit}</span>}
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
                <div className="flex justify-between mb-2">
                  <label htmlFor="price" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Price (₹)</label>
                  {errors.price && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.price}</span>}
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

              <div className="col-span-2 md:col-span-1">
                <div className="flex justify-between mb-2">
                  <label htmlFor="discountPrice" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Discount (₹)</label>
                  {errors.discountPrice && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.discountPrice}</span>}
                </div>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`${inputBaseClass} ${getErrorClass('discountPrice')}`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Descriptions</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="shortDescription" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Short Description</label>
                  <div className="flex gap-2">
                    {errors.shortDescription && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.shortDescription}</span>}
                    <span className={`text-[11px] font-extrabold tracking-wider ${formData.shortDescription.length > 120 ? 'text-red-500' : 'text-slate-400'}`}>
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
                <div className="flex justify-between mb-2">
                  <label htmlFor="description" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Full Description</label>
                  {errors.description && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.description}</span>}
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
