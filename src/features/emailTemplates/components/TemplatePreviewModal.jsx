import React from 'react';
import { X } from 'lucide-react';

export const TemplatePreviewModal = ({ isOpen, onClose, template }) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-[var(--color-customBorder-light)] flex justify-between items-center bg-gray-50/50">
          <h3 className="font-extrabold text-[var(--color-primary-dark)] tracking-tight">Template Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-b border-[var(--color-customBorder-light)] pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase block mb-1">Template Name</span>
              <span className="text-sm font-bold text-[var(--color-customText-primary)]">{template.templateName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase block mb-1">Template Key</span>
              <span className="text-sm font-bold text-[var(--color-customText-primary)]">{template.templateKey}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-[10px] font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase block mb-1">Subject</span>
              <span className="text-sm font-bold text-[var(--color-customText-primary)]">{template.subject}</span>
            </div>
          </div>
          
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase block mb-2">HTML Content</span>
            <div className="border border-[var(--color-customBorder-light)] rounded bg-gray-50/50 p-4 min-h-[300px] overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: template.htmlContent }} />
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-[var(--color-customBorder-light)] bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold tracking-wide text-[var(--color-customText-secondary)] bg-white border border-[var(--color-customBorder-main)] rounded hover:bg-gray-50 transition-colors uppercase"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
