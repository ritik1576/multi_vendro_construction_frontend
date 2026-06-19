import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import KycStatusBadge from '../components/KycStatusBadge';
import { FileCheck, Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { getAdminVendorKycApi } from '../services/kycService';
import toast from 'react-hot-toast';

const AdminVendorKyc = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKycList = async () => {
      try {
        setLoading(true);
        // await getAdminVendorKycApi(); // Real API call
        // Using empty array to simulate Scaffold without fake data
        setKycRequests([]); 
      } catch (error) {
        console.error('Failed to fetch KYC requests:', error);
        // Optional: toast.error('Failed to fetch KYC requests');
      } finally {
        setLoading(false);
      }
    };
    fetchKycList();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
              <FileCheck className="w-7 h-7 text-[#1E3A8A]" />
              Vendor KYC Management
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Review and manage vendor KYC submissions.</p>
          </div>
        </div>

        {/* Filters & Search - Scaffolded UI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <select className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20">
               <option value="all">All Statuses</option>
               <option value="pending">Pending</option>
               <option value="approved">Approved</option>
               <option value="rejected">Rejected</option>
             </select>
          </div>
        </div>

        {/* Table Scaffold */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Vendor Name</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Business Legal Name</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">GST Number</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">PAN Number</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">KYC Status</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Submitted Date</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-[#1E3A8A]/30 border-t-[#1E3A8A] rounded-full animate-spin mb-4" />
                        <p className="text-sm font-medium text-slate-500">Loading records...</p>
                      </div>
                    </td>
                  </tr>
                ) : kycRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-sm font-medium text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileCheck className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-base font-bold text-[#0F172A] mb-1">No KYC Requests Found</p>
                        <p>There are currently no KYC applications matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  kycRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-[14px] font-extrabold text-[#0F172A]">{req.vendorName}</td>
                      <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{req.businessLegalName}</td>
                      <td className="px-6 py-4 text-[13px] font-mono text-slate-600">{req.gstNumber || '-'}</td>
                      <td className="px-6 py-4 text-[13px] font-mono text-slate-600">{req.panNumber}</td>
                      <td className="px-6 py-4"><KycStatusBadge status={req.status} /></td>
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-500">
                        {new Date(req.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-[#1E3A8A] hover:bg-blue-50 rounded transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
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

export default AdminVendorKyc;
