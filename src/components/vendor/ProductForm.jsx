import { useState, useEffect } from 'react';
import { Save, X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ mode = 'add', initialData = null }) => {
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
      // Optional: set initial image preview if available in initialData
      if (initialData.image) setImagePreview(initialData.image);
    }
  }, [initialData, mode]);

  useEffect(() => {
    // Reactive validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand/Vendor is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';

    const price = Number(formData.price);
    if (!formData.price || price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.discountPrice) {
      const discount = Number(formData.discountPrice);
      if (discount >= price) {
        newErrors.discountPrice = 'Discount price must be less than price';
      } else if (discount < 0) {
        newErrors.discountPrice = 'Discount price cannot be negative';
      }
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }

    if (!formData.shortDescription || formData.shortDescription.length > 120) {
      newErrors.shortDescription = 'Short description is required (max 120 chars)';
    }

    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log('Form data to submit:', { ...formData, image: imagePreview });
      navigate('/vendor/dashboard');
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

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 border-b border-slate-200 pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fill in the details below to {mode === 'add' ? 'create a new product' : 'update this product'}.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Image Upload & General Specs */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Product Image</label>
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-[#1E3A8A] hover:bg-slate-100 h-48">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">Click to upload</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="brand" className="mb-2 block text-sm font-bold text-slate-700">Brand / Vendor</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`block w-full min-h-11 rounded-lg border ${errors.brand ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
              placeholder="e.g., UltraTech"
            />
            {errors.brand && <p className="mt-1 text-xs font-bold text-red-500">{errors.brand}</p>}
          </div>

          <div>
            <label htmlFor="sku" className="mb-2 block text-sm font-bold text-slate-700">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`block w-full min-h-11 rounded-lg border ${errors.sku ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
              placeholder="e.g., CEM-UTC-50"
            />
            {errors.sku && <p className="mt-1 text-xs font-bold text-red-500">{errors.sku}</p>}
          </div>
        </div>

        {/* Right Column: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-700">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full min-h-11 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
                placeholder="e.g., UltraTech Cement 50kg"
              />
              {errors.name && <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-bold text-slate-700">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`block w-full min-h-11 rounded-lg border ${errors.category ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
              >
                <option value="">Select Category</option>
                <option value="Cement">Cement</option>
                <option value="Steel">Steel</option>
                <option value="Plywood">Plywood</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
              </select>
              {errors.category && <p className="mt-1 text-xs font-bold text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="unit" className="mb-2 block text-sm font-bold text-slate-700">Unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`block w-full min-h-11 rounded-lg border ${errors.unit ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
                placeholder="e.g., Bag, Piece, Kg"
              />
              {errors.unit && <p className="mt-1 text-xs font-bold text-red-500">{errors.unit}</p>}
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-bold text-slate-700">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`block w-full min-h-11 rounded-lg border ${errors.price ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-xs font-bold text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="discountPrice" className="mb-2 block text-sm font-bold text-slate-700">Discount Price (₹)</label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`block w-full min-h-11 rounded-lg border ${errors.discountPrice ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
                placeholder="0.00"
              />
              {errors.discountPrice && <p className="mt-1 text-xs font-bold text-red-500">{errors.discountPrice}</p>}
            </div>

            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-bold text-slate-700">Available Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`block w-full min-h-11 rounded-lg border ${errors.stock ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all`}
                placeholder="0"
              />
              {errors.stock && <p className="mt-1 text-xs font-bold text-red-500">{errors.stock}</p>}
            </div>
            
            {/* Empty div for alignment if needed, or stock spans 1 */}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="shortDescription" className="block text-sm font-bold text-slate-700">Short Description</label>
              <span className={`text-xs font-medium ${formData.shortDescription.length > 120 ? 'text-red-500' : 'text-slate-500'}`}>
                {formData.shortDescription.length}/120
              </span>
            </div>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              className={`block w-full rounded-lg border ${errors.shortDescription ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all resize-none`}
              placeholder="Brief summary for product card..."
            ></textarea>
            {errors.shortDescription && <p className="mt-1 text-xs font-bold text-red-500">{errors.shortDescription}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-bold text-slate-700">Full Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'} px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all resize-none`}
              placeholder="Provide a detailed description of the product (minimum 20 characters)..."
            ></textarea>
            {errors.description && <p className="mt-1 text-xs font-bold text-red-500">{errors.description}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={() => navigate('/vendor/dashboard')}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-extrabold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200/50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-extrabold text-white transition-all focus:outline-none focus:ring-4 shadow-sm
            ${isFormValid 
              ? 'bg-[#1E3A8A] hover:bg-[#172554] focus:ring-[#1E3A8A]/30 cursor-pointer' 
              : 'bg-slate-300 cursor-not-allowed text-slate-500'}`}
        >
          <Save className="h-4 w-4" />
          {mode === 'add' ? 'Save Product' : 'Update Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
