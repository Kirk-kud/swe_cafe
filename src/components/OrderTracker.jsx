import React from 'react';
import { useOrder } from '../contexts/OrderContext';

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: '📝' },
  { status: 'paid', label: 'Payment Confirmed', icon: '💳' },
  { status: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { status: 'ready', label: 'Ready for Pickup', icon: '✅' },
  { status: 'delivered', label: 'Delivered', icon: '🎉' }
];

const OrderTracker = ({ orderId }) => {
  const { currentOrder } = useOrder();
  
  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.status === currentOrder?.status) || 0;
  };

  if (!currentOrder) {
    return <div>No order found</div>;
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Status</h2>
      
      {/* Order Info */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold">{currentOrder.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-semibold">GHC {currentOrder.total}</p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
        
        <div className="space-y-8 relative">
          {statusSteps.map((step, index) => (
            <div
              key={step.status}
              className={`flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className="w-1/2 pr-8 text-right">
                <div
                  className={`inline-flex items-center ${
                    index % 2 === 0 ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <h3 className={`text-lg font-semibold ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h3>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
              </div>
              
              <div className="w-1/2 pl-8">
                {index <= currentStep && (
                  <div className="text-sm text-gray-500">
                    {index === currentStep ? 'Current Status' : 'Completed'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Time */}
      {currentOrder.status === 'preparing' && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-center text-blue-800">
            Estimated preparation time: 15-20 minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTracker; 