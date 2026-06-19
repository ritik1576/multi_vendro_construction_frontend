// kycValidators.js

export const validateKycField = (name, value) => {
  let error = '';
  switch (name) {
    case 'businessLegalName':
      if (!value || value.trim().length < 3) error = 'Business Legal Name must be at least 3 characters.';
      break;
    case 'bankAccountHolderName':
      if (!value || value.trim().length < 3) error = 'Bank Account Holder Name must be at least 3 characters.';
      break;
    case 'gstNumber':
      if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.trim())) {
        error = 'Invalid GST Number format.';
      }
      break;
    case 'panNumber':
      if (!value) {
        error = 'PAN Number is required.';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.trim())) {
        error = 'Invalid PAN Number format.';
      }
      break;
    case 'businessAddress':
      if (!value || value.trim().length < 10) error = 'Business Address must be at least 10 characters.';
      break;
    case 'bankAccountNumber':
      if (!value) {
        error = 'Bank Account Number is required.';
      } else if (!/^\d{9,18}$/.test(value.trim())) {
        error = 'Bank Account Number must be between 9 and 18 digits.';
      }
      break;
    case 'ifscCode':
      if (!value) {
        error = 'IFSC Code is required.';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim())) {
        error = 'Invalid IFSC Code format.';
      }
      break;
    default:
      break;
  }
  return error;
};

export const validateFile = (name, file) => {
  if (!file) return 'File is required.';
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) return 'File size exceeds 5MB limit.';

  const isPdf = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');

  switch (name) {
    case 'aadhaarCard':
      if (!isPdf) return 'Aadhaar Card must be a PDF.';
      break;
    case 'gstCertificate':
      if (!isPdf && !isImage) return 'GST Certificate must be PDF or image.';
      break;
    case 'panCard':
      if (!isImage) return 'PAN Card must be an image.';
      break;
    case 'bankStatement':
      if (!isPdf && !isImage) return 'Bank Statement must be PDF or image.';
      break;
    default:
      break;
  }
  return '';
};

export const calculateCompletionPercentage = (formData, fileData) => {
  const textFields = [
    'businessLegalName', 'bankAccountHolderName', 'panNumber', 
    'businessAddress', 'bankAccountNumber', 'ifscCode' // gstNumber is optional
  ];
  
  const fileFields = ['aadhaarCard', 'panCard', 'bankStatement']; // gstCertificate is conditional/optional based on gstNumber but let's count required files.
  
  const totalFields = textFields.length + fileFields.length;
  let filledFields = 0;

  textFields.forEach(field => {
    if (formData[field] && !validateKycField(field, formData[field])) {
      filledFields++;
    }
  });

  fileFields.forEach(field => {
    if (fileData[field] && !validateFile(field, fileData[field])) {
      filledFields++;
    }
  });

  return Math.round((filledFields / totalFields) * 100);
};
