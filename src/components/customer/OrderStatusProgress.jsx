import React from 'react';

const steps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

const OrderStatusProgress = ({ currentStep = 0, isCancelled = false }) => {
  if (isCancelled) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <h3 className="text-[13px] font-extrabold text-red-700">Order Cancelled</h3>
        <p className="mt-1 text-[12px] text-slate-500">This order has been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-5 border-b border-slate-100 pb-3">
        Order Status
      </h2>

      <div className="space-y-0 relative">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          const circleClass = isCompleted 
            ? 'bg-[#EA580C] border-[#EA580C] text-white' 
            : isCurrent 
            ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white ring-4 ring-blue-50'
            : 'bg-white border-slate-300 text-slate-400';
            
          const lineClass = isCompleted ? 'bg-[#EA580C]' : 'bg-slate-200';

          return (
            <div key={label} className="flex gap-4 relative">
              {/* Connecting Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className={`absolute left-[11px] top-6 bottom-[-8px] w-0.5 ${lineClass}`} />
              )}
              
              {/* Step Indicator */}
              <div className="relative z-10 flex flex-col items-center shrink-0">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-extrabold transition-colors duration-300 ${circleClass}`}>
                  {isCompleted ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="pb-6 flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className={`text-[13px] font-extrabold ${isCurrent ? 'text-[#1E3A8A]' : isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                    {label}
                  </p>
                  {isCurrent && (
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#1E3A8A]">
                      Current
                    </span>
                  )}
                </div>
                <p className={`mt-0.5 text-[11px] ${isCompleted || isCurrent ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isCompleted ? 'Step completed' : isCurrent ? 'Processing...' : 'Upcoming step'}
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
