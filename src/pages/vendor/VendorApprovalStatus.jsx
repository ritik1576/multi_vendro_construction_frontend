import ApprovalStateCard from '../../components/vendor/ApprovalStateCard';
import VendorDashboard from './VendorDashboard';
import VendorLayout from '../../components/vendor/VendorLayout';

const VendorApprovalStatus = () => {
  // Dummy status: 'pending' | 'approved' | 'rejected'
const vendorStatus = 'approved';

  if (vendorStatus === 'pending') {
    return (
      <VendorLayout>
        <ApprovalStateCard state="pending" />
      </VendorLayout>
    );
  }

  if (vendorStatus === 'rejected') {
    return (
      <VendorLayout>
        <ApprovalStateCard state="rejected" />
      </VendorLayout>
    );
  }

  // If approved, show dashboard
  return (
    <VendorLayout>
      <VendorDashboard />
    </VendorLayout>
  );
};

export default VendorApprovalStatus;
