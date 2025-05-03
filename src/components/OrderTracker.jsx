import React from 'react';

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: '📝' },
  { status: 'confirmed', label: 'Order Confirmed', icon: '💼' },
  { status: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { status: 'ready', label: 'Ready for Pickup', icon: '✅' },
  { status: 'out_for_delivery', label: 'On the Way', icon: '🚚' },
  { status: 'delivered', label: 'Delivered', icon: '🎉' },
  { status: 'cancelled', label: 'Cancelled', icon: '❌' }
];

const OrderTracker = ({ order }) => {
  const getCurrentStepIndex = () => {
    if (!order || !order.status) return 0;
    return statusSteps.findIndex(step => step.status === order.status) || 0;
  };

  if (!order) {
    return <div className="text-center text-gray-500 py-4">No order information available</div>;
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="w-full mx-auto">
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
    </div>
  );
};

export default OrderTracker; 