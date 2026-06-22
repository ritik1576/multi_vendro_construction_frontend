import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';

const KycDocumentPreview = ({ file, onRemove, disabled }) => {
  if (!file) return null;

  const isPdf = file.type === 'application/pdf';

  return (
    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50 mt-2">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded shrink-0">
          {isPdf ? (
            <FileText className="w-5 h-5 text-red-500" />
          ) : (
            <ImageIcon className="w-5 h-5 text-blue-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0F172A] truncate">{file.name}</p>
          <p className="text-xs font-medium text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      </div>
      {!disabled && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-bold text-red-600 hover:text-red-700 ml-4 shrink-0"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default KycDocumentPreview;
