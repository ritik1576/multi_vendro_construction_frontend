import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { emailTemplateService } from '../services/emailTemplateService';
import { DynamicField } from './DynamicField';
import { formatTemplateName } from '../utils/formatters';

export const TemplateEditModal = ({ isOpen, onClose, templateKey, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    isActive: true,
    editableVariables: {}
  });

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emailTemplateService.getTemplateDetails(templateKey);
      setFormData({
        subject: data.subject || '',
        isActive: data.isActive ?? true,
        editableVariables: data.editableVariables || {}
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch template details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && templateKey) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, templateKey]);

  if (!isOpen) return null;

  const handleVariableChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      editableVariables: {
        ...prev.editableVariables,
        [key]: value
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await emailTemplateService.updateTemplate(templateKey, formData);
      onSuccess?.('Template saved successfully');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save template');
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset this template to its default settings? Any custom changes will be lost.')) {
      return;
    }
    
    setResetting(true);
    setError(null);
    try {
      await emailTemplateService.resetTemplate(templateKey);
      await fetchDetails();
      // Show success toast here if global toast system is available, 
      // or rely on the parent component.
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reset template');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--color-primary-dark)]">
              Edit Template: {formatTemplateName(templateKey)}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1 font-mono">
              {templateKey}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-main)]" />
              <p className="text-sm font-bold text-slate-500">Loading template details...</p>
            </div>
          ) : (
            <form id="template-edit-form" onSubmit={handleSave} className="space-y-6">
              
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Status & Subject Section */}
              <div className="space-y-6 p-5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-customText-primary)]">
                      Status
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">Enable or disable this template</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success-main)]"></div>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[var(--color-customText-primary)]">
                    Email Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--color-primary-main)] focus:border-transparent transition-all outline-none"
                    placeholder="Enter email subject"
                  />
                </div>
              </div>

              {/* Editable Variables Section */}
              <div className="space-y-6">
                <div className="pb-2 border-b border-slate-200 flex justify-between items-end">
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-primary-dark)]">Email Content</h3>
                    <p className="text-xs text-slate-500 mt-1">Update the variables below to customize the email.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={resetting || saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    {resetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                    Reset to Default
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  {Object.entries(formData.editableVariables).map(([key, value]) => (
                    <div key={key} className={key.toLowerCase().includes('message') || key.toLowerCase().includes('description') ? 'md:col-span-2' : ''}>
                      <DynamicField 
                        fieldKey={key} 
                        value={value} 
                        onChange={handleVariableChange} 
                      />
                    </div>
                  ))}
                  {Object.keys(formData.editableVariables).length === 0 && (
                    <div className="col-span-full py-8 text-center text-slate-500 text-sm font-medium bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      No editable variables found for this template.
                    </div>
                  )}
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving || resetting}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="template-edit-form"
            disabled={saving || resetting || loading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-[var(--color-primary-main)] rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
