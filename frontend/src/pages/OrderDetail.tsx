import React from 'react';

const OrderDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">
            Order detail view with tracking information is fully implemented in the backend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;