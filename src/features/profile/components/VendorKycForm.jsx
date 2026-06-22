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
              name="BusinessLegalName"
              value={formData.BusinessLegalName}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${
                errors.BusinessLegalName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.BusinessLegalName && <p className="mt-1 text-xs font-bold text-red-600">{errors.BusinessLegalName}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Business Address *</label>
            <textarea
              name="BusinessAddress"
              value={formData.BusinessAddress}
              onChange={onTextChange}
              disabled={disabled || loading}
              rows={3}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 resize-none ${
                errors.BusinessAddress ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.BusinessAddress && <p className="mt-1 text-xs font-bold text-red-600">{errors.BusinessAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">GST Number (Optional)</label>
            <input
              type="text"
              name="GstNumber"
              value={formData.GstNumber}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 uppercase ${
                errors.GstNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.GstNumber && <p className="mt-1 text-xs font-bold text-red-600">{errors.GstNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">PAN Number *</label>
            <input
              type="text"
              name="PanNumber"
              value={formData.PanNumber}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 uppercase ${
                errors.PanNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.PanNumber && <p className="mt-1 text-xs font-bold text-red-600">{errors.PanNumber}</p>}
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
              name="BankAccountName"
              value={formData.BankAccountName}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${
                errors.BankAccountName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.BankAccountName && <p className="mt-1 text-xs font-bold text-red-600">{errors.BankAccountName}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Account Number *</label>
            <input
              type="text"
              name="BankAccountNumber"
              value={formData.BankAccountNumber}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${
                errors.BankAccountNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.BankAccountNumber && <p className="mt-1 text-xs font-bold text-red-600">{errors.BankAccountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">IFSC Code *</label>
            <input
              type="text"
              name="IFSC"
              value={formData.IFSC}
              onChange={onTextChange}
              disabled={disabled || loading}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500 uppercase ${
                errors.IFSC ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]/20'
              }`}
            />
            {errors.IFSC && <p className="mt-1 text-xs font-bold text-red-600">{errors.IFSC}</p>}
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
            name="AadhaarPdf"
            accept="application/pdf"
            file={fileData.AadhaarPdf}
            onChange={onFileChange}
            error={errors.AadhaarPdf}
            disabled={disabled || loading}
          />

          <DocumentUpload
            label="PAN Card (Image only) *"
            name="PanCardUpload"
            accept="image/*"
            file={fileData.PanCardUpload}
            onChange={onFileChange}
            error={errors.PanCardUpload}
            disabled={disabled || loading}
          />

          <DocumentUpload
            label={`GST Certificate (PDF/Image) ${formData.GstNumber ? '*' : ''}`}
            name="GstCertificateUpload"
            accept="application/pdf,image/*"
            file={fileData.GstCertificateUpload}
            onChange={onFileChange}
            error={errors.GstCertificateUpload}
            disabled={disabled || loading}
          />

          <DocumentUpload
            label="Bank Statement / Passbook (PDF/Image) *"
            name="BankStatementUpload"
            accept="application/pdf,image/*"
            file={fileData.BankStatementUpload}
            onChange={onFileChange}
            error={errors.BankStatementUpload}
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
