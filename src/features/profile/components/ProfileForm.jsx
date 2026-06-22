import { useState, useEffect } from 'react';

const ProfileForm = ({ fields, initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
            <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                disabled={field.disabled || loading}
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[14px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-colors disabled:bg-slate-50 disabled:text-slate-500 resize-none"
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                disabled={field.disabled || loading}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[14px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-colors disabled:bg-slate-50 disabled:text-slate-500"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 text-[14px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-[14px] font-bold text-white bg-[#1E3A8A] border border-transparent rounded-lg hover:bg-[#172554] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
