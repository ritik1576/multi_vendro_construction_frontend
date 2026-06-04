import { useMemo, useState, useEffect } from 'react';
import { BACKEND_URL } from '../../services/apiConstants';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsRequest } from '../../redux/productActions';
import { addToCartRequest, updateCartItemRequest, removeCartItemRequest } from '../../redux/cartActions';
import { formatCurrency } from '../../context/cartUtils';
import { ChevronRight, Minus, Plus, Search, SlidersHorizontal, ShoppingCart, Star, X } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import { getLocalProductImage, fallbackImage } from '../../utils/productImages';

const availability = ['In Stock', 'Limited Stock', 'Out of Stock'];

const defaultFilters = {
  category: 'All',
  vendor: '',
  status: '',
  minPrice: '',
  maxPrice: '',
  discountedOnly: false,
};

const statusStyles = {
  'In Stock': 'bg-emerald-100 text-emerald-700',
  'Limited Stock': 'bg-yellow-100 text-yellow-800',
  'Out of Stock': 'bg-red-100 text-red-700',
};

function ProductImage({ alt, src }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const imageSrc = !src || failedSrc === src ? fallbackImage : src;

  return (
    <img
      alt={alt || 'Product image'}
      className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
      onError={() => setFailedSrc(src)}
      src={imageSrc}
    />
  );
}

