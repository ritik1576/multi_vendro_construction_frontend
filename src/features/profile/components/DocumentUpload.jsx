import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import KycDocumentPreview from './KycDocumentPreview';

const DocumentUpload = ({ label, name, accept, file, onChange, error, disabled, helperText }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(name, selectedFile);
    }
  };

  const handleRemove = () => {
    onChange(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-[#0F172A] mb-1">{label}</label>
      {helperText && <p className="text-xs font-medium text-slate-500 mb-2">{helperText}</p>}
      
      {!file ? (
        <div 
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
            error ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-[#1E3A8A] bg-slate-50 hover:bg-[#1E3A8A]/5'
          } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <UploadCloud className={`w-8 h-8 mb-2 ${error ? 'text-red-400' : 'text-slate-400'}`} />
          <p className="text-sm font-bold text-[#0F172A]">Click to upload document</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Maximum file size: 5MB</p>
          <input
            type="file"
            name={name}
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            disabled={disabled}
          />
        </div>
      ) : (
        <KycDocumentPreview file={file} onRemove={handleRemove} disabled={disabled} />
      )}
      
      {error && <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
};

export default DocumentUpload;
