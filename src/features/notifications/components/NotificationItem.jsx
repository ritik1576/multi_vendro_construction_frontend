import { Package, Truck, CreditCard, UserPlus, AlertCircle, Info, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNotificationTime } from '../utils/formatTime';

const getIconForType = (type) => {
  switch (type) {
    case 'Orders': return <Package className="h-5 w-5 text-blue-500" />;
    case 'Delivery': return <Truck className="h-5 w-5 text-green-500" />;
    case 'Payment': return <CreditCard className="h-5 w-5 text-purple-500" />;
    case 'Inventory': return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'Admin': return <UserPlus className="h-5 w-5 text-orange-500" />;
    case 'Reports': return <FileText className="h-5 w-5 text-indigo-500" />;
    case 'System':
    default:
      return <Info className="h-5 w-5 text-slate-500" />;
  }
};

export const NotificationItem = ({ notification, onMarkRead, onMarkUnread, onDelete }) => {
  const { id, type, title, message, timestamp, isRead, cta } = notification;

  return (
    <div className={`flex gap-4 p-5 border-b border-slate-100 transition-colors group relative ${!isRead ? 'bg-[#F8FAFC]' : 'bg-white hover:bg-slate-50'}`}>
      <div className="shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
          {getIconForType(type)}
        </div>
      </div>
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-2 mb-1">
          <p className={`text-[14px] font-extrabold truncate ${!isRead ? 'text-[#0F172A]' : 'text-slate-700'}`}>
            {title}
          </p>
          {timestamp && (
            <span className="text-[12px] font-medium text-slate-400 whitespace-nowrap">
              • {formatNotificationTime(timestamp)}
            </span>
          )}
        </div>
        <p className={`text-[13px] font-medium ${!isRead ? 'text-slate-600' : 'text-slate-500'} line-clamp-2`}>
          {message}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {type}
          </span>
          {cta && (
            <Link 
              to={cta.link}
              className="text-xs font-bold text-[#1E3A8A] hover:text-blue-800 hover:underline"
            >
              {cta.text}
            </Link>
          )}
        </div>
      </div>
      
      
      {/* Right Actions Block */}
      <div className="shrink-0 flex flex-col items-end justify-between ml-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isRead ? onMarkUnread(id) : onMarkRead(id);
            }}
            className="text-[11px] text-slate-500 hover:text-[#1E3A8A] font-extrabold bg-white px-2 py-1 rounded shadow-sm border border-slate-200 transition-colors"
          >
            {isRead ? 'Mark unread' : 'Mark read'}
          </button>
          {onDelete && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(id);
              }}
              className="text-[11px] text-slate-500 hover:text-red-600 font-extrabold bg-white px-2 py-1 rounded shadow-sm border border-slate-200 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
        {!isRead && (
          <div className="mt-auto flex items-center justify-end">
            <span className="w-2 h-2 bg-[#F97316] rounded-full mt-2"></span>
          </div>
        )}
      </div>
    </div>
  );
};
