import React from 'react';

const steps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

const OrderStatusProgress = ({ currentStep = 0, isCancelled = false }) => {
  if (isCancelled) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-red-200 bg-white p-6 shadow-sm">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-red-600">Order Cancelled</h3>
          <p className="text-sm text-slate-500">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#0F172A]">Order Status</h3>
        <p className="text-sm text-slate-500">Track the order lifecycle with clear progress stages.</p>
      </div>

      <div className="space-y-5">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const circleStyle = isCompleted
            ? 'border-[#F97316] bg-[#FFF4E6] text-[#F97316]'
            : isCurrent
            ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
            : 'border-slate-300 bg-slate-100 text-slate-500';
          const lineStyle = isCompleted ? 'bg-[#F97316]' : 'bg-slate-200';

          return (
            <div key={label} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold ${circleStyle}`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`mt-2 h-full w-px ${lineStyle}`} style={{ minHeight: 54 }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-sm font-semibold ${isCurrent ? 'text-[#1E3A8A]' : 'text-slate-900'}`}>{label}</p>
                  {isCompleted && (
                    <span className="rounded-full bg-[#FFF4E6] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F97316]">
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <span className="rounded-full bg-[#E0F2FE] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1E3A8A]">
                      Current
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-xs ${isCompleted || isCurrent ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isCompleted
                    ? 'Step completed'
                    : isCurrent
                    ? 'Current processing stage'
                    : 'Upcoming step'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusProgress;
