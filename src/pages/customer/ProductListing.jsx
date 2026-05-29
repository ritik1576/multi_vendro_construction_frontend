import { useMemo, useState } from 'react'

const fallbackImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="%23f2f4f6"/><rect x="180" y="110" width="280" height="180" rx="18" fill="%23ffffff" stroke="%23e0c0b1" stroke-width="4"/><path d="M224 251l62-65 42 43 31-29 57 51" fill="none" stroke="%239d4300" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><circle cx="395" cy="158" r="22" fill="%23f97316"/><text x="320" y="334" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="%23584237">Image unavailable</text></svg>'

const categories = [
  'All Products',
  'Cement',
  'Steel & TMT Bars',
  'Plywood',
  'Paint',
  'Power Tools',
]

const brands = ['ACC Cement', 'Birla White', 'Tata Tiscon', 'Centuryply', 'Pro-Tools']

const products = [
  {
    id: 'acc-cement',
    brand: 'ACC Cement',
    name: 'ACC Suraksha Power Cement',
    category: 'Cement',
    price: 'Rs. 270',
    oldPrice: 'Rs. 300',
    unit: 'bag',
    rating: 4.0,
    reviews: 12,
    badge: '10% OFF',
    vendor: 'Authorized Distributor',
    imageUrl:
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'birla-putty',
    brand: 'Birla White',
    name: 'Birla White Wall Putty',
    category: 'Cement',
    price: 'Rs. 840',
    oldPrice: 'Rs. 920',
    unit: '40 kg bag',
    rating: 4.5,
    reviews: 44,
    badge: 'Best Value',
    vendor: 'Birla Partner Store',
    imageUrl:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tata-tmt',
    brand: 'Tata Tiscon',
    name: 'Tata Tiscon 550SD TMT Bars',
    category: 'Steel & TMT Bars',
    price: 'Rs. 64,500',
    unit: 'MT',
    rating: 4.8,
    reviews: 112,
    badge: 'Bulk Deal',
    vendor: 'Tata Steel Limited',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'century-plywood',
    brand: 'Centuryply',
    name: 'Centuryply Sainik 710 Plywood',
    category: 'Plywood',
    price: 'Rs. 350',
    unit: 'sq.ft',
    rating: 4.2,
    reviews: 26,
    vendor: 'Centuryply Direct',
    imageUrl:
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'paint-emulsion',
    brand: 'Tulip Paints',
    name: 'Tulip Interior Emulsion - 20L',
    category: 'Paint',
    price: 'Rs. 4,850',
    unit: 'bucket',
    rating: 4.6,
    reviews: 35,
    vendor: 'Paints Hub Distributor',
    imageUrl:
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hammer-drill',
    brand: 'Pro-Tools',
    name: 'Industrial Rotary Hammer Drill',
    category: 'Power Tools',
    price: 'Rs. 8,900',
    unit: 'unit',
    rating: 4.9,
    reviews: 18,
    badge: 'New Arrival',
    vendor: 'InfraMart Direct',
    imageUrl: null,
  },
]

function ProductImage({ alt, src }) {
  const [imageSrc, setImageSrc] = useState(src || fallbackImage)

  return (
    <img
      alt={alt || 'Product image'}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      onError={() => setImageSrc(fallbackImage)}
      src={imageSrc}
    />
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e0c0b1] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded bg-[#fff4ed] text-sm font-extrabold text-[#9d4300]">
            IM
          </div>
          <div>
            <p className="text-lg font-extrabold leading-tight text-[#191c1e]">InfraMart</p>
            <p className="text-xs font-bold uppercase tracking-wide text-[#8c7164]">Wholesale materials</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:pl-8">
          <button className="flex min-h-11 items-center justify-between rounded-md border border-[#e0c0b1] bg-[#f2f4f6] px-3 text-left text-sm font-semibold text-[#191c1e] lg:w-44">
            <span>
              <span className="block text-[10px] uppercase text-[#584237]">Deliver to</span>
              Mumbai GPO
            </span>
            <span aria-hidden="true">v</span>
          </button>

          <input
            className="min-h-11 flex-1 rounded-md border border-[#e0c0b1] bg-[#f7f9fb] px-4 text-sm outline-none transition focus:border-[#9d4300] focus:ring-2 focus:ring-orange-200"
            placeholder="Search cement, steel, plywood..."
            type="search"
          />
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <button className="rounded-md px-3 py-2 text-[#584237] hover:bg-[#f2f4f6]">Bulk Orders</button>
          <button className="rounded-md px-3 py-2 text-[#584237] hover:bg-[#f2f4f6]">Project Pricing</button>
          <button className="rounded-md bg-[#f97316] px-4 py-2 text-white hover:bg-[#d95f0a]">Sign In</button>
        </nav>
      </div>
    </header>
  )
}

