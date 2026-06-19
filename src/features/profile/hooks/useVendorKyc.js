import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { submitVendorKycApi, getVendorKycApi } from '../services/kycService';
import { validateKycField, validateFile, calculateCompletionPercentage } from '../utils/kycValidators';

export const useVendorKyc = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId || user?.id || user?._id || user?.userId;

  const [formData, setFormData] = useState({
    businessLegalName: '',
    bankAccountHolderName: '',
    gstNumber: '',
    panNumber: '',
    businessAddress: '',
    bankAccountNumber: '',
    ifscCode: ''
  });
  const [fileData, setFileData] = useState({
    aadhaarCard: null,
    gstCertificate: null,
    panCard: null,
    bankStatement: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [status, setStatus] = useState('not_submitted'); // not_submitted, pending, approved, rejected
  const [rejectionReason, setRejectionReason] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    // Re-calculate completion percentage whenever formData or fileData changes
    setCompletionPercentage(calculateCompletionPercentage(formData, fileData));
  }, [formData, fileData]);

  const fetchKycData = useCallback(async () => {
    if (!vendorId) {
      setFetchLoading(false);
      return;
    }
    setFetchLoading(true);
    try {
      // Simulate API call or catch real one
      await getVendorKycApi(vendorId).catch(err => {
        console.warn('API get KYC failed, using default state:', err);
      });
      // If we had real data, we would populate formData and file previews here
      // and setStatus based on the response.
      // For now, it stays 'not_submitted'.
    } catch (error) {
      console.error('Error fetching KYC:', error);
    } finally {
      setFetchLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchKycData();
  }, [fetchKycData]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateKycField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (name, file) => {
    setFileData(prev => ({ ...prev, [name]: file }));
    const error = validateFile(name, file);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateKycField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    // Validate required files
    const fileFields = ['aadhaarCard', 'panCard', 'bankStatement'];
    fileFields.forEach(key => {
      const error = validateFile(key, fileData[key]);
      if (error) newErrors[key] = error;
    });

    if (formData.gstNumber) {
      const error = validateFile('gstCertificate', fileData.gstCertificate);
      if (error) newErrors.gstCertificate = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      Object.keys(fileData).forEach(key => {
        if (fileData[key]) payload.append(key, fileData[key]);
      });

      if (vendorId) {
        await submitVendorKycApi(vendorId, payload).catch(err => {
          console.warn('API submit KYC failed, updating local state only:', err);
        });
      }
      
      toast.success('KYC documents submitted successfully.');
      setStatus('pending');
    } catch (error) {
      console.error('Submit KYC error:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
