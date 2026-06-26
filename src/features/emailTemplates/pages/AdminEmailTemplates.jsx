import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import { EmailTemplateTable } from '../components/EmailTemplateTable';
import { TemplateEditModal } from '../components/TemplateEditModal';

export const AdminEmailTemplates = () => {
  const { templates, loading, error, refetch } = useEmailTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleEditSuccess = () => {
    refetch();
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
          onPreview={handleEdit} 
        />
        
        {/* Edit Modal */}
        <TemplateEditModal 
          isOpen={isEditModalOpen} 
          onClose={closeEditModal} 
          templateKey={selectedTemplate?.templateKey}
          onSuccess={handleEditSuccess}
        />

      </div>
    </AdminLayout>
  );
};
