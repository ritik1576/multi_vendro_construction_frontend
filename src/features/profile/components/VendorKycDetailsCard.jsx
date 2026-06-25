import React from 'react';
import { FileCheck, ExternalLink } from 'lucide-react';
import { formatFallback, formatDate } from '../utils/profileFormatters';

const VendorKycDetailsCard = ({ kycData, loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  const renderDocumentLink = (url) => {
    if (!url) return <span className="text-[14px] font-medium text-slate-500">Not provided</span>;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-1 text-[12px] font-bold text-[#1E3A8A] hover:underline"
      >
        View Document <ExternalLink className="w-3 h-3" />
      </a>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <FileCheck className="w-5 h-5 text-slate-400" />
        <h2 className="text-[14px] font-extrabold uppercase tracking-widest text-[#0F172A]">
          KYC Details
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Legal Name</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(kycData?.businessLegalName)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bank Account Name</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(kycData?.bankAccountName)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">GST Number</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(kycData?.gstNumber)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">PAN Number</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(kycData?.panNumber)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bank Account Number</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(kycData?.bankAccountNumber)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">IFSC Code</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(kycData?.ifscCode)}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Address</p>
          <p className="text-[14px] font-bold text-[#0F172A] leading-relaxed">{formatFallback(kycData?.businessAddress)}</p>
        </div>

        {/* Documents */}
        <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
          <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[12px] font-bold text-[#0F172A] mb-1">Aadhaar Document</p>
              {renderDocumentLink(kycData?.aadhaarDocumentUrl)}
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#0F172A] mb-1">GST Certificate</p>
              {renderDocumentLink(kycData?.gstCertificateUrl)}
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#0F172A] mb-1">PAN Card</p>
              {renderDocumentLink(kycData?.panCardUrl)}
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#0F172A] mb-1">Bank Statement</p>
              {renderDocumentLink(kycData?.bankStatementUrl)}
            </div>
          </div>
        </div>

        {/* Status and Dates */}
        <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2 flex flex-wrap gap-6">
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold ${
              kycData?.status?.toLowerCase() === 'verified'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {formatFallback(kycData?.status)}
            </span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Submitted At</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{formatDate(kycData?.submittedAt || kycData?.createdAt)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Verified At</p>
            <p className="text-[14px] font-bold text-[#0F172A]">{formatDate(kycData?.verifiedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorKycDetailsCard;
