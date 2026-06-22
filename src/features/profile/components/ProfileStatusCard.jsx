import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const ProfileStatusCard = ({ title, status, message }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
      case 'verified':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          label: status
        };
      case 'pending':
      case 'in_progress':
        return {
          icon: Clock,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          label: status
        };
      case 'rejected':
      case 'suspended':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: status
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl p-6 border ${config.border} ${config.bg} flex items-start gap-4`}>
      <div className={`mt-0.5 ${config.color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className={`text-[15px] font-extrabold ${config.color} mb-1`}>{title}</h3>
        <p className={`text-[13px] font-medium ${config.color} opacity-80`}>{message}</p>
      </div>
      <div className="ml-auto">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${config.bg} border ${config.border} ${config.color}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
};

export default ProfileStatusCard;
