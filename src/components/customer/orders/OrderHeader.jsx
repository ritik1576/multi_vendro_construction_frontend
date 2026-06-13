import React from 'react';

const OrderHeader = () => {
  return (
    <div className="w-full rounded-xl bg-[#1E3A8A] text-white p-5 shadow-sm mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Order History</h1>
        <p className="text-[#93C5FD] text-sm font-medium">
          Track and manage your industrial procurement requests in real-time.
        </p>
      </div>
    </div>
  );
};

export default OrderHeader;
