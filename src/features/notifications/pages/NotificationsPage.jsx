import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationSkeleton } from '../components/NotificationSkeleton';
import { Bell, CheckCheck, Trash2, Circle } from 'lucide-react';
import ProductListingNavbar from '../../../components/customer/catalog/ProductListingNavbar';
import VendorLayout from '../../../components/vendor/VendorLayout';
import AdminLayout from '../../../components/admin/AdminLayout';

export const NotificationsPage = ({ role = 'customer' }) => {
  const { 
    notifications, 
    isLoading, 
    unreadCount,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    deleteNotification,
    deleteAllNotifications
  } = useNotifications(role);

  const content = (
    <div className={`min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 ${role === 'customer' ? 'pt-[90px]' : ''}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded-full text-sm font-semibold">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-slate-500 mt-1">Manage your alerts and updates.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || notifications.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <CheckCheck className="h-3.5 w-3.5 text-blue-600" />
              Mark all read
            </button>
            <button 
              onClick={markAllAsUnread}
              disabled={notifications.length === 0 || unreadCount === notifications.length}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Circle className="h-3.5 w-3.5 text-slate-400" />
              Mark all unread
            </button>
            <button 
              onClick={deleteAllNotifications}
              disabled={notifications.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
        </div>



        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {error ? (
            <div className="p-8 text-center bg-red-50 text-red-600 font-medium">
              {error}
            </div>
          ) : isLoading ? (
            <div>
              {[1, 2, 3, 4, 5].map(i => <NotificationSkeleton key={i} />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Bell className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0F172A] mb-1">No notifications found</h3>
              <p className="text-[14px] font-medium text-slate-500">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkRead={markAsRead}
                  onMarkUnread={markAsUnread}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (role === 'vendor') {
    return <VendorLayout>{content}</VendorLayout>;
  }

  if (role === 'admin') {
    return <AdminLayout>{content}</AdminLayout>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <ProductListingNavbar />
      <div className="flex-1">
        {content}
      </div>
    </div>
  );
};
