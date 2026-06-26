import React from 'react';
import { Edit2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatTemplateName } from '../utils/formatters';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const EmailTemplateTable = ({ templates, loading, onPreview }) => {
  return (
    <div className="bg-white border border-[var(--color-customBorder-light)] rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-[var(--color-customBorder-light)] text-xs font-bold text-[var(--color-customText-secondary)] tracking-wider">
              <th className="px-6 py-4 text-left">Template Name</th>
              <th className="px-6 py-4 text-left">Template Key</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-left">Created At</th>
              <th className="px-6 py-4 text-left">Updated At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-customBorder-light)]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                  <td className="px-6 py-6"><div className="h-6 bg-gray-200 rounded-full w-16 mx-auto"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                  <td className="px-6 py-6"><div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
                </tr>
              ))
            ) : templates.length > 0 ? (
              templates.map((template, index) => (
                <tr key={template.templateKey || index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="text-sm font-bold text-[var(--color-primary-dark)] whitespace-nowrap">
                      {formatTemplateName(template.templateKey)}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-[var(--color-customText-primary)]">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 whitespace-nowrap">
                      {template.templateKey}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm text-[var(--color-customText-primary)] truncate max-w-xs">
                    {template.subject}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-center">
                    <StatusBadge isActive={template.isActive} />
                  </td>
                  <td className="px-6 py-6 text-xs text-[var(--color-customText-secondary)] font-medium whitespace-nowrap">
                    {formatDate(template.createdAt)}
                  </td>
                  <td className="px-6 py-6 text-xs text-[var(--color-customText-secondary)] font-medium whitespace-nowrap">
                    {formatDate(template.updatedAt || template.createdAt)}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button
                      onClick={() => onPreview(template)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-primary-main)] border border-[var(--color-primary-main)] rounded hover:bg-[var(--color-primary-main)] hover:text-white transition-colors"
                      title="Edit Template"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-sm font-medium text-[var(--color-customText-secondary)]">
                  No email templates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