function FilterSection({ title, children }) {
  return (
    <section className="border-b border-slate-200 py-5 last:border-b-0">
      <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

const getTextValue = (value) => (value ?? '').toString().toLowerCase();

const getNumericPrice = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  const parsedPrice = Number((value ?? '').toString().replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
};

const getUniqueOptions = (items, field) =>
  Array.from(new Set(items.map((item) => item?.[field]).filter(Boolean))).sort((a, b) =>
    a.toString().localeCompare(b.toString())
  );

const isProductDiscounted = (product) =>
  Number(product?.discountPercent || 0) > 0 ||
  (Boolean(product?.discountPrice) && getNumericPrice(product?.discountPrice) < getNumericPrice(product?.price));

function Filters({
  categoryOptions,
  filters,
  onCategoryChange,
  onDiscountedChange,
  onMaxPriceChange,
  onMinPriceChange,
  onResetFilters,
  onStatusChange,
  onVendorChange,
  vendorOptions,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 py-4">
        <h2 className="text-sm font-extrabold text-[#0F172A]">Filters</h2>
        <button
          className="rounded-lg px-2 py-1 text-xs font-extrabold text-[#F97316] transition hover:bg-orange-50"
          onClick={onResetFilters}
          type="button"
        >
          Reset
        </button>
      </div>

      <FilterSection title="Category">
        <div className="grid gap-1">
          {categoryOptions.map((category) => (
            <button
              className={`rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                filters.category === category ? 'bg-orange-50 text-[#F97316]' : 'text-slate-700 hover:bg-slate-50'
              }`}
              key={category}
              onClick={() => onCategoryChange(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="grid grid-cols-2 gap-2">
          <input
            className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1E3A8A]"
            min="0"
            onChange={(event) => onMinPriceChange(event.target.value)}
            placeholder="Min"
            type="number"
            value={filters.minPrice}
          />
          <input
            className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1E3A8A]"
            min="0"
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder="Max"
            type="number"
            value={filters.maxPrice}
          />
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="grid gap-3">
          {availability.map((status) => (
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700" key={status}>
              <input
                checked={filters.status === status}
                className="h-4 w-4 accent-[#F97316]"
                name="availability-status"
                onChange={() => onStatusChange(filters.status === status ? '' : status)}
                type="radio"
              />
              {status}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Vendor">
        <div className="grid gap-3">
          {vendorOptions.map((vendor) => (
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700" key={vendor}>
              <input
                checked={filters.vendor === vendor}
                className="h-4 w-4 accent-[#F97316]"
                name="vendor"
                onChange={() => onVendorChange(filters.vendor === vendor ? '' : vendor)}
                type="radio"
              />
              {vendor}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Discount">
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <input
            checked={filters.discountedOnly}
            className="h-4 w-4 accent-[#F97316]"
            onChange={(event) => onDiscountedChange(event.target.checked)}
            type="checkbox"
          />
          Discounted products only
        </label>
      </FilterSection>
    </div>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const cartItems = Array.isArray(cart) ? cart : (cart?.data?.items || cart?.items || []);
  
  const productName = product.name || 'Product name not available';
  const category = product.category || 'Category not available';
  const vendor = product.vendorName || product.vendor || 'InfraMart Direct';
  const numPrice = Number(product.price || 0);
  const numDiscountPrice = Number(product.discountPrice || 0);
  const hasValidDiscount = numDiscountPrice > 0 && numDiscountPrice < numPrice;

  const price = formatCurrency(numPrice);
  const discountedPrice = formatCurrency(hasValidDiscount ? numDiscountPrice : numPrice);
  const shortDescription = product.shortDescription || 'No short description available';
  const status = product.status || 'In Stock';
  const unit = product.unit || 'Unit not available';
  
  const cartItem = cartItems.find((item) => {
    const cartName = (item.productName || item.productname || item.name || '').toLowerCase();
    const prodName = (product.ProductName || product.name || '').toLowerCase();
    return cartName === prodName && prodName !== '';
  });
  const quantity = cartItem?.quantity || 1;

  const openProduct = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    const nameToUse = product.ProductName || product.name;
    navigate(`/product/${encodeURIComponent(nameToUse)}`);
  };
  
  const handleAddToCart = (event) => {
    event.stopPropagation();
    dispatch(addToCartRequest({ productname: product.ProductName || product.name, quantity: 1 }));
  };
  
  const handleDecreaseQuantity = (event) => {
    event.stopPropagation();
    if (cartItem && (cartItem.id || cartItem.cartItemId)) {
       if (quantity > 1) {
         dispatch(updateCartItemRequest({ 
           cartitemID: cartItem.id || cartItem.cartItemId,
           productname: product.ProductName || product.name,
           quantity: quantity - 1 
         }));
       } else {
         dispatch(removeCartItemRequest(cartItem.id || cartItem.cartItemId));
       }
    }
  };
  
  const handleIncreaseQuantity = (event) => {
    event.stopPropagation();
    if (cartItem && (cartItem.id || cartItem.cartItemId)) {
       dispatch(updateCartItemRequest({ 
         cartitemID: cartItem.id || cartItem.cartItemId,
         productname: product.ProductName || product.name,
         quantity: quantity + 1 
       }));
    }
  };
  
  const handleGoToCart = (event) => {
    event.stopPropagation();
    navigate('/cart');
  };

  const resolveImageUrl = (product) => {
    return getLocalProductImage(product);
  };

  return (
    <article
      className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E3A8A]/30 hover:shadow-lg"
    >
      {/* Uniform Square Image Container */}
      <div className="relative flex aspect-square w-full items-center justify-center bg-white p-6 transition-colors duration-500 group-hover:bg-slate-50 border-b border-slate-100">
        <ProductImage alt={productName} src={resolveImageUrl(product)} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-colors group-hover:bg-[#1E3A8A]/10 group-hover:text-[#1E3A8A]">
              {category}
            </span>
            <span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
              status === 'In Stock' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 
              status === 'Limited Stock' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' : 
              'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
            }`}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{Number(product.rating || 0).toFixed(1)}</span>
            <span className="font-semibold text-slate-400">({product.reviews || 0})</span>
          </div>
        </div>

        {/* Fixed heights for title and description to align all cards uniformly */}
        <h3 className="line-clamp-2 h-[2.75rem] text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-[#1E3A8A]">
          {productName}
        </h3>
        
        <p className="mt-2 line-clamp-2 h-[2.5rem] text-xs font-medium leading-relaxed text-slate-500">
          {shortDescription}
        </p>
        
        <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm"></span>
          {vendor}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              {hasValidDiscount && price !== discountedPrice ? (
                <>
                  <span className="text-xl font-black tracking-tight text-[#0F172A]">{discountedPrice}</span>
                  <span className="text-xs font-bold text-slate-400 line-through decoration-slate-300">{price}</span>
                </>
              ) : (
                <span className="text-xl font-black tracking-tight text-[#0F172A]">{price}</span>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400">per {unit}</p>
          </div>

          <hr className="my-4 border-slate-100" />

          <div className={`grid gap-3 ${cartItem ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {cartItem ? (
              <div className="flex h-10 items-center justify-between overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-colors focus-within:border-[#1E3A8A] hover:bg-white">
                <button
                  aria-label={`Decrease quantity of ${productName}`}
                  className="grid h-full w-12 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  onClick={handleDecreaseQuantity}
                  type="button"
                >
                  <Minus className="h-4 w-4" strokeWidth={3} />
                </button>
                <span className="min-w-[1.5rem] text-center text-sm font-extrabold text-[#0F172A]">{quantity}</span>
                <button
                  aria-label={`Increase quantity of ${productName}`}
                  className="grid h-full w-12 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  onClick={handleIncreaseQuantity}
                  type="button"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <>
                <button 
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-2 text-xs font-extrabold text-white transition-all duration-200 hover:bg-[#172554] hover:shadow-md active:scale-95" 
                  onClick={handleAddToCart} 
                  type="button"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add to Cart
                </button>
                <button 
                  className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-extrabold text-[#1E3A8A] transition-all duration-200 hover:border-[#1E3A8A] hover:bg-slate-50 hover:shadow-sm active:scale-95" 
                  onClick={openProduct} 
                  type="button"
                >
                  Details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ListingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm" key={index} />
      ))}
    </div>
  );
}

function ProductListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useDispatch();
  const { products = [], loading: isLoading, error } = useSelector((state) => state.product);

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
      const searchableText = [
        product?.name,
        product?.category,
        product?.vendor,
        product?.shortDescription,
        product?.description,
      ]
        .map(getTextValue)
        .join(' ');

      const productPrice = getNumericPrice(product?.discountPrice || product?.price);
      const actualStatus = product?.status || 'In Stock';
      const actualVendor = product?.vendor || 'InfraMart Direct';
      
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory = filters.category === 'All' || product?.category === filters.category;
      const matchesVendor = !filters.vendor || actualVendor === filters.vendor;
      const matchesStatus = !filters.status || actualStatus === filters.status;
      const matchesMinPrice = minPrice === null || productPrice >= minPrice;
      const matchesMaxPrice = maxPrice === null || productPrice <= maxPrice;
      const matchesDiscount = !filters.discountedOnly || isProductDiscounted(product);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesVendor &&
        matchesStatus &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesDiscount
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link className="hover:text-[#F97316]" to="/">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Catalog</span>
        </nav>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#F97316]">InfraMart Catalog</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A] md:text-4xl">
                Construction Materials
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Source verified cement, steel, plywood, tiles, paints, electrical, and plumbing supplies for project-scale procurement.
              </p>
            </div>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-[#1E3A8A] shadow-sm lg:hidden" onClick={() => setIsFilterOpen(true)} type="button">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="mt-6">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#1E3A8A] focus:bg-white"
                id="product-search"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by product, category, vendor, or description"
                type="search"
                value={searchTerm}
              />
              {searchTerm && (
                <button
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-[#F97316]"
                  onClick={() => setSearchTerm('')}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {categoryOptions.map((category) => (
              <button
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${
                  filters.category === category ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-[#F97316]'
                }`}
                key={category}
                onClick={() => setFilterValue('category', category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <Filters
              categoryOptions={categoryOptions}
              filters={filters}
              onCategoryChange={(category) => setFilterValue('category', category)}
              onDiscountedChange={(discountedOnly) => setFilterValue('discountedOnly', discountedOnly)}
              onMaxPriceChange={(maxPrice) => setFilterValue('maxPrice', maxPrice)}
              onMinPriceChange={(minPrice) => setFilterValue('minPrice', minPrice)}
              onResetFilters={resetFilters}
              onStatusChange={(status) => setFilterValue('status', status)}
              onVendorChange={(vendor) => setFilterValue('vendor', vendor)}
              vendorOptions={vendorOptions}
            />
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Showing <span className="font-extrabold text-[#0F172A]">{filteredProducts.length}</span>{' '}
                {filters.category === 'All' ? 'products' : `${filters.category} products`}
              </p>
              <select
                className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-[#1E3A8A]"
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
              >
                <option value="relevance">Sort by relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated</option>
              </select>
            </div>

            {isLoading && <ListingSkeleton />}

            {!isLoading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-extrabold text-[#0F172A]">No products found</h2>
                <p className="mt-2 text-sm text-slate-600">Try another search term or adjust filters.</p>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/50 lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-[#F8FAFC] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Filters</h2>
              <button className="grid h-10 w-10 place-items-center rounded-lg bg-white text-slate-700 shadow-sm" onClick={() => setIsFilterOpen(false)} type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Filters
              categoryOptions={categoryOptions}
              filters={filters}
              onCategoryChange={(category) => setFilterValue('category', category)}
              onDiscountedChange={(discountedOnly) => setFilterValue('discountedOnly', discountedOnly)}
              onMaxPriceChange={(maxPrice) => setFilterValue('maxPrice', maxPrice)}
              onMinPriceChange={(minPrice) => setFilterValue('minPrice', minPrice)}
              onResetFilters={resetFilters}
              onStatusChange={(status) => setFilterValue('status', status)}
              onVendorChange={(vendor) => setFilterValue('vendor', vendor)}
              vendorOptions={vendorOptions}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListing;