function FilterCard({ title, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#e0c0b1] bg-white">
      <div className="flex items-center justify-between border-b border-[#e0c0b1] bg-[#f2f4f6] px-4 py-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#191c1e]">{title}</h2>
        <span aria-hidden="true" className="text-[#584237]">
          -
        </span>
      </div>
      <div className="p-3">{children}</div>
    </section>
  )
}

function Sidebar() {
  return (
    <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
      <FilterCard title="Categories">
        <div className="grid gap-1">
          {categories.map((category) => (
            <button
              className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                category === 'All Products'
                  ? 'bg-orange-100 text-[#9d4300]'
                  : 'text-[#191c1e] hover:bg-[#f2f4f6]'
              }`}
              key={category}
              type="button"
            >
              {category}
              <span aria-hidden="true">{category === 'All Products' ? '●' : '○'}</span>
            </button>
          ))}
        </div>
      </FilterCard>

      <FilterCard title="Top Brands">
        <input
          className="mb-3 min-h-10 w-full rounded-md border border-[#e0c0b1] bg-[#f7f9fb] px-3 text-sm outline-none focus:border-[#9d4300] focus:ring-2 focus:ring-orange-200"
          placeholder="Search brands..."
          type="search"
        />
        <div className="grid gap-3">
          {brands.map((brand) => (
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#191c1e]" key={brand}>
              <input className="h-4 w-4 accent-[#9d4300]" type="checkbox" />
              {brand}
            </label>
          ))}
        </div>
      </FilterCard>
    </aside>
  )
}

function ProductCard({ product }) {
  const {
    badge,
    brand,
    category,
    imageUrl,
    name,
    oldPrice,
    price,
    rating,
    reviews,
    unit,
    vendor,
  } = product

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-[#e0c0b1] bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-[#f2f4f6]">
        <ProductImage alt={name} src={imageUrl} />
        {badge && (
          <span className="absolute left-3 top-3 rounded bg-[#f97316] px-2 py-1 text-xs font-extrabold uppercase text-white">
            {badge}
          </span>
        )}
        <button
          aria-label={`Save ${name}`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg text-[#584237] shadow-sm hover:text-[#9d4300]"
          type="button"
        >
          <span aria-hidden="true">♡</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#9d4300]">{brand}</span>
          <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">In Stock</span>
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#8c7164]">{category}</p>
        <h3 className="text-lg font-extrabold leading-snug text-[#191c1e]">{name}</h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-extrabold text-emerald-800">
            {Number(rating).toFixed(1)} star
          </span>
          <span className="text-xs font-semibold text-[#584237]">({reviews || 0} Reviews)</span>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#191c1e]">{price}</span>
            <span className="text-sm font-semibold text-[#584237]">/{unit}</span>
            {oldPrice && <span className="text-sm font-semibold text-[#8c7164] line-through">{oldPrice}</span>}
          </div>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#584237]">Vendor: {vendor}</p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <button className="min-h-10 rounded bg-[#f97316] px-3 text-xs font-extrabold text-white transition hover:bg-[#d95f0a]" type="button">
            ADD TO QUOTE
          </button>
          <button className="min-h-10 rounded border border-[#e0c0b1] px-3 text-xs font-extrabold text-[#191c1e] transition hover:bg-[#f2f4f6]" type="button">
            DETAILS
          </button>
        </div>
      </div>
    </article>
  )
}

function ProductGrid({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-[#e0c0b1] bg-white p-8 text-center">
        <h2 className="text-lg font-extrabold text-[#191c1e]">No products found</h2>
        <p className="mt-2 text-sm text-[#584237]">Try changing the search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.id || product.name} product={product} />
      ))}
    </div>
  )
}

function Footer() {
  const linkGroups = [
    ['Product Categories', 'Cement & Putty', 'Steel & TMT Bars', 'Plywood & Wood', 'Electrical Supplies'],
    ['Bulk Sourcing', 'Project Pricing', 'Verified Sellers', 'Secure Payments', 'Quote Requests'],
    ['Support Center', 'Help Center', 'Track Order', 'Return Policy', 'Contact Us'],
  ]

  return (
    <footer className="mt-16 border-t border-[#e0c0b1] bg-[#e0e3e5]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded bg-white text-sm font-extrabold text-[#9d4300]">
              IM
            </div>
            <span className="text-xl font-extrabold text-[#191c1e]">InfraMart</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#584237]">
            India&apos;s trusted B2B marketplace for industrial-grade construction materials and bulk project sourcing.
          </p>
        </div>

        {linkGroups.map(([title, ...items]) => (
          <div className="grid gap-3" key={title}>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#191c1e]">{title}</h4>
            {items.map((item) => (
              <button className="w-fit text-left text-sm font-medium text-[#584237] hover:text-[#9d4300]" key={item} type="button">
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-[#cdb4a8] px-4 py-5 text-center text-xs font-semibold text-[#584237]">
        Copyright 2024 InfraMart B2B. All rights reserved.
      </div>
    </footer>
  )
}

function ProductListing() {
  const visibleProducts = useMemo(() => products.filter(Boolean), [])

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#584237]">
          <span>Home</span>
          <span aria-hidden="true">/</span>
          <span>Catalog</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#191c1e]">Construction Materials</span>
        </nav>

        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#191c1e] sm:text-4xl">
              Wholesale Construction Materials
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#584237]">
              Get industrial-grade materials at bulk pricing for your next project.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#584237]">Active Filters:</span>
            <span className="rounded bg-orange-100 px-3 py-1 text-xs font-extrabold text-[#9d4300]">Cement x</span>
            <button className="text-xs font-extrabold text-[#505f76] hover:underline" type="button">
              Clear all
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Sidebar />

          <section>
            <div className="mb-6 flex flex-col gap-4 rounded-lg border border-[#e0c0b1] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#584237]">
                Showing <span className="font-extrabold text-[#191c1e]">{visibleProducts.length}</span> of{' '}
                <span className="font-extrabold text-[#191c1e]">48</span> products
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-md border border-[#e0c0b1] p-1">
                  <button className="rounded bg-orange-100 px-3 py-2 text-xs font-extrabold text-[#9d4300]" type="button">
                    Grid
                  </button>
                  <button className="rounded px-3 py-2 text-xs font-extrabold text-[#584237] hover:bg-[#f2f4f6]" type="button">
                    List
                  </button>
                </div>
                <select className="min-h-10 rounded-md border border-[#e0c0b1] bg-[#f7f9fb] px-3 text-sm font-semibold outline-none focus:border-[#9d4300] focus:ring-2 focus:ring-orange-200">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            <ProductGrid items={visibleProducts} />

            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-1">
                {['<', '1', '2', '3', '...', '8', '>'].map((page) => (
                  <button
                    className={`grid h-10 min-w-10 place-items-center rounded border px-3 text-sm font-extrabold ${
                      page === '1'
                        ? 'border-[#9d4300] bg-[#9d4300] text-white'
                        : 'border-[#e0c0b1] text-[#191c1e] hover:bg-[#f2f4f6]'
                    }`}
                    key={page}
                    type="button"
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductListing
