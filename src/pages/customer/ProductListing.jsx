import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsRequest } from '../../redux/productActions';
import { ChevronRight, Minus, Plus, Search, SlidersHorizontal, ShoppingCart, Star, X } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import { useCart } from '../../context/useCart';
import { fallbackImage } from './productData';

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
  (Boolean(product?.oldPrice) && getNumericPrice(product?.discountedPrice) < getNumericPrice(product?.oldPrice));

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
  const { addToCart, cartItems, decreaseQuantity, increaseQuantity } = useCart();
  const productName = product.name || 'Product name not available';
  const category = product.category || 'Category not available';
  const vendor = product.vendor || 'Vendor not available';
  const price = product.price || 'Price unavailable';
  const discountedPrice = product.discountedPrice || 'Discount not available';
  const shortDescription = product.shortDescription || 'No short description available';
  const status = product.status || 'Status not available';
  const unit = product.unit || 'Unit not available';
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 1;

  const openProduct = () => navigate(`/product/${product.id}`);
  const handleAddToCart = (event) => {
    event.stopPropagation();
    addToCart(product);
  };
  const handleDecreaseQuantity = (event) => {
    event.stopPropagation();
    decreaseQuantity(product.id);
  };
  const handleIncreaseQuantity = (event) => {
    event.stopPropagation();
    increaseQuantity(product.id);
  };
  const handleGoToCart = (event) => {
    event.stopPropagation();
    navigate('/cart');
  };

  return (
    <article
      className="group flex min-h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80"
      onClick={openProduct}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProduct();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-slate-50 p-5">
        <ProductImage alt={productName} src={product.imageUrl} />
        {product.discountPercent && (
          <span className="absolute left-4 top-4 rounded-md bg-[#F97316] px-2 py-1 text-[11px] font-extrabold text-white">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold text-[#F97316]">{category}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
          </span>
        </div>

        <h3 className="mt-4 min-h-14 text-lg font-extrabold leading-snug text-[#0F172A]">{productName}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{shortDescription}</p>
        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">Vendor: {vendor}</p>

        <div className="mt-4 flex items-center gap-2">
          <Star className="h-4 w-4 fill-[#F97316] text-[#F97316]" />
          <span className="text-sm font-bold text-slate-800">{Number(product.rating || 0).toFixed(1)}</span>
          <span className="text-xs font-semibold text-slate-400">({product.reviews || 0})</span>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#1E3A8A]">{discountedPrice}</span>
            {product.oldPrice && <span className="text-sm font-bold text-slate-400 line-through">{price}</span>}
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500">per {unit}</p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          {cartItem ? (
            <>
              <div className="flex min-h-10 items-center justify-between overflow-hidden rounded-lg border border-slate-200 bg-white">
                <button
                  aria-label={`Decrease quantity of ${productName}`}
                  className="grid h-10 w-10 place-items-center text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  disabled={quantity <= 1}
                  onClick={handleDecreaseQuantity}
                  type="button"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-extrabold text-[#0F172A]">{quantity}</span>
                <button
                  aria-label={`Increase quantity of ${productName}`}
                  className="grid h-10 w-10 place-items-center text-slate-700 transition hover:bg-slate-50"
                  onClick={handleIncreaseQuantity}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-3 text-xs font-extrabold text-white transition hover:bg-[#172554]"
                onClick={handleGoToCart}
                type="button"
              >
                <ShoppingCart className="h-4 w-4" />
                Go to Cart
              </button>
            </>
          ) : (
            <>
              <button className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-3 text-xs font-extrabold text-white transition hover:bg-[#172554]" onClick={handleAddToCart} type="button">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
              <button className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-extrabold text-[#1E3A8A] transition hover:bg-slate-50" onClick={openProduct} type="button">
                View Details
              </button>
            </>
          )}
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useDispatch();
  const { products = [], loading: isLoading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductsRequest());
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

    if (!hasActiveFilters) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = [
        product?.name,
        product?.category,
        product?.vendor,
        product?.shortDescription,
        product?.description,
      ]
        .map(getTextValue)
        .join(' ');

      const productPrice = getNumericPrice(product?.discountedPrice || product?.price);
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory = filters.category === 'All' || product?.category === filters.category;
      const matchesVendor = !filters.vendor || product?.vendor === filters.vendor;
      const matchesStatus = !filters.status || product?.status === filters.status;
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
  }, [filters, searchTerm]);

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
              <select className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-[#1E3A8A]">
                <option>Sort by relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
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
