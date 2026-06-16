export const ReviewSkeleton = () => {
  return (
    <div className="py-6 border-b border-slate-100 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="w-full sm:w-48 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3 w-full">
          <div className="flex justify-between">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
          <div className="h-5 bg-slate-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
