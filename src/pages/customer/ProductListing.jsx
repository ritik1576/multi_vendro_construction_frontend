import React, { useMemo, useState, useEffect, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsRequest } from '../../redux/productActions';
import { getCartRequest } from '../../redux/cartActions';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import FilterSidebar from '../../components/customer/catalog/FilterSidebar';
import ProductToolbar from '../../components/customer/catalog/ProductToolbar';
import ProductGrid from '../../components/customer/catalog/ProductGrid';
import CustomerCouponStrip from '../../features/coupons/components/CustomerCouponStrip';
import { normalizeCategory } from '../../constants/productCategories';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ProductListing ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#fee2e2', color: '#991b1b', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Something went wrong.</h1>
          <p style={{ marginTop: '10px' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const defaultFilters = {
  category: 'All',
  vendor: '',
  status: '',
  minPrice: '',
  maxPrice: '',
  discountedOnly: false,
};

const getTextValue = (value) => (value ?? '').toString().toLowerCase();

const getNumericPrice = (value) => {
  if (typeof value === 'number') {
    return value;
  }
  const parsedPrice = Number((value ?? '').toString().replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
};

const getUniqueOptions = (items, field) =>
  Array.from(new Set((items || []).map((item) => item?.[field]).filter(Boolean))).sort((a, b) =>
    a.toString().localeCompare(b.toString())
  );

const isProductDiscounted = (product) =>
  Number(product?.discountPercent || 0) > 0 ||
  (Boolean(product?.discountPrice) && getNumericPrice(product?.discountPrice) < getNumericPrice(product?.price));

export default function ProductListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 30;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm, sortBy]);

  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product || {});
  const rawProducts = productState.products;
  const products = Array.isArray(rawProducts) ? rawProducts : [];
  const isLoading = productState.loading;
  const error = productState.error;

  useEffect(() => {
    dispatch(getProductsRequest());
    dispatch(getCartRequest());
  }, [dispatch]);

  const categoryOptions = useMemo(() => ['All', ...getUniqueOptions(products, 'category')], [products]);
  const vendorOptions = useMemo(() => getUniqueOptions(products, 'vendor'), [products]);

  const setFilterValue = (key, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
  };

  const clearFilter = (key) => {
    if (key === 'category') setFilterValue('category', 'All');
    else if (key === 'price') { setFilterValue('minPrice', ''); setFilterValue('maxPrice', ''); }
    else if (key === 'status') setFilterValue('status', '');
    else if (key === 'vendor') setFilterValue('vendor', '');
    else if (key === 'discountedOnly') setFilterValue('discountedOnly', false);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const minPriceValue = Number(filters.minPrice);
    const maxPriceValue = Number(filters.maxPrice);
    const minPrice = filters.minPrice === '' || Number.isNaN(minPriceValue) ? null : minPriceValue;
    const maxPrice = filters.maxPrice === '' || Number.isNaN(maxPriceValue) ? null : maxPriceValue;
    
    const hasActiveFilters =
      normalizedSearch ||
      filters.category !== 'All' ||
      filters.vendor ||
      filters.status ||
      minPrice !== null ||
      maxPrice !== null ||
      filters.discountedOnly;

    const filteredList = !hasActiveFilters ? [...products] : products.filter((product) => {
      const productCategory = normalizeCategory(product?.category);
      const searchableText = [
        product?.name,
        productCategory,
        product?.vendor,
        product?.shortDescription,
        product?.description,
      ].map(getTextValue).join(' ');

      const productPrice = getNumericPrice(product?.discountPrice || product?.price);
      const actualStatus = product?.status || 'In Stock';
      const actualVendor = product?.vendor || 'InfraMart Direct';

      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (filters.category === 'All' || productCategory === filters.category) &&
        (!filters.vendor || actualVendor === filters.vendor) &&
        (!filters.status || actualStatus === filters.status) &&
        (minPrice === null || productPrice >= minPrice) &&
        (maxPrice === null || productPrice <= maxPrice) &&
        (!filters.discountedOnly || isProductDiscounted(product))
      );
    });

    if (sortBy === 'price_asc') {
      return filteredList.sort((a, b) => getNumericPrice(a?.discountPrice || a?.price) - getNumericPrice(b?.discountPrice || b?.price));
    }
    if (sortBy === 'price_desc') {
      return filteredList.sort((a, b) => getNumericPrice(b?.discountPrice || b?.price) - getNumericPrice(a?.discountPrice || a?.price));
    }
    if (sortBy === 'rating_desc') {
      return filteredList.sort((a, b) => Number(b?.rating || 0) - Number(a?.rating || 0));
    }

    return filteredList;
  }, [filters, searchTerm, sortBy, products]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const shouldShowPagination = totalProducts > PRODUCTS_PER_PAGE;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">
        <div className="fixed top-0 left-0 w-full z-40">
          <ProductListingNavbar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            categoryOptions={categoryOptions}
            selectedCategory={filters.category}
            onCategoryChange={(category) => setFilterValue('category', category)}
            showCategories={true}
          />
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden pt-[138px]">
          <div className="flex-none">
            <CustomerCouponStrip />
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <FilterSidebar
            categoryOptions={categoryOptions}
            filters={filters}
            onCategoryChange={(category) => setFilterValue('category', category)}
            onDiscountedChange={(discounted) => setFilterValue('discountedOnly', discounted)}
            onMaxPriceChange={(maxPrice) => setFilterValue('maxPrice', maxPrice)}
            onMinPriceChange={(minPrice) => setFilterValue('minPrice', minPrice)}
            onResetFilters={resetFilters}
            onStatusChange={(status) => setFilterValue('status', status)}
            onVendorChange={(vendor) => setFilterValue('vendor', vendor)}
            vendorOptions={vendorOptions}
            sortBy={sortBy}
            setSortBy={setSortBy}
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <button 
              className="lg:hidden w-full mb-6 py-2.5 bg-white border border-slate-300 rounded text-sm font-bold text-slate-700 shadow-sm flex justify-center items-center gap-2 transition hover:bg-slate-50"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              Filters
            </button>

            <ProductGrid 
              products={paginatedProducts} 
              isLoading={isLoading} 
              error={error} 
              viewMode={viewMode}
              onResetFilters={resetFilters}
            />

            {/* Simple Pagination Footer */}
            {!isLoading && !error && shouldShowPagination && (
              <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-400 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >‹</button>
                
                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm ${
                          currentPage === page 
                            ? 'bg-[#1E3A8A] text-white' 
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-slate-400">...</span>;
                  }
                  return null;
                })}

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-400 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >›</button>
              </div>
            )}
          </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
