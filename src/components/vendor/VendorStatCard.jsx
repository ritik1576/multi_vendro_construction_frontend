const VendorStatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#1E3A8A]/30 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-[#0F172A]">{value}</h3>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-[#F97316]">
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm font-semibold">
          <span className={trend > 0 ? "text-emerald-600" : "text-red-600"}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
          <span className="ml-2 text-slate-500">from last month</span>
        </div>
      )}
    </div>
  );
};

export default VendorStatCard;
