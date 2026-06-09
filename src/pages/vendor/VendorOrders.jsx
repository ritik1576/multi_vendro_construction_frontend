import React, { useState } from 'react';
import VendorLayout from '../../components/vendor/VendorLayout';
import { 
  ShoppingCart, Clock, Package, CheckCircle, 
  Search, Filter, Calendar, ChevronDown, 
  MapPin, Box, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';

const VendorOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [sortBy, setSortBy] = useState('Newest First');

  const stats = [
    { title: 'Total Orders', value: '450', helper: '+12% from last month', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-l-blue-600' },
    { title: 'Pending Approval', value: '12', helper: 'Needs action', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-l-amber-600' },
    { title: 'Processing Orders', value: '28', helper: 'In logistics pipeline', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-l-indigo-600' },
    { title: 'Completed Orders', value: '410', helper: 'Successfully delivered', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-l-emerald-600' }
  ];

  const dummyOrders = [
    {
      id: 'ORD-10045',
      date: '09 Jun 2026',
      time: '14:30 PM',
      customer: 'L&T Construction',
      location: 'Mumbai, Maharashtra',
      items: 'UltraTech Cement 50kg (150 Bags), JSW Steel TMT (10 Tons)',
      total: '₹4,50,000',
      status: 'Pending Approval'
    },
    {
      id: 'ORD-10044',
      date: '08 Jun 2026',
      time: '11:15 AM',
      customer: 'Tata Projects',
      location: 'Pune, Maharashtra',
      items: 'Century Ply 18mm (50 Boards)',
      total: '₹85,000',
      status: 'Processing'
    },
    {
      id: 'ORD-10043',
      date: '07 Jun 2026',
      time: '09:45 AM',
      customer: 'Shapoorji Pallonji',
      location: 'Delhi NCR',
      items: 'Asian Paints Apex 20L (20 Buckets), Putty (50 Bags)',
      total: '₹1,20,000',
      status: 'Completed'
    },
    {
      id: 'ORD-10042',
      date: '06 Jun 2026',
      time: '16:20 PM',
      customer: 'Afcons Infra',
      location: 'Chennai, Tamil Nadu',
      items: 'Hydraulic Pump Unit v2 (2 Units)',
      total: '₹2,84,000',
      status: 'Pending Approval'
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending Approval': return 'bg-amber-100 text-amber-700';
      case 'Processing': return 'bg-indigo-100 text-indigo-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <VendorLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Order Management</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Review, process, and track customer orders.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 border-l-4 ${stat.border}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">{stat.title}</span>
                </div>
                <div className="text-3xl font-extrabold text-[#0F172A]">
                  {stat.value}
                </div>
                {stat.helper && <p className="mt-2 text-xs font-semibold text-slate-500">{stat.helper}</p>}
              </div>
            );
          })}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Order ID / Customer" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select 
                className="w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Pending Approval</option>
                <option>Processing</option>
                <option>Completed</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option>All Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Sort By: Newest First</option>
                <option>Sort By: Oldest First</option>
                <option>Sort By: Highest Value</option>
                <option>Sort By: Lowest Value</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {dummyOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Order Meta & Customer Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-[#1E3A8A] text-lg">{order.id}</span>
                      <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {order.date} • {order.time}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Details</p>
                      <h3 className="font-extrabold text-[#0F172A] text-base">{order.customer}</h3>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Items Summary</p>
                      <p className="text-sm font-semibold text-slate-700 flex items-start gap-1.5 line-clamp-2">
                        <Box className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> {order.items}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Values & Actions */}
                <div className="lg:w-64 shrink-0 flex flex-col justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="mb-3 text-center lg:text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Value</p>
                    <p className="text-3xl font-black text-[#1E3A8A]">{order.total}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {order.status === 'Pending Approval' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-md shadow-sm transition-colors active:scale-95">
                          Approve
                        </button>
                        <button className="px-3 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-extrabold rounded-md transition-colors active:scale-95">
                          Reject
                        </button>
                      </div>
                    ) : null}
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 hover:border-[#1E3A8A] text-slate-700 hover:text-[#1E3A8A] text-sm font-extrabold rounded-md transition-colors">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="font-extrabold text-slate-700">1</span> to <span className="font-extrabold text-slate-700">4</span> of <span className="font-extrabold text-slate-700">450</span> orders
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#F97316] text-white font-extrabold text-sm flex items-center justify-center">1</button>
            <button className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-extrabold text-sm hover:bg-slate-50 flex items-center justify-center transition-colors">2</button>
            <button className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-extrabold text-sm hover:bg-slate-50 flex items-center justify-center transition-colors">3</button>
            <span className="text-slate-400 font-bold px-1">...</span>
            <button className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-extrabold text-sm hover:bg-slate-50 flex items-center justify-center transition-colors">45</button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </VendorLayout>
  );
};

export default VendorOrders;
