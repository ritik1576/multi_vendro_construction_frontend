import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import ProductImageUploader from './ProductImageUploader';
import { PRODUCT_CATEGORIES, normalizeCategory } from '../../constants/productCategories';


const ProductForm = ({ mode = 'add', initialData = null, onCancel, onSave, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    sku: '',
    unit: '',
    shortDescription: '',
    description: '',
    technicalSpecifications: '',
    moq: '',
    weight: '',
    color: '',
    size: '',
    grade: '',
    material: '',
    warranty: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      const mappedCategory = normalizeCategory(initialData.category);
      setFormData((prev) => ({ ...prev, ...initialData, category: mappedCategory }));
      if (initialData.thumbnail) {
        setImageFiles([initialData.thumbnail]);
      }
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
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (!formData.shortDescription) newErrors.shortDescription = 'Short Description is required';
    if (imageFiles.length === 0) newErrors.images = 'At least 1 product image is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});

    const price = Number(formData.price || 0);
    const quantity = Number(formData.stock || 0);
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const payload = {
      name: formData.name,
      slug: slug,
      shortDescription: formData.shortDescription,
      description: formData.description,
      technicalSpecifications: formData.technicalSpecifications,
      price: price,
      thumbnail: formData.thumbnail || '',
      inStock: quantity > 0,
      createdAt: new Date().toISOString(),
      quantity: quantity,
      unit: formData.unit,
      category: formData.category
    };

    if (formData.sku && formData.sku.trim() !== '') {
      payload.sku = formData.sku;
    }

    if (onSave) {
      onSave(payload, imageFiles);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const inputBaseClass = "block w-full min-h-[44px] rounded-lg border px-4 py-2.5 text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 transition-all bg-slate-50 focus:bg-white placeholder-slate-400 font-medium";
  const getErrorClass = (field) => errors[field] ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20 hover:border-slate-300";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-7xl pb-10">
      
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0F172A]">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500 max-w-3xl leading-relaxed">
            {mode === 'add' ? 'Create a professional product listing for customers. Upload images, inventory details, pricing, and specifications.' : 'Update this product information to keep your catalog accurate and up to date.'}
          </p>
        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-[35%_65%] items-start">
        {/* Left Column: Product Images */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-[14px] font-extrabold text-[#0F172A] uppercase tracking-wider">Product Images</h3>
              {errors.images && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.images}</span>}
            </div>
            <ProductImageUploader 
              maxImages={4}
              maxSizeMB={5}
              initialImages={imageFiles}
              onImagesChange={(newImages) => setImageFiles(newImages)}
            />
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
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
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

              <div>
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

              <div>
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

              <div>
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


              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="moq" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">MOQ (Optional)</label>
                </div>
                <input
                  type="text"
                  id="moq"
                  name="moq"
                  value={formData.moq}
                  onChange={handleChange}
                  className={`${inputBaseClass} border-slate-200 hover:border-slate-300`}
                  placeholder="e.g. 10 Bags"
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
                  rows={3}
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
                  rows={8}
                  className={`${inputBaseClass} ${getErrorClass('description')} resize-none py-3`}
                  placeholder="Detailed specifications, features, and information..."
                ></textarea>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="technicalSpecifications" className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">Technical Specifications</label>
                  {errors.technicalSpecifications && <span className="text-[11px] font-extrabold text-red-500 tracking-wider uppercase">{errors.technicalSpecifications}</span>}
                </div>
                <textarea
                  id="technicalSpecifications"
                  name="technicalSpecifications"
                  value={formData.technicalSpecifications}
                  onChange={handleChange}
                  rows={6}
                  className={`${inputBaseClass} ${getErrorClass('technicalSpecifications')} resize-none py-3`}
                  placeholder="E.g., Dimensions, Material, Grade..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Product Attributes Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-5 uppercase tracking-wider border-b border-slate-100 pb-3">Product Attributes (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'weight', label: 'Weight', placeholder: 'e.g. 50 kg' },
                { name: 'color', label: 'Color', placeholder: 'e.g. Grey' },
                { name: 'size', label: 'Size', placeholder: 'e.g. 10x10' },
                { name: 'grade', label: 'Grade', placeholder: 'e.g. A' },
                { name: 'material', label: 'Material', placeholder: 'e.g. Steel' },
                { name: 'warranty', label: 'Warranty', placeholder: 'e.g. 1 Year' }
              ].map(attr => (
                <div key={attr.name}>
                  <div className="flex justify-between mb-2">
                    <label htmlFor={attr.name} className="block text-[12px] font-extrabold text-slate-700 uppercase tracking-wider">{attr.label}</label>
                  </div>
                  <input
                    type="text"
                    id={attr.name}
                    name={attr.name}
                    value={formData[attr.name] || ''}
                    onChange={handleChange}
                    className={`${inputBaseClass} border-slate-200 hover:border-slate-300`}
                    placeholder={attr.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-[14px] font-extrabold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-[#0F172A] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-8 py-3 min-w-[180px] text-[14px] font-extrabold text-white shadow-sm transition-colors hover:bg-[#172554] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSubmitting ? 'Saving...' : mode === 'add' ? 'Save Product' : 'Update Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
