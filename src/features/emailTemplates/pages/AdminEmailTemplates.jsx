import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import { EmailTemplateTable } from '../components/EmailTemplateTable';
import { TemplatePreviewModal } from '../components/TemplatePreviewModal';
import { Plus } from 'lucide-react';

export const AdminEmailTemplates = () => {
  const { templates, loading, error } = useEmailTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* Page Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-primary-dark)]">Email Templates</h1>
            <p className="text-sm font-medium text-[var(--color-customText-secondary)] mt-1">
              Manage system email templates used by automated notifications.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto relative group">
            <button 
              disabled
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide text-white bg-[var(--color-primary-main)] rounded opacity-50 cursor-not-allowed uppercase shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg">
              Create API not available yet
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {/* Templates Table */}
        <EmailTemplateTable 
          templates={templates} 
          loading={loading} 
          onPreview={handlePreview} 
        />
        
        {/* Preview Modal */}
        <TemplatePreviewModal 
          isOpen={isPreviewModalOpen} 
          onClose={closePreviewModal} 
          template={selectedTemplate} 
        />

      </div>
    </AdminLayout>
  );
};
