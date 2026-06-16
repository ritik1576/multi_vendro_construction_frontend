import { MessageSquare } from 'lucide-react';

export const ReviewEmptyState = ({ title = "No reviews yet", message = "Reviews appear after delivered orders." }) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-100 rounded-[12px]">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
        <MessageSquare className="w-5 h-5 text-slate-300" />
      </div>
      <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-1">{title}</h3>
      <p className="text-[13px] font-medium text-slate-500 max-w-sm">{message}</p>
    </div>
  );
};
