import React from 'react';

const steps = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Out for Delivery',
  'Delivered',
];

const OrderStatusProgress = ({ currentStep = 2 }) => {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Order Status</h3>
          <p className="text-sm text-slate-500">Track your order journey with live progress.</p>
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((label, index) => {
          const status = index < currentStep ? 'completed' : index === currentStep ? 'current' : 'pending';
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';

          return (
            <div key={label} className="flex items-start gap-4">
              <div className="relative">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-full border-2 text-sm font-semibold ${
                    isCompleted
                      ? 'border-[#F97316] bg-[#FFF4E6] text-[#F97316]'
                      : isCurrent
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-slate-300 bg-slate-100 text-slate-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <span
                    className={`absolute left-1/2 top-full h-20 w-px -translate-x-1/2 ${
                      isCompleted ? 'bg-[#F97316]' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-sm font-semibold ${isCurrent ? 'text-[#1E3A8A]' : 'text-slate-900'}`}>{label}</p>
                  {isCompleted && <span className="rounded-full bg-[#FFF4E6] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F97316]">Done</span>}
                  {isCurrent && <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1E3A8A]">In progress</span>}
                </div>
                <p className={`mt-1 text-xs ${isCompleted || isCurrent ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isCompleted ? 'Completed successfully' : isCurrent ? 'Current step in the delivery process' : 'Pending step'}
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
