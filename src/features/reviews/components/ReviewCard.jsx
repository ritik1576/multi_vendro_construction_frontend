import { ShieldCheck, User } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { formatDate } from '../utils/reviewHelpers';

export const ReviewCard = ({ review: reviewData, role = 'customer', onApprove, onHide, onDelete, currentUserId }) => {
  const { rating, review, customerName, isVerifiedPurchase, createdAt, status, userId } = reviewData;
  const isOwner = String(currentUserId) === String(userId);

  return (
    <div className="py-6 border-b border-slate-100 last:border-0 group">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        
        <div className="w-full sm:w-48 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[14px] font-extrabold text-[#0F172A]">{customerName || 'Anonymous'}</p>
              {isVerifiedPurchase && (
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-700">Verified Buyer</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <RatingStars rating={rating} />
            <span className="text-[12px] font-medium text-slate-400">{formatDate(createdAt)}</span>
          </div>
          
          <p className="text-[14px] text-slate-600 leading-relaxed">{review}</p>
          
          {(role === 'admin' || isOwner) && (
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100">
              {role === 'admin' && (
                <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                  status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                  status === 'hidden' ? 'bg-slate-100 text-slate-600' :
                  'bg-orange-50 text-orange-700'
                }`}>
                  {status}
                </span>
              )}
              
              <div className="ml-auto flex items-center gap-2">
                {role === 'admin' && status !== 'approved' && onApprove && (
                  <button onClick={() => onApprove(reviewData.id)} className="text-[12px] font-bold text-[#1E3A8A] hover:underline">Approve</button>
                )}
                {role === 'admin' && status !== 'hidden' && onHide && (
                  <button onClick={() => onHide(reviewData.id)} className="text-[12px] font-bold text-slate-500 hover:underline">Hide</button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(reviewData.id)} className="text-[12px] font-bold text-red-600 hover:underline">Delete</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
