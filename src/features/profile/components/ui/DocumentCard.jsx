import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

const DocumentCard = ({ name, url }) => {
  return (
    <div className="flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
          <FileText className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-[13px] font-bold text-[#0F172A] truncate flex-1">
          {name}
        </p>
      </div>
      
      {url ? (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-center gap-2 w-full py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-[#1E3A8A] hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
        >
          View Document <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <div className="inline-flex items-center justify-center w-full py-2 bg-slate-100 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-400 cursor-not-allowed">
          Not Provided
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
