import React from 'react';
import DocumentUpload from './DocumentUpload';

const VendorKycForm = ({ 
  formData, 
  fileData, 
  errors, 
  loading, 
  disabled, 
  onTextChange, 
  onFileChange, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Business Details Section */}
      <div>
        <h3 className="text-lg font-extrabold text-[#0F172A] mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Business Legal Name *</label>
            <input
              type="text"
              name="businessLegalName"
              value={formData.businessLegalName}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${
                errors.businessLegalName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.businessLegalName && <p className="mt-1 text-xs font-bold text-red-600">{errors.businessLegalName}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Business Address *</label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={onTextChange}
              disabled={disabled || loading}
              rows={3}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 resize-none ${
                errors.businessAddress ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.businessAddress && <p className="mt-1 text-xs font-bold text-red-600">{errors.businessAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">GST Number (Optional)</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 uppercase ${
                errors.gstNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.gstNumber && <p className="mt-1 text-xs font-bold text-red-600">{errors.gstNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">PAN Number *</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 uppercase ${
                errors.panNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.panNumber && <p className="mt-1 text-xs font-bold text-red-600">{errors.panNumber}</p>}
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Bank Details Section */}
      <div>
        <h3 className="text-lg font-extrabold text-[#0F172A] mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Account Holder Name *</label>
            <input
              type="text"
              name="bankAccountHolderName"
              value={formData.bankAccountHolderName}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${
                errors.bankAccountHolderName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.bankAccountHolderName && <p className="mt-1 text-xs font-bold text-red-600">{errors.bankAccountHolderName}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Account Number *</label>
            <input
              type="text"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${
                errors.bankAccountNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.bankAccountNumber && <p className="mt-1 text-xs font-bold text-red-600">{errors.bankAccountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">IFSC Code *</label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 uppercase ${
                errors.ifscCode ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.ifscCode && <p className="mt-1 text-xs font-bold text-red-600">{errors.ifscCode}</p>}
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Document Uploads Section */}
      <div>
        <h3 className="text-lg font-extrabold text-[#0F172A] mb-4">Document Uploads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUpload
            label="Aadhaar Card (PDF only) *"
            name="aadhaarCard"
            accept="application/pdf"
            file={fileData.aadhaarCard}
            onChange={onFileChange}
            error={errors.aadhaarCard}
            disabled={disabled || loading}
          />

          <DocumentUpload
            label="PAN Card (Image only) *"
            name="panCard"
            accept="image/*"
            file={fileData.panCard}
            onChange={onFileChange}
            error={errors.panCard}
            disabled={disabled || loading}
          />

          <DocumentUpload
            label={`GST Certificate (PDF/Image) ${formData.gstNumber ? '*' : ''}`}
            name="gstCertificate"
            accept="application/pdf,image/*"
            file={fileData.gstCertificate}
            onChange={onFileChange}
            error={errors.gstCertificate}
            disabled={disabled || loading}
          />

          <DocumentUpload
            label="Bank Statement / Passbook (PDF/Image) *"
            name="bankStatement"
            accept="application/pdf,image/*"
            file={fileData.bankStatement}
            onChange={onFileChange}
            error={errors.bankStatement}
            disabled={disabled || loading}
          />
        </div>
      </div>

      {!disabled && (
        <div className="flex justify-end pt-6 border-t border-slate-200 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#1E3A8A] border border-transparent rounded-lg hover:bg-[#172554] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Submit KYC'
            )}
          </button>
        </div>
      )}
    </form>
  );
};

export default VendorKycForm;
