import React from 'react';
import { FileCheck, Building2, Landmark } from 'lucide-react';
import ProfileCard from './ui/ProfileCard';
import SectionHeader from './ui/SectionHeader';
import ProfileField from './ui/ProfileField';
import StatusBadge from './ui/StatusBadge';
import DocumentCard from './ui/DocumentCard';
import { formatDate } from '../utils/profileFormatters';

const VendorKycDetailsCard = ({ kycData, loading }) => {
  if (loading) {
    return (
      <ProfileCard className="animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-32 bg-slate-100 rounded"></div>
          <div className="h-32 bg-slate-100 rounded"></div>
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <SectionHeader icon={FileCheck} title="KYC Details" />
      
      {/* 2-Column Split: Business vs Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        
        {/* Business Column */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="text-[13px] font-extrabold text-[#1E3A8A] uppercase tracking-widest">Business Information</h3>
          </div>
          <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
            <ProfileField label="Business Legal Name" value={kycData?.businessLegalName} />
            <ProfileField label="GST Number" value={kycData?.gstNumber} />
            <ProfileField label="PAN Number" value={kycData?.panNumber} />
            <ProfileField label="Business Address">
              <p className="text-[14px] font-bold text-[#0F172A] leading-relaxed">
                {kycData?.businessAddress || 'Not provided'}
              </p>
            </ProfileField>
          </div>
        </div>

        {/* Bank Column */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Landmark className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="text-[13px] font-extrabold text-[#1E3A8A] uppercase tracking-widest">Bank Details</h3>
          </div>
          <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
            <ProfileField label="Bank Account Name" value={kycData?.bankAccountName} />
            <ProfileField label="Bank Account Number" value={kycData?.bankAccountNumber} />
            <ProfileField label="IFSC Code" value={kycData?.ifscCode} />
          </div>
        </div>

      </div>

      {/* Documents */}
      <div className="mt-10 pt-8 border-t border-slate-100">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-slate-400 mb-6">Uploaded Documents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <DocumentCard name="Aadhaar Document" url={kycData?.aadhaarDocumentUrl} />
          <DocumentCard name="GST Certificate" url={kycData?.gstCertificateUrl} />
          <DocumentCard name="PAN Card" url={kycData?.panCardUrl} />
          <DocumentCard name="Bank Statement" url={kycData?.bankStatementUrl} />
        </div>
      </div>

      {/* Status and Dates */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-x-12 gap-y-6">
        <ProfileField label="Verification Status">
          <StatusBadge status={kycData?.status} />
        </ProfileField>
        <ProfileField label="Submitted At" value={formatDate(kycData?.submittedAt || kycData?.createdAt)} />
        <ProfileField label="Verified At" value={formatDate(kycData?.verifiedAt)} />
      </div>

    </ProfileCard>
  );
};

export default VendorKycDetailsCard;
