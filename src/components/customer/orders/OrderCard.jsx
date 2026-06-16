import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { formatCurrency } from '../../../context/cartUtils';
import StatusBadge from './StatusBadge';
import { getLocalProductImage } from '../../../utils/productImages';

function ProductImage({ alt, src }) {
  const [failedSrc, setFailedSrc] = useState(null);
  
  if (!src || failedSrc === src) {
    return null;
  }

  return (
    <img
      alt={alt || 'Product image'}
      className="h-full w-full object-contain mix-blend-multiply"
      loading="lazy"
      onError={() => setFailedSrc(src)}
      src={src}
    />
  );
}

const OrderCard = ({ order, onClick, onReview, hasReviewed }) => {
  const orderId = order.id || order._id;
  const displayId = String(orderId).slice(-10).toUpperCase();
  const orderTotal = order.totalAmount || order.total || 0;
  const orderStatus = order.displayStatus || order.orderStatus || order.status || 'Processing';
  
  const orderDate = order.date || (order.placedAt || order.createdAt
    ? new Date(order.placedAt || order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
    : null);

  // Extract first item details
  const items = Array.isArray(order.items) ? order.items : [];
  const firstItem = items[0] || {};
  const product = firstItem.product || firstItem;
  
  const title = product.productName || product.name || `Order #${displayId}`;
  
  let quantity = firstItem.quantity;
  if (!quantity && items.length > 0) {
    quantity = items.length;
  } else if (!quantity && order.itemCount) {
    quantity = order.itemCount;
  }

  const category = product.category;
  const vendor = product.vendor || order.vendorName;
  const paymentStatus = order.paymentStatus;
  
  const imageSrc = getLocalProductImage(product);

  const getStatusMessage = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('delivered')) return `Your item has been delivered and signed for by Site Manager.`;
    if (s.includes('shipped') || s.includes('out for delivery')) return `Your order is on the way to the site.`;
    if (s.includes('cancelled')) return `Your order has been canceled as requested.`;
    if (s.includes('returned')) return `Item was returned successfully.`;
    return `Your order is currently ${status.toLowerCase()}.`;
  };

  return (
    <div 
      onClick={() => onClick(orderId)}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col"
    >
      {/* Top Bar */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-2.5 flex items-center justify-between text-[11px] font-bold text-slate-500 tracking-wide">
        <div className="flex items-center gap-2">
          {vendor && (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>{vendor} shared this order with you.</span>
            </>
          )}
        </div>
        <div className="uppercase">
          Order ID: OD{displayId}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 flex flex-col md:flex-row gap-6 items-start flex-1">
        
        {/* Left: Image & Title */}
        <div className="flex flex-1 gap-5 w-full">
          {imageSrc && (
            <div className="w-20 h-20 shrink-0 bg-white border border-slate-100 rounded-lg p-1.5 flex items-center justify-center">
              <ProductImage alt={title} src={imageSrc} />
            </div>
          )}
          
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#1E3A8A] transition-colors">
              {title}
            </h3>
            
            {(quantity || category) && (
              <p className="text-[13px] font-medium text-slate-500 mt-1.5 truncate flex items-center gap-2">
                {quantity ? <span>Qty: {quantity} {quantity === 1 ? 'Unit' : 'Units'}</span> : null}
                {quantity && category && <span className="text-slate-300">|</span>}
                {category ? <span>Category: {category}</span> : null}
              </p>
            )}
            
            {paymentStatus && (
              <p className="text-[12px] font-medium text-slate-400 mt-1 uppercase tracking-wide">
                Payment: {paymentStatus}
              </p>
            )}
          </div>
        </div>

        {/* Middle: Amount */}
        <div className="md:w-32 shrink-0 md:text-right flex md:flex-col items-center md:items-end w-full justify-between md:justify-center mt-4 md:mt-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest md:hidden">Total</span>
          <span className="text-[20px] font-extrabold text-[#0F172A]">{formatCurrency(orderTotal)}</span>
          <span className="mt-2 md:hidden">
            <button className="text-[12px] font-bold text-[#1E3A8A] hover:underline">View Details</button>
          </span>
        </div>

        {/* Right: Status */}
        <div className="md:w-64 shrink-0 md:border-l border-slate-100 md:pl-6 flex flex-col w-full mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={orderStatus} />
            {orderDate && <span className="text-[12px] font-bold text-slate-600">on {orderDate}</span>}
          </div>
          <p className="text-[12px] text-slate-500 mt-2 leading-relaxed font-medium">
            {getStatusMessage(orderStatus)}
          </p>
          {String(orderStatus).toLowerCase().includes('delivered') ? (
            hasReviewed ? (
              <span className="mt-3 text-[12px] font-bold text-emerald-700 self-start flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Review Submitted
              </span>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); onReview && onReview(order, product); }}
                className="mt-3 text-[12px] font-bold text-[#1E3A8A] hover:text-[#0F172A] transition-colors self-start flex items-center gap-1.5 z-10 relative"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Rate & Review Product
              </button>
            )
          ) : (
            <button className="hidden md:flex mt-auto pt-2 text-[12px] font-bold text-[#1E3A8A] hover:underline self-start">
              View Details
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderCard;
