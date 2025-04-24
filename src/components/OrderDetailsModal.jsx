import React from "react";
import { X, ShoppingBag, Clock, User, Phone } from "lucide-react";

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  // Sample detailed order data (in a real app, you'd fetch this based on order.id)
  const orderDetails = {
    id: order.id,
    customer: order.customer,
    phoneNumber: "+233 50 987 6543",
    items: [
      { name: order.items[0], price: "₵25.00", quantity: 1 },
      ...(order.items[1] ? [{ name: order.items[1], price: "₵8.00", quantity: 1 }] : [])
    ],
    subtotal: order.amount.replace("₵", ""),
    deliveryFee: "0.00",
    total: order.amount,
    status: order.status,
    paymentMethod: "Mobile Money",
    orderTime: order.time,
    estimatedDelivery: "30 minutes",
    specialInstructions: order.id === "#ORD-237" ? "Please include extra pepper sauce" : "",
    deliveryLocation: "Engineering Building, 2nd Floor"
  };

  // Function to calculate total price
  const calculateTotal = () => {
    return orderDetails.items.reduce((total, item) => {
      return total + (parseFloat(item.price.replace("₵", "")) * item.quantity);
    }, 0).toFixed(2);
  };

  // Function to get next status based on current status
  const getNextStatus = (currentStatus) => {
    const statusFlow = ["Pending", "Preparing", "Ready", "Delivered"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus(orderDetails.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-bold">Order Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              orderDetails.status === 'Delivered' ? 'bg-green-100 text-green-600' :
              orderDetails.status === 'Ready' ? 'bg-blue-100 text-blue-600' :
              orderDetails.status === 'Preparing' ? 'bg-yellow-100 text-yellow-600' :
              'bg-orange-100 text-orange-600'
            }`}>
              {orderDetails.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <ShoppingBag size={16} className="text-red-900" />
                </div>
                <div>
                  <h3 className="font-semibold">{orderDetails.id}</h3>
                  <p className="text-sm text-gray-500">Order ID</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <Clock size={16} className="text-red-900" />
                </div>
                <div>
                  <h3 className="font-semibold">{orderDetails.orderTime}</h3>
                  <p className="text-sm text-gray-500">Order Time</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <User size={16} className="text-red-900" />
                </div>
                <div>
                  <h3 className="font-semibold">{orderDetails.customer}</h3>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <Phone size={16} className="text-red-900" />
                </div>
                <div>
                  <h3 className="font-semibold">{orderDetails.phoneNumber}</h3>
                  <p className="text-sm text-gray-500">Contact</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Delivery Location</h3>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {orderDetails.deliveryLocation}
                </p>
              </div>
              
              {orderDetails.specialInstructions && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-1">Special Instructions</h3>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    {orderDetails.specialInstructions}
                  </p>
                </div>
              )}
            </div>
            
            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                {orderDetails.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between py-2 ${
                      index !== orderDetails.items.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{item.quantity}x</span>
                      <span className="ml-2">{item.name}</span>
                    </div>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₵{orderDetails.subtotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₵{orderDetails.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-red-900">{orderDetails.total}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Payment Method</h3>
                <p className="text-sm">{orderDetails.paymentMethod}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Update Order Status</h3>
                <div className="flex space-x-2">
                  {nextStatus ? (
                    <button 
                      onClick={() => onUpdateStatus(orderDetails.id, nextStatus)}
                      className={`flex-1 py-2 rounded text-white ${
                        nextStatus === 'Preparing' ? 'bg-yellow-500' :
                        nextStatus === 'Ready' ? 'bg-blue-500' :
                        nextStatus === 'Delivered' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    >
                      Mark as {nextStatus}
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="flex-1 py-2 rounded bg-gray-200 text-gray-500"
                    >
                      Order Completed
                    </button>
                  )}
                  
                  {orderDetails.status !== "Delivered" && orderDetails.status !== "Cancelled" && (
                    <button 
                      onClick={() => onUpdateStatus(orderDetails.id, "Cancelled")}
                      className="py-2 px-4 rounded bg-red-100 text-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 