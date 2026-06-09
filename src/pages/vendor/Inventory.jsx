import React, { useState } from 'react';
import VendorLayout from '../../components/vendor/VendorLayout';
import {
  Package, Banknote, AlertTriangle, AlertCircle,
  Search, ChevronDown, X, Eye, IndianRupee, Image as ImageIcon, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  const kpis = [
    { title: 'Total Products', value: '1,284', icon: Package, color: 'border-l-[#0F172A]', textColor: 'text-[#0F172A]' },
    { title: 'Total Value (₹)', value: '4.2M', icon: Banknote, color: 'border-l-[#0F172A]', textColor: 'text-[#0F172A]' },
    { title: 'Low Stock', value: '42', icon: AlertTriangle, color: 'border-l-[#F59E0B]', textColor: 'text-[#F59E0B]' },
    { title: 'Out of Stock', value: '8', icon: AlertCircle, color: 'border-l-[#EF4444]', textColor: 'text-[#EF4444]' },
  ];

  const inventoryData = [
    { id: 1, name: 'Grade 8.8 Hex Bolts', subtitle: 'Industrial Series', category: 'Fasteners', status: 'HEALTHY', price: '1,240.00', qty: '850 Units' },
    { id: 2, name: 'Industrial Copper Coil', subtitle: 'Grade A Conductors', category: 'Conductors', status: 'LOW STOCK', price: '18,500.00', qty: '12 Units' },
    { id: 3, name: 'Hydraulic Pump Unit v2', subtitle: 'Heavy Lift Systems', category: 'Pumps', status: 'OUT OF STOCK', price: '142,000.00', qty: '0 Units' },
    { id: 4, name: 'Reinforcement Bars (12mm)', subtitle: 'TMT Structural Steel', category: 'Steel', status: 'HEALTHY', price: '54,000.00', qty: '45 Tons' },
  ];

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <VendorLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Inventory Management</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Enterprise-grade tracking for infrastructure supplies.</p>
          </div>
          <Link
            to="/vendor/products/add"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-5 py-2 font-extrabold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30 shadow-sm w-full md:w-auto"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 border-l-4 ${kpi.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${kpi.textColor}`} />
                  <span className="text-sm font-bold text-slate-500">{kpi.title}</span>
                </div>
                <div className={`text-3xl font-extrabold ${kpi.textColor}`}>
                  {kpi.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Inventory Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, SKU or category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all font-medium placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <select
                className="appearance-none flex-1 md:flex-none flex items-center justify-between gap-2 pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Fasteners">Fasteners</option>
                <option value="Conductors">Conductors</option>
                <option value="Pumps">Pumps</option>
                <option value="Steel">Steel</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                className="appearance-none flex-1 md:flex-none flex items-center justify-between gap-2 pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">Stock Status</option>
                <option value="HEALTHY">Healthy</option>
                <option value="LOW STOCK">Low Stock</option>
                <option value="OUT OF STOCK">Out of Stock</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        {(selectedCategory !== 'All' || selectedStatus !== 'All' || searchTerm) && (
          <div className="flex items-center gap-3 flex-wrap">
            {selectedCategory !== 'All' && (
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-[#F97316]">
                  <span className="text-orange-700/70 mr-1">Category:</span>
                  {selectedCategory}
                </span>
                <button onClick={() => setSelectedCategory('All')} className="ml-2 p-0.5 rounded-full hover:bg-orange-200 text-[#F97316] transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedStatus !== 'All' && (
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-[#F97316]">
                  <span className="text-orange-700/70 mr-1">Status:</span>
                  {selectedStatus === 'HEALTHY' ? 'Healthy' : selectedStatus === 'LOW STOCK' ? 'Low Stock' : 'Out of Stock'}
                </span>
                <button onClick={() => setSelectedStatus('All')} className="ml-2 p-0.5 rounded-full hover:bg-orange-200 text-[#F97316] transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {searchTerm && (
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-[#F97316]">
                  <span className="text-orange-700/70 mr-1">Search:</span>
                  "{searchTerm}"
                </span>
                <button onClick={() => setSearchTerm('')} className="ml-2 p-0.5 rounded-full hover:bg-orange-200 text-[#F97316] transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <button onClick={clearAllFilters} className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-200 hover:bg-slate-300 transition-colors rounded-full px-3 py-1">
              Clear all
            </button>
          </div>
        )}

        {/* Inventory Table Container */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Price (₹)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Available Qty</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-[#0F172A] text-sm group-hover:text-[#F97316] transition-colors cursor-pointer">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'HEALTHY' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                          Healthy
                        </span>
                      )}
                      {item.status === 'LOW STOCK' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wider">
                          Low Stock
                        </span>
                      )}
                      {item.status === 'OUT OF STOCK' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-red-100 text-red-700 uppercase tracking-wider">
                          Out Of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-slate-700">
                      {item.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-extrabold ${item.status === 'OUT OF STOCK' ? 'text-red-500' : 'text-slate-700'}`}>
                        {item.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/vendor/products/edit/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-extrabold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-orange-500/20 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium">
                      No products match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-slate-500">
              Showing <span className="font-extrabold text-slate-700">1-10</span> of <span className="font-extrabold text-slate-700">1,284</span> results
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Rows per page:</span>
                <button className="flex items-center gap-1 text-sm font-extrabold text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1">
                  10 <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors" disabled>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#D97706] text-white font-extrabold text-sm">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-600 font-extrabold text-sm hover:bg-slate-200 transition-colors">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-600 font-extrabold text-sm hover:bg-slate-200 transition-colors">
                  3
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-600 font-extrabold text-sm hover:bg-slate-200 transition-colors">
                  129
                </button>
                <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </VendorLayout>
  );
};

export default Inventory;
