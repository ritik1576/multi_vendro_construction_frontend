import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { 
  MessageSquare, Star, Search, Filter, AlertCircle, TrendingUp, TrendingDown, Clock, Loader2, Trash2, CheckCircle, EyeOff, Flag
} from 'lucide-react';
import { useAdminReviews } from '../hooks/useAdminReviews';
import { RatingStars } from '../components/RatingStars';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const { reviews, stats, isLoading, error, deleteReview, updateReviewStatus } = useAdminReviews();

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReviewStatus(id, newStatus);
      toast.success(`Review marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);
        toast.success('Review deleted successfully');
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  const filteredReviews = reviews.filter(r => {
    // Search filter
    const matchesSearch = 
      r.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vendorShopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText?.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;

    // Rating Filter
    if (activeFilter === '5 Stars' && r.rating !== 5) return false;
    if (activeFilter === '4 Stars' && r.rating !== 4) return false;
    if (activeFilter === '3 Stars' && r.rating !== 3) return false;
    if (activeFilter === '1-2 Stars' && r.rating > 2) return false;

    return true;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Review Moderation</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and moderate customer reviews across all products and vendors.</p>
        </div>

        {/* Section 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Total Reviews</span>
              <div className="p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalReviews}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Across the platform
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Average Rating</span>
              <div className="p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.averageRating?.toFixed(1)}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Overall platform health
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">5-Star Reviews</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.fiveStarReviews}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Positive feedback
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Low Rating (1-2 Stars)</span>
              <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">{isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.lowRatingReviews}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Needs attention
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Search & Filter Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search Product, Customer, Vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
                {['All', '5 Stars', '4 Stars', '3 Stars', '1-2 Stars'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 text-[11px] font-extrabold rounded-md transition-all whitespace-nowrap ${
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

        {/* Section 3: Reviews Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Rating & Review</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-[#C2410C] w-8 h-8" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center bg-red-50/50">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-red-600">Failed to load reviews</p>
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center bg-slate-50/50">
                      <div className="max-w-sm mx-auto flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <MessageSquare className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mb-1">No reviews found.</h3>
                        <p className="text-sm font-medium text-slate-500">
                          Try adjusting your filters or search query.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map(review => (
                    <tr key={review.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {review.productThumbnail && (
                            <img src={review.productThumbnail} alt={review.productName} className="w-10 h-10 rounded object-cover border border-slate-200" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-extrabold text-slate-900 line-clamp-1">{review.productName || 'Unknown Product'}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: {review.productId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-extrabold text-slate-700">{review.vendorShopName || 'Unknown Vendor'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-sm font-extrabold text-slate-900">{review.customerName}</span>
                        <span className="block text-[11px] font-medium text-slate-500 mt-0.5">{review.customerEmail}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <RatingStars rating={review.rating} size="sm" />
                        <p className="text-[13px] text-slate-600 mt-1.5 line-clamp-2">{review.reviewText}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(review.id)} title="Delete" className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ml-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
