import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, ShoppingCart, Star, X } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import { fallbackImage, products } from './productData';

const categoryTabs = ['All', 'Cement', 'Steel & TMT', 'Plywood', 'Tiles', 'Paints', 'Electrical', 'Plumbing'];
const brands = ['ACC Cement', 'Birla White', 'Tata Tiscon', 'Centuryply', 'Kajaria', 'Asian Paints', 'Havells', 'Astral Pipes'];
const vendors = ['Authorized Distributor', 'Tata Steel Limited', 'InfraMart Direct', 'Electrical Depot'];
const availability = ['In Stock', 'Limited Stock', 'Out of Stock'];

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

function Filters({ selectedCategory, onCategoryChange }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
      <FilterSection title="Category">
        <div className="grid gap-1">
          {categoryTabs.map((category) => (
            <button
              className={`rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                selectedCategory === category ? 'bg-orange-50 text-[#F97316]' : 'text-slate-700 hover:bg-slate-50'
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

      <FilterSection title="Brand">
        <div className="grid gap-3">
          {brands.map((brand) => (
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700" key={brand}>
              <input className="h-4 w-4 accent-[#F97316]" type="checkbox" />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="grid grid-cols-2 gap-2">
          <input className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1E3A8A]" placeholder="Min" />
          <input className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1E3A8A]" placeholder="Max" />
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="grid gap-3">
          {availability.map((status) => (
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700" key={status}>
              <input className="h-4 w-4 accent-[#F97316]" type="checkbox" />
              {status}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Vendor">
        <div className="grid gap-3">
          {vendors.map((vendor) => (
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700" key={vendor}>
              <input className="h-4 w-4 accent-[#F97316]" type="checkbox" />
              {vendor}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const productName = product.name || 'Product name not available';
  const category = product.category || 'Category not available';
  const vendor = product.vendor || 'Vendor not available';
  const price = product.price || 'Price unavailable';
  const discountedPrice = product.discountedPrice || 'Discount not available';
  const shortDescription = product.shortDescription || 'No short description available';
  const status = product.status || 'Status not available';
  const unit = product.unit || 'Unit not available';

  const openProduct = () => navigate(`/product/${product.id}`);
  const stopCardClick = (event) => event.stopPropagation();

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
          <button className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-3 text-xs font-extrabold text-white transition hover:bg-[#172554]" onClick={stopCardClick} type="button">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
          <button className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-extrabold text-[#1E3A8A] transition hover:bg-slate-50" onClick={openProduct} type="button">
            View Details
          </button>
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading] = useState(false);
  const [error] = useState('');

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

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

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {categoryTabs.map((category) => (
              <button
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${
                  selectedCategory === category ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-[#F97316]'
                }`}
                key={category}
                onClick={() => setSelectedCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <Filters selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Showing <span className="font-extrabold text-[#0F172A]">{visibleProducts.length}</span>{' '}
                {selectedCategory === 'All' ? 'products' : `${selectedCategory} products`}
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

            {!isLoading && !error && visibleProducts.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-extrabold text-[#0F172A]">No products found</h2>
                <p className="mt-2 text-sm text-slate-600">Try another category or adjust filters.</p>
              </div>
            )}

            {!isLoading && !error && visibleProducts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleProducts.map((product) => (
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
            <Filters selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListing;
