import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { submitVendorKycApi, getVendorKycStatusApi } from '../services/kycService';
import { validateKycField, validateFile, calculateCompletionPercentage } from '../utils/kycValidators';

export const useVendorKyc = (vendorId, isOnboarding) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    BusinessLegalName: '',
    BankAccountName: '',
    GstNumber: '',
    PanNumber: '',
    BusinessAddress: '',
    BankAccountNumber: '',
    IFSC: ''
  });
  const [fileData, setFileData] = useState({
    AadhaarPdf: null,
    GstCertificateUpload: null,
    PanCardUpload: null,
    BankStatementUpload: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [status, setStatus] = useState('not_submitted'); // not_submitted, pending, approved, rejected
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    setCompletionPercentage(calculateCompletionPercentage(formData, fileData));
  }, [formData, fileData]);

  const fetchKycData = useCallback(async () => {
    if (!vendorId) {
      setFetchLoading(false);
      return;
    }
    setFetchLoading(true);
    try {
      const response = await getVendorKycStatusApi(vendorId);
      if (response && response.kycStatus) {
        // Map backend status to local state
        switch (response.kycStatus) {
          case 'UnderReview':
            setStatus('pending');
            break;
          case 'Approved':
            setStatus('approved');
            break;
          case 'Rejected':
            setStatus('rejected');
            break;
          default:
            setStatus('not_submitted');
        }
      } else {
        setStatus('not_submitted');
      }
    } catch (error) {
      console.warn('API get KYC status failed, assuming not_submitted:', error);
      setStatus('not_submitted');
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
    
    const fileFields = ['AadhaarPdf', 'PanCardUpload', 'BankStatementUpload'];
    fileFields.forEach(key => {
      const error = validateFile(key, fileData[key]);
      if (error) newErrors[key] = error;
    });

    if (formData.GstNumber) {
      const error = validateFile('GstCertificateUpload', fileData.GstCertificateUpload);
      if (error) newErrors.GstCertificateUpload = error;
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
      Object.keys(formData).forEach(key => payload.append(key, formData[key] ? String(formData[key]) : ''));
      Object.keys(fileData).forEach(key => {
        if (fileData[key] instanceof File || fileData[key] instanceof Blob) {
          payload.append(key, fileData[key]);
        }
      });
      if (vendorId) {
        payload.append('VendorId', String(vendorId));
      }

      await submitVendorKycApi(payload);
      
      if (isOnboarding) {
        sessionStorage.removeItem('pendingVendorId');
        dispatch({ type: 'LOGOUT' });
        navigate('/login', { state: { successMessage: 'KYC submitted successfully. Please login. Dashboard access will be available after admin approval.' } });
      } else {
        toast.success('KYC documents submitted successfully.');
        await fetchKycData();
      }
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
    completionPercentage,
    handleTextChange,
    handleFileChange,
    handleSubmit
  };
};
