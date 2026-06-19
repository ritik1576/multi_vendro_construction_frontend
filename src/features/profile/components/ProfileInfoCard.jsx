import { Edit2 } from 'lucide-react';

const ProfileInfoCard = ({ title, icon: Icon, children, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-slate-400" />}
          <h2 className="text-base font-extrabold text-[#0F172A]">{title}</h2>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-sm font-bold text-[#1E3A8A] hover:text-[#0F172A] flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ProfileInfoCard;
