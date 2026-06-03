import { useMemo, useState, useEffect } from 'react';
import { BACKEND_URL } from '../../services/apiConstants';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetailsRequest } from '../../redux/productActions';
import { ChevronRight, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import { getCartItemPrice, formatCurrency } from '../../context/cartUtils';
import { addToCartRequest } from '../../redux/cartActions';
import { fallbackImage } from './productData';



const statusStyles = {
  'In Stock': 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  'Limited Stock': 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  'Out of Stock': 'bg-red-100 text-red-700 ring-red-200',
};

function ProductDetailImage({ alt, src }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const imageSrc = !src || failedSrc === src ? fallbackImage : src;

  return (
    <img
      alt={alt || 'Product image'}
      className="max-h-full max-w-full object-contain mix-blend-multiply"
      onError={() => setFailedSrc(src)}
      src={imageSrc}
    />
  );
}

function InfoCard({ title, children }) {
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
          <div className="space-y-4">
            <div className="h-6 w-36 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-28 w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </main>
    </div>
  );
}

function ProductError() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-12 pt-10 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-2xl font-extrabold">Product not found</h1>
          <p className="mt-3 text-slate-600">We could not find the product you requested.</p>
          <Link className="mt-6 inline-flex rounded-lg bg-[#1E3A8A] px-5 py-3 text-sm font-bold text-white hover:bg-[#172554]" to="/products">
            Back to products
          </Link>
        </div>
      </main>
    </div>
  );
}

