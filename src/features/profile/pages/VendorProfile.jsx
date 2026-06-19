import { useState, useEffect } from 'react';
import { Briefcase, Building, Phone, Mail, FileText, FileCheck, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import VendorLayout from '../../../components/vendor/VendorLayout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ProfileForm from '../components/ProfileForm';
import AddressSection from '../components/AddressSection';
import SecuritySection from '../components/SecuritySection';
import ProfileStatusCard from '../components/ProfileStatusCard';
import { getVendorKycStatusApi, getVendorKycDetailsApi } from '../services/kycService';
import KycStatusBadge from '../components/KycStatusBadge';

const VendorProfile = () => {
  const { user, profileData, loading, handleUpdateProfile, handleUpdatePassword } = useProfile();
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [kycStatusData, setKycStatusData] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  
  const authUser = useSelector((state) => state.auth.user);
  const vendorId = authUser?.vendorId || authUser?.id || authUser?._id || authUser?.userId;

  useEffect(() => {
    if (vendorId) {
      Promise.allSettled([
        getVendorKycStatusApi(vendorId),
        getVendorKycDetailsApi(vendorId)
      ]).then(([statusRes, detailsRes]) => {
        if (statusRes.status === 'fulfilled') setKycStatusData(statusRes.value);
        if (detailsRes.status === 'fulfilled') setKycDetails(detailsRes.value);
      });
    }
  }, [vendorId]);

  const businessFields = [
    { name: 'businessName', label: 'Business / Shop Name', type: 'text', fullWidth: true },
    { name: 'gstNumber', label: 'GST Number', type: 'text' },
    { name: 'phone', label: 'Business Phone', type: 'tel' },
    { name: 'description', label: 'Business Description', type: 'textarea', fullWidth: true },
  ];

  const handleBusinessSubmit = async (data) => {
    await handleUpdateProfile(data);
    setIsEditingBusiness(false);
  };

  const buildFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://multi-vendro-construction-backend-4.onrender.com';
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const isPdfFile = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const renderDocumentCard = (title, url) => {
    if (!url) return null;
    const fullUrl = buildFileUrl(url);
    const isPdf = isPdfFile(url);

    return (
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col h-full">
        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">{title}</h4>
        <div className="flex-1 flex flex-col justify-center">
          {isPdf ? (
            <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-lg h-32">
              <FileText className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-xs font-bold text-slate-700 mb-3">PDF Document</span>
              <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-bold rounded shadow-sm hover:bg-[#152e75] transition-colors">
                Open PDF
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-full">
              <div className="h-24 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src={fullUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 w-full flex justify-center bg-white">
                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-bold rounded shadow-sm hover:bg-[#152e75] transition-colors w-full text-center">
                  View Image
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Compute status map
  let mappedKycStatus = 'not_submitted';
  if (kycStatusData?.kycStatus) {
    if (kycStatusData.kycStatus === 'UnderReview') mappedKycStatus = 'pending';
    else if (kycStatusData.kycStatus === 'Approved') mappedKycStatus = 'approved';
    else if (kycStatusData.kycStatus === 'Rejected') mappedKycStatus = 'rejected';
  }

  return (
    <VendorLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Profile</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your business information and security settings.</p>
        </div>

        <ProfileHeader user={user} roleText="Vendor" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileStatusCard 
            title="Approval Status" 
            status={profileData?.status || 'Pending'} 
            message="Your vendor account approval status." 
          />
          <ProfileStatusCard 
            title="KYC Verification" 
            status={mappedKycStatus === 'not_submitted' ? 'Not Submitted' : profileData?.kycStatus || 'Pending'} 
            message="Status of your Know Your Customer documents." 
          />
        </div>

        <div className="space-y-6">
          <ProfileInfoCard title="Business Information" icon={Building} onEdit={!isEditingBusiness ? () => setIsEditingBusiness(true) : null}>
            {isEditingBusiness ? (
              <ProfileForm
                fields={businessFields}
                initialData={{
                  businessName: profileData?.businessName || profileData?.shopName,
                  gstNumber: profileData?.gstNumber,
                  phone: profileData?.phone || profileData?.phoneNumber,
                  description: profileData?.description
                }}
                onSubmit={handleBusinessSubmit}
                onCancel={() => setIsEditingBusiness(false)}
                loading={loading}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="md:col-span-2">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Name</p>
                  <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.businessName || profileData?.shopName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.phone || profileData?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">GST Number</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.gstNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </ProfileInfoCard>

          {/* KYC Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">KYC Details</h3>
                  <p className="text-sm font-medium text-slate-500">Your verification documents and status.</p>
                </div>
              </div>
              <KycStatusBadge status={mappedKycStatus} />
            </div>
            <div className="p-6">
              {mappedKycStatus === 'not_submitted' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                  <ShieldCheck className="w-12 h-12 text-slate-300 mb-3" />
                  <h4 className="text-base font-extrabold text-slate-900 mb-1">KYC Not Submitted Yet</h4>
                  <p className="text-sm font-medium text-slate-500 mb-4 max-w-sm">Complete your KYC verification to get your account fully approved and unlock all features.</p>
                  <Link to="/vendor/kyc" className="flex items-center gap-2 px-6 py-2.5 bg-[#1E3A8A] text-white text-sm font-extrabold rounded-lg hover:bg-[#152e75] transition-colors shadow-sm">
                    Complete KYC <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Read Only Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Legal Name</p>
                      <p className="text-[14px] font-extrabold text-[#0F172A]">{kycDetails?.businessLegalName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Address</p>
                      <p className="text-[14px] font-extrabold text-[#0F172A]">{kycDetails?.businessAddress || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">PAN Number</p>
                      <p className="text-[14px] font-extrabold text-[#0F172A]">{kycDetails?.panNumber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">GST Number</p>
                      <p className="text-[14px] font-extrabold text-[#0F172A]">{kycDetails?.gstNumber || '-'}</p>
                    </div>
                    <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-100">
                      <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" /> Banking Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Holder Name</p>
                          <p className="text-[14px] font-extrabold text-[#0F172A]">{kycDetails?.bankAccountName || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Number</p>
                          <p className="text-[14px] font-extrabold text-[#0F172A]">{kycDetails?.bankAccountNumber || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">IFSC Code</p>
                          <p className="text-[14px] font-extrabold text-[#0F172A]">{kycDetails?.ifscCode || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Submitted At</p>
                      <p className="text-[14px] font-extrabold text-slate-600">{formatDate(kycDetails?.submittedAt)}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-slate-400" /> Uploaded Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {renderDocumentCard('Aadhaar Document', kycDetails?.aadhaarDocumentUrl)}
                      {renderDocumentCard('PAN Card', kycDetails?.panCardUrl)}
                      {renderDocumentCard('GST Certificate', kycDetails?.gstCertificateUrl)}
                      {renderDocumentCard('Bank Statement', kycDetails?.bankStatementUrl)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <AddressSection profileData={profileData} handleUpdateProfile={handleUpdateProfile} loading={loading} />
          
          <SecuritySection handleUpdatePassword={handleUpdatePassword} loading={loading} />
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
