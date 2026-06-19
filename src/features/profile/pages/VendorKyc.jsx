import React from 'react';
import VendorLayout from '../../../components/vendor/VendorLayout';
import { useVendorKyc } from '../hooks/useVendorKyc';
import VendorKycForm from '../components/VendorKycForm';
import KycStatusBadge from '../components/KycStatusBadge';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const VendorKyc = () => {
  const {
    formData,
    fileData,
    errors,
    loading,
    fetchLoading,
    status,
    rejectionReason,
    completionPercentage,
    handleTextChange,
    handleFileChange,
    handleSubmit
  } = useVendorKyc();

  if (fetchLoading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-[#1E3A8A]/30 border-t-[#1E3A8A] rounded-full animate-spin" />
        </div>
      </VendorLayout>
    );
  }

  const isLocked = status !== 'not_submitted';

  return (
    <VendorLayout>
      <div className="max-w-4xl mx-auto pb-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-[#1E3A8A]" />
              KYC Verification
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Submit your documents to verify your business and unlock all features.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-sm font-bold text-[#0F172A]">Status:</span>
            <KycStatusBadge status={status} />
          </div>
        </div>

        {/* Rejection Alert */}
        {status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">KYC Rejected</h4>
              {rejectionReason && <p className="text-sm text-red-600 mt-1 mb-2">{rejectionReason}</p>}
              <p className="text-sm font-medium text-red-700">Please contact InfraMart support for further assistance.</p>
            </div>
          </div>
        )}

        {/* Completion Progress Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-extrabold text-[#0F172A]">KYC Completion</h3>
            <span className="text-sm font-bold text-[#1E3A8A]">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#1E3A8A] h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">
            Complete all required fields and upload valid documents to reach 100%.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <VendorKycForm
            formData={formData}
            fileData={fileData}
            errors={errors}
            loading={loading}
            disabled={isLocked}
            onTextChange={handleTextChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorKyc;