function ProductDetail() {
  const { name: routeName } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { productDetails: product, loading: isLoading, error } = useSelector((state) => state.product);
  const cart = useSelector((state) => state.cart.cart);
  const cartItems = Array.isArray(cart) ? cart : (cart?.items || []);

  useEffect(() => {
    if (routeName) {
      dispatch(getProductDetailsRequest(routeName));
    }
  }, [dispatch, routeName]);

  if (isLoading || !routeName) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return <ProductError />;
  }

  const name = product.name || 'Product name not available';
  const category = product.category || 'Category not available';
  const vendor = product.vendor || 'Vendor not available';
  
  const numPrice = Number(product.price || 0);
  const numDiscountPrice = Number(product.discountPrice || 0);
  const hasValidDiscount = numDiscountPrice > 0 && numDiscountPrice < numPrice;

  const price = formatCurrency(numPrice);
  const discountedPrice = formatCurrency(hasValidDiscount ? numDiscountPrice : numPrice);
  const shortDescription = product.shortDescription || 'No short description available';
  const description = product.description || 'No description available';
  const status = product.status || 'Status not available';
  const unit = product.unit || 'Unit not available';
  const statusClass = statusStyles[status] || 'bg-slate-100 text-slate-700 ring-slate-200';
  const specifications = product.specifications || {};
  const isProductInCart = cartItems.some((item) => item.id === product.id);
  const productTotal = getCartItemPrice(product) * quantity;
  const buyNowLabel = `Buy Now ₹${productTotal.toLocaleString('en-IN')}`;

  const handleCartAction = () => {
    if (isProductInCart) {
      navigate('/cart');
      return;
    }

    dispatch(addToCartRequest({ ProductName: product.name, quantity }));
  };

  const handleBuyNow = () => {
    if (!isProductInCart) {
      dispatch(addToCartRequest({ ProductName: product.name, quantity }));
    }

    navigate('/cart');
  };

  const resolveImageUrl = (product) => {
    if (product?.thumbnail) {
      if (product.thumbnail.startsWith('http')) return product.thumbnail;
      return `${BACKEND_URL}${product.thumbnail.startsWith('/') ? '' : '/'}${product.thumbnail}`;
    }
    return product?.imageUrl || null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link className="hover:text-[#F97316]" to="/">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link className="hover:text-[#F97316]" to="/products">Catalog</Link>
          <ChevronRight className="h-4 w-4" />
          <span>{category}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">{name}</span>
        </nav>

        <Link className="mt-5 inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#1E3A8A] shadow-sm hover:bg-slate-50" to="/products">
          Back to products
        </Link>

        <section className="mb-10 mt-6 grid auto-rows-auto gap-8 rounded-2xl border border-slate-200 bg-white p-5 pb-7 shadow-xl shadow-slate-200/70 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:p-8 lg:pb-10">
          <div className="flex aspect-[4/3] min-h-0 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-6 shadow-inner">
            <ProductDetailImage alt={name} src={resolveImageUrl(product)} />
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#F97316]">
                {category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${statusClass}`}>
                {status}
              </span>
            </div>

            <h1 className="mt-5 break-words text-3xl font-extrabold leading-tight tracking-tight text-[#0F172A] md:text-4xl">
              {name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{shortDescription}</p>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-extrabold text-[#1E3A8A] sm:text-4xl">{discountedPrice}</span>
                {hasValidDiscount && price !== discountedPrice && <span className="pb-1 text-base font-bold text-slate-400 line-through">{price}</span>}
                {(() => {
                  const discountVal = hasValidDiscount
                    ? Math.round(((numPrice - numDiscountPrice) / numPrice) * 100)
                    : product.discountPercent;
                  return discountVal ? (
                    <span className="mb-1 rounded-md bg-orange-100 px-2 py-1 text-xs font-extrabold text-[#F97316]">
                      {discountVal}% OFF
                    </span>
                  ) : null;
                })()}
              </div>
              <p className="mt-2 text-sm font-bold text-slate-500">per {unit}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Vendor</p>
                <p className="mt-1 text-base font-bold text-[#0F172A]">{vendor}</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#F97316]">Bulk Orders</p>
                <p className="mt-1 text-sm font-bold text-[#0F172A]">Request project pricing for higher quantities.</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Truck className="h-4 w-4 text-[#F97316]" />
                {product.delivery || 'Delivery information not available'}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white">
                <button className="grid h-11 w-11 place-items-center text-slate-700 hover:bg-slate-50" onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-12 text-center text-sm font-extrabold">{quantity}</span>
                <button className="grid h-11 w-11 place-items-center text-slate-700 hover:bg-slate-50" onClick={() => setQuantity((value) => value + 1)} type="button">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 text-sm font-extrabold text-white hover:bg-[#172554]" onClick={handleCartAction} type="button">
                <ShoppingCart className="h-4 w-4" />
                {isProductInCart ? 'Go to Cart' : 'Add to Cart'}
              </button>
              <button className="min-h-12 rounded-lg bg-[#F97316] px-4 text-sm font-extrabold text-white hover:bg-orange-600" onClick={handleBuyNow} type="button">
                {buyNowLabel}
              </button>
              <button className="min-h-12 rounded-lg border border-slate-300 bg-white px-4 text-sm font-extrabold text-[#1E3A8A] hover:bg-slate-50" type="button">
                Request Quote
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <InfoCard title="Description">{description}</InfoCard>
          <InfoCard title="Product Specifications">
            <dl className="grid gap-2">
              {Object.entries(specifications).map(([label, value]) => (
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0" key={label}>
                  <dt className="font-bold text-slate-500">{label}</dt>
                  <dd className="text-right font-semibold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </InfoCard>
          <InfoCard title="Vendor Information">{vendor}</InfoCard>
          <InfoCard title="Price Details">
            {discountedPrice} {unit !== 'Unit not available' ? `/ ${unit}` : ''}
            {(() => {
              const discountVal = hasValidDiscount
                ? Math.round(((numPrice - numDiscountPrice) / numPrice) * 100)
                : product.discountPercent;
              return discountVal ? ` with ${discountVal}% discount` : '';
            })()}
          </InfoCard>
          <InfoCard title="Availability Status">{status}</InfoCard>
          <InfoCard title="Delivery Information">{product.delivery || 'Delivery information not available'}</InfoCard>
        </section>
      </main>
    </div>
  );
}

export default ProductDetail;
