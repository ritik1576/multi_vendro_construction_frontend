import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VendorLayout from '../../components/vendor/VendorLayout';
import {
  Package, Banknote, AlertTriangle, AlertCircle,
  Search, ChevronDown, X, Eye, IndianRupee, Image as ImageIcon, Plus, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { PRODUCT_CATEGORIES, normalizeCategory } from '../../constants/productCategories';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!user?.vendorId) {
        setIsLoading(false);
        setError('Vendor ID not found. Please log in again.');
        return;
      }
      try {
        setIsLoading(true);
        const response = await productService.getVendorProducts(user.vendorId);
        setInventoryData(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch inventory.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  const getProductStatus = (product) => {
    const stock = Number(product.stockQuantity ?? product.qty ?? 0);
    if (stock <= 0 || product.inStock === false || product.inStock === 'false') return 'OUT OF STOCK';
    if (stock <= 20) return 'LOW STOCK';
    return 'ACTIVE';
  };

  const getProductPrice = (product) => Number(product.price || 0);
  const getProductName = (product) => product.name || product.productName || product.ProductName || 'Unnamed Product';
  const getProductCategory = (product) => normalizeCategory(product.category || product.categoryName);

  const calculateKPIs = () => {
    let totalValue = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventoryData.forEach(item => {
      const status = getProductStatus(item);
      const stock = Number(item.stockQuantity || item.qty || 0);
      const price = getProductPrice(item);
      totalValue += (price * stock);

      if (status === 'LOW STOCK') lowStock++;
      if (status === 'OUT OF STOCK') outOfStock++;
    });

    const formattedValue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(totalValue);

    return [
      { title: 'Total Products', value: inventoryData.length.toString(), icon: Package, iconBg: 'bg-slate-50', iconColor: 'text-[#0F172A]' },
      { title: 'Total Value (₹)', value: formattedValue, icon: Banknote, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { title: 'Low Stock', value: lowStock.toString(), icon: AlertTriangle, iconBg: 'bg-orange-50', iconColor: 'text-[#EA580C]' },
      { title: 'Out of Stock', value: outOfStock.toString(), icon: AlertCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
    ];
  };

  const kpis = calculateKPIs();

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = getProductName(item).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || getProductCategory(item) === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || getProductStatus(item) === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <VendorLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Inventory Management</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Enterprise-grade tracking for infrastructure supplies.</p>
          </div>
          <Link
            to="/vendor/products/add"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2 text-sm font-extrabold text-white transition-colors hover:bg-[#172554] shadow-sm w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.title}</p>
                  <h3 className="text-2xl font-extrabold text-[#0F172A] leading-none">
                    {kpi.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inventory Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, SKU or category..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative w-full md:w-48">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">Stock Status</option>
                <option value="ACTIVE">Active</option>
                <option value="LOW STOCK">Low Stock</option>
                <option value="OUT OF STOCK">Out of Stock</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        {(selectedCategory !== 'All' || selectedStatus !== 'All' || searchTerm) && (
          <div className="flex items-center gap-3 flex-wrap">
            {selectedCategory !== 'All' && (
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-[#F97316]">
                  <span className="text-orange-700/70 mr-1">Category:</span>
                  {selectedCategory}
                </span>
                <button onClick={() => setSelectedCategory('All')} className="ml-2 p-0.5 rounded-full hover:bg-orange-200 text-[#F97316] transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedStatus !== 'All' && (
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-[#F97316]">
                  <span className="text-orange-700/70 mr-1">Status:</span>
                  {selectedStatus === 'ACTIVE' ? 'Active' : selectedStatus === 'LOW STOCK' ? 'Low Stock' : 'Out of Stock'}
                </span>
                <button onClick={() => setSelectedStatus('All')} className="ml-2 p-0.5 rounded-full hover:bg-orange-200 text-[#F97316] transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {searchTerm && (
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-[#F97316]">
                  <span className="text-orange-700/70 mr-1">Search:</span>
                  "{searchTerm}"
                </span>
                <button onClick={() => setSearchTerm('')} className="ml-2 p-0.5 rounded-full hover:bg-orange-200 text-[#F97316] transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <button onClick={clearAllFilters} className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-200 hover:bg-slate-300 transition-colors rounded-full px-3 py-1">
              Clear all
            </button>
          </div>
        )}

        {/* Inventory Table Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Unit Price (₹)</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Available Qty</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10">
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-50 mb-5">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E3A8A] border-r-transparent"></div>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Loading inventory...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10">
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600 mb-5">
                          <AlertCircle className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? filteredData.map((item) => (
                  <tr key={item.id || item.productId || Math.random()} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-[#0F172A] text-[14px] group-hover:text-[#EA580C] transition-colors cursor-pointer">
                        {getProductName(item)}
                      </div>
                      {getProductCategory(item) && (
                        <div className="text-[12px] font-medium text-slate-500 mt-0.5">{getProductCategory(item)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getProductStatus(item) === 'ACTIVE' && (
                        <span className="inline-flex items-center rounded bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase text-emerald-700">
                          Active
                        </span>
                      )}
                      {getProductStatus(item) === 'LOW STOCK' && (
                        <span className="inline-flex items-center rounded bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase text-amber-700">
                          Low Stock
                        </span>
                      )}
                      {getProductStatus(item) === 'OUT OF STOCK' && (
                        <span className="inline-flex items-center rounded bg-red-50 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase text-red-700">
                          Out Of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[14px] font-extrabold text-slate-700">
                      ₹{getProductPrice(item).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[14px] font-extrabold ${getProductStatus(item) === 'OUT OF STOCK' ? 'text-red-500' : 'text-[#0F172A]'}`}>
                        {item.stockQuantity ?? item.qty ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/vendor/products/edit/${item.id || item.productId}`}
                        state={{ product: item }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-[#0F172A] text-[12px] font-extrabold rounded-lg shadow-sm transition-colors" title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        View
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10">
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-[#EA580C] mb-5">
                          <Package className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">No products match your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-slate-500">
              Showing <span className="font-extrabold text-slate-700">{filteredData.length > 0 ? 1 : 0}-{filteredData.length}</span> of <span className="font-extrabold text-slate-700">{filteredData.length}</span> results
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Rows per page:</span>
                <button className="flex items-center gap-1 text-sm font-extrabold text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1">
                  10 <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors" disabled>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1E3A8A] text-white font-extrabold text-sm">
                  1
                </button>
                <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors" disabled>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </VendorLayout>
  );
};

export default Inventory;
