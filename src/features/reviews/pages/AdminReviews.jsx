import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { 
  MessageSquare, Star, Search, Filter, AlertCircle, TrendingUp, TrendingDown, Clock
} from 'lucide-react';

const AdminReviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Review Moderation</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and moderate customer reviews across all products and vendors.</p>
        </div>

        {/* Section 1: KPI Cards (Mocked to 0 since API is unavailable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider leading-tight">Total Reviews</span>
              <div className="p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">0</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Pending API Integration
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
              <div className="text-3xl font-extrabold text-slate-900">0.0</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Pending API Integration
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
              <div className="text-3xl font-extrabold text-slate-900">0</div>
              <div className="mt-2 text-xs font-bold text-slate-500">
                Pending API Integration
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
              <div className="text-3xl font-extrabold text-slate-900">0</div>
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
                disabled
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
                    disabled
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
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Review</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center bg-slate-50/50">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 mb-1">Admin reviews API not available yet.</h3>
                      <p className="text-sm font-medium text-slate-500">
                        The backend integration to fetch all reviews across the platform has not been implemented. Please implement `GET /admin/reviews` to see real data here.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
