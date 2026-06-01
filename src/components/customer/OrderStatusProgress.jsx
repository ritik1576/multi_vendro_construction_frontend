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
          <h3 className="text-lg font-semibold text-slate-900">Order Status</h3>
          <p className="text-sm text-slate-500">Track your order journey</p>
        </div>
      </div>
      <div className="space-y-6">
        {steps.map((label, index) => {
          const completed = index <= currentStep;
          return (
            <div key={label} className="flex items-start gap-4">
              <div className="relative">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${completed ? 'border-sky-600 bg-sky-100 text-sky-700' : 'border-slate-300 bg-slate-100 text-slate-500'} text-sm font-semibold`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <span className={`absolute left-1/2 top-full h-12 w-px -translate-x-1/2 ${index < currentStep ? 'bg-sky-500' : 'bg-slate-200'}`} />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className={`text-sm font-semibold ${completed ? 'text-slate-900' : 'text-slate-500'}`}>{label}</p>
                <p className={`text-xs ${completed ? 'text-slate-500' : 'text-slate-400'}`}>
                  {completed ? 'Completed' : 'Pending'}
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
