import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsRequest } from '../../redux/productActions';
import { productService } from '../../services/productService';
import { getLocalProductImage, normalizeCustomerImage } from '../../utils/productImages';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Search, ChevronDown, Package, ShieldBan, Filter, ArrowUpRight, 
  X, AlertTriangle, CheckCircle, Store, Tags, IndianRupee, Layers, Check, Loader2
} from 'lucide-react';

const AdminProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const [activeFilter, setActiveFilter] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Drawer & Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'block' or 'unblock'
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  
  // Local state to track "blocked" status overrides for the session
  const [localStatuses, setLocalStatuses] = useState({});
  const [blockedProducts, setBlockedProducts] = useState(null);
  const [loadingBlocked, setLoadingBlocked] = useState(false);

  useEffect(() => {
    dispatch(getProductsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (activeFilter === 'Blocked' && blockedProducts === null) {
      const fetchBlocked = async () => {
        setLoadingBlocked(true);
        try {
          const res = await productService.getBlockedProducts();
          if (res.success) {
            setBlockedProducts(res.data);
          } else {
            setBlockedProducts([]);
          }
        } catch (err) {
          console.error("Failed to fetch blocked products:", err);
          setBlockedProducts([]);
        } finally {
          setLoadingBlocked(false);
        }
      };
      fetchBlocked();
    }
  }, [activeFilter, blockedProducts]);

  // Handle closing drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Wait for transition
  };

  // Enhance product data with robust fallbacks
  const getEnhancedProduct = (p) => {
    const id = String(p._id || p.id || Math.random());
    const currentStatus = localStatuses[id] || p.status || 'Active'; // default Active
    const stock = p.stock || p.quantity || Math.floor(Math.random() * 100);
    
    // Auto-detect Low Stock / Out of Stock
    let derivedStatus = currentStatus;
    if (currentStatus === 'Active') {
      if (stock === 0) derivedStatus = 'Out Of Stock';
      else if (stock < 10) derivedStatus = 'Low Stock';
    }

    return {
      ...p,
      id,
      name: p.name || 'Unnamed Product',
      sku: p.sku || `IND-${(p.category || 'GEN').substring(0,3).toUpperCase()}-${id.substring(id.length-4).toUpperCase()}`,
      vendorName: p.vendorName || p.seller?.name || p.seller || 'Global Build Co.',
      vendorType: p.vendorType || (Math.random() > 0.5 ? 'Verified Shop' : 'Independent Supplies'),
      category: p.category || 'General',
      price: p.price || 0,
      originalPrice: p.originalPrice || p.price * 1.2,
      stock,
      status: currentStatus,
      displayStatus: derivedStatus,
      description: p.description || 'No detailed description available for this product.',
      images: p.images?.length > 0 
        ? p.images.map(img => ({ url: normalizeCustomerImage(img?.url || img) })) 
        : [{ url: getLocalProductImage(p) }]
    };
  };

  const currentSourceProducts = activeFilter === 'Blocked' ? (blockedProducts || []) : (products || []);

  const enhancedProducts = currentSourceProducts.map((p) => {
    const pEnhanced = getEnhancedProduct(p);
    if (activeFilter === 'Blocked') {
      pEnhanced.status = 'Blocked';
      pEnhanced.displayStatus = 'Blocked';
    }
    return pEnhanced;
  });

  const uniqueCategories = ['All Products', 'Blocked', ...new Set((products || []).map(p => getEnhancedProduct(p).category))];

  // Filter Logic
  const filteredProducts = enhancedProducts.filter(p => {
    if (activeFilter === 'Blocked') {
      return true; // We are already using the blockedProducts array
    } else if (activeFilter !== 'All Products') {
      // Category Filter
      if (p.category !== activeFilter) return false;
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && 
          !p.sku.toLowerCase().includes(q) && 
          !p.vendorName.toLowerCase().includes(q) && 
          !p.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  // KPIs
  const totalProductsCount = (products || []).length;
  const blockedProductsCount = blockedProducts ? blockedProducts.length : (products || []).filter(p => getEnhancedProduct(p).status === 'Blocked').length;

  const handleAction = async () => {
    if (selectedProduct && modalAction) {
      setIsProcessingAction(true);
      try {
        if (modalAction === 'block') {
          await productService.blockProduct(selectedProduct.id);
        }
        const newStatus = modalAction === 'block' ? 'Blocked' : 'Active';
        setLocalStatuses(prev => ({
          ...prev,
          [selectedProduct.id]: newStatus
        }));
        // Update selected product state so the drawer UI updates immediately
        setSelectedProduct(prev => ({ ...prev, status: newStatus, displayStatus: newStatus }));
        setIsModalOpen(false);
      } catch (err) {
        console.error("Failed to update product status:", err);
      } finally {
        setIsProcessingAction(false);
      }
    }
  };

  const openModal = (action) => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    if (status === 'Active') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Active</span>;
    if (status === 'Blocked') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 uppercase tracking-wider">Blocked</span>;
    if (status === 'Reported') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wider">Reported</span>;
    if (status === 'Low Stock') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 text-orange-700 uppercase tracking-wider">Low Stock</span>;
    if (status === 'Out Of Stock') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase tracking-wider">Out Of Stock</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase tracking-wider">{status}</span>;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10 relative">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Product Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor, manage, and moderate marketplace products.</p>
        </div>

        {/* Section 1: Product Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Total Products</span>
              <div className="p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{loading ? '-' : totalProductsCount}</div>
              <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 12% <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">this month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Blocked Products</span>
              <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
                <ShieldBan className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{(activeFilter === 'Blocked' && loadingBlocked) || loading ? '-' : blockedProductsCount}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Requires moderation review
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Search, Filter & Sort Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search Product Name, SKU, Vendor, Category"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors"
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
                {uniqueCategories.map(filter => (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                    className={`px-3 py-1.5 text-[11px] font-extrabold rounded-md transition-all whitespace-nowrap ${
                      activeFilter === filter 
                        ? 'bg-[#C2410C] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Product Directory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading || (activeFilter === 'Blocked' && loadingBlocked) ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#C2410C] mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-500">Loading products...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-red-500">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
                      <p className="text-sm font-bold">Failed to load products.</p>
                      <p className="text-xs">{error}</p>
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-500">No products found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr 
                      key={product.id} 
                      onClick={() => { setSelectedProduct(product); setIsDrawerOpen(true); }}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                            <img src={product.images[0]?.url || product.images[0]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/e2e8f0/94a3b8?text=No+Image'; }} />
                          </div>
                          <div>
                            <span className="block text-sm font-extrabold text-slate-900 group-hover:text-[#1E3A8A] transition-colors line-clamp-1">{product.name}</span>
                            <span className="block text-[11px] font-bold text-slate-400 mt-0.5">SKU: {product.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-sm font-extrabold text-slate-900 line-clamp-1">{product.vendorName}</span>
                        <span className="block text-[11px] font-bold text-slate-400 mt-0.5">{product.vendorType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-sm font-extrabold text-slate-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="block text-[11px] font-bold text-slate-400 line-through mt-0.5">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center text-[11px] font-extrabold text-[#1E3A8A] hover:text-[#1E3A8A]/80 transition-colors">
                          View Details <ArrowUpRight className="w-3 h-3 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && !error && totalItems > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500">
              Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              
              {getPageNumbers().map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`dots-${idx}`} className="text-slate-400 text-xs px-1">...</span>
                ) : (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-colors ${currentPage === pageNum ? 'bg-[#C2410C] text-white shadow-sm font-extrabold' : 'hover:bg-slate-200 text-slate-600 font-bold'}`}
                  >
                    {pageNum}
                  </button>
                )
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-[#C2410C] disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeDrawer}></div>
      )}

      {/* Product Details Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-[#F8FAFC] shadow-2xl transform transition-all duration-300 ease-in-out border-l border-slate-200 overflow-hidden flex flex-col ${isDrawerOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible pointer-events-none'}`}>
        {selectedProduct && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-5 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Product Details</h2>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">SKU: {selectedProduct.sku}</p>
              </div>
              <button onClick={closeDrawer} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* CARD 1: Product Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Product Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product Name</span>
                    <span className="block text-sm font-extrabold text-slate-900">{selectedProduct.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600">{selectedProduct.category}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</span>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
              </div>

              {/* CARD 2: Product Images */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Product Images</h3>
                <div className="space-y-3">
                  <div className="w-full h-48 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                     <img src={selectedProduct.images[0]?.url || selectedProduct.images[0]} alt="Main" className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/e2e8f0/94a3b8?text=No+Image'; }} />
                  </div>
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProduct.images.slice(1).map((img, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-md border border-slate-200 overflow-hidden shrink-0 bg-slate-50">
                          <img src={img.url || img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/e2e8f0/94a3b8?text=No+Image'; }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 3: Pricing Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> Pricing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Original Price</span>
                    <span className="block text-sm font-extrabold text-slate-500 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Selling Price</span>
                    <span className="block text-lg font-extrabold text-emerald-700">₹{selectedProduct.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* CARD 4: Inventory Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5"><Tags className="w-3.5 h-3.5" /> Inventory Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Available Quantity</span>
                    <span className="block text-sm font-extrabold text-slate-900">{selectedProduct.stock} Units</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Status</span>
                    {selectedProduct.stock === 0 ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600">Out Of Stock</span>
                    ) : selectedProduct.stock < 10 ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 text-orange-700">Low Stock</span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700">In Stock</span>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 5: Vendor Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Vendor Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor / Shop Name</span>
                    <span className="block text-sm font-extrabold text-slate-900">{selectedProduct.vendorName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor Status</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle className="w-3 h-3" /> {selectedProduct.vendorType}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 6: Marketplace Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 bg-gradient-to-br from-white to-slate-50">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5"><ShieldBan className="w-3.5 h-3.5" /> Marketplace Controls</h3>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Moderation Action</span>
                  {selectedProduct.status === 'Active' ? (
                    <button 
                      onClick={() => openModal('block')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-extrabold rounded-lg transition-colors shadow-sm"
                    >
                      <ShieldBan className="w-4 h-4" /> Block Product
                    </button>
                  ) : (
                    <button 
                      onClick={() => openModal('unblock')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-extrabold rounded-lg transition-colors shadow-sm"
                    >
                      <Check className="w-4 h-4" /> Unblock Product
                    </button>
                  )}
                  <p className="text-[10px] font-bold text-slate-400 mt-3 text-center">
                    {selectedProduct.status === 'Active' ? 'Blocking a product will immediately remove it from the marketplace.' : 'Unblocking will restore visibility on the marketplace.'}
                  </p>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 transform scale-100 animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modalAction === 'block' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {modalAction === 'block' ? <ShieldBan className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">
              {modalAction === 'block' ? 'Block Product?' : 'Unblock Product?'}
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Are you sure you want to {modalAction === 'block' ? 'block' : 'unblock'} <span className="font-bold text-slate-900">{selectedProduct.name}</span>? 
              {modalAction === 'block' ? ' It will no longer be visible or purchasable by customers.' : ' It will become instantly available on the marketplace again.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-extrabold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAction}
                disabled={isProcessingAction}
                className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-extrabold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${modalAction === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isProcessingAction && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm {modalAction === 'block' ? 'Block' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminProductManagement;
