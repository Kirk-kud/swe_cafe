import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderService from '../api/orderService';
import OrderTracker from '../components/OrderTracker';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const data = await OrderService.getOrderById(orderId);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
        
        // For development - fallback demo data
        setOrder({
          id: orderId,
          date: '2023-07-17',
          time: '7:15 PM',
          restaurant_name: 'Akornor Restaurant',
          restaurant_id: 1,
          total_amount: 50.00,
          status: 'preparing',
          delivery_option: 'delivery',
          delivery_location: 'New Hosanna Hall, Room 204',
          payment_method: 'momo',
          payment_status: 'paid',
          estimated_delivery_time: '30-45 minutes',
          items: [
            { name: 'Tilapia with Banku', quantity: 1, price: 35.00 },
            { name: 'Kelewele', quantity: 1, price: 10.00 },
            { name: 'Soft Drink', quantity: 1, price: 5.00 }
          ],
          timeline: [
            { status: 'pending', timestamp: '2023-07-17 7:15 PM', message: 'Order placed' },
            { status: 'paid', timestamp: '2023-07-17 7:16 PM', message: 'Payment confirmed' },
            { status: 'preparing', timestamp: '2023-07-17 7:20 PM', message: 'Restaurant is preparing your order' }
          ]
        });
      }
    };
    
    fetchOrderDetails();
    
    // Set up order updates polling
    const pollingInterval = setInterval(() => {
      if (orderId) {
        OrderService.getOrderUpdates(orderId)
          .then(updates => {
            if (updates && updates.status) {
              setOrder(prev => {
                if (!prev) return null;
                return { ...prev, status: updates.status, timeline: updates.timeline || prev.timeline };
              });
            }
          })
          .catch(err => {
            console.error('Error polling order updates:', err);
          });
      }
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(pollingInterval);
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <Link to="/orders" className="font-semibold underline mt-2 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Order not found. It may have been cancelled or removed.</p>
          <Link to="/orders" className="font-semibold underline mt-2 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <Link to="/orders" className="text-blue-600 hover:underline">
          Back to Orders
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">Order Information</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Restaurant</p>
                  <p className="font-semibold">{order.restaurant_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{order.date} at {order.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Method</p>
                  <p className="font-semibold capitalize">{order.delivery_option}</p>
                </div>
                {order.delivery_option === 'delivery' && (
                  <div>
                    <p className="text-sm text-gray-500">Delivery Location</p>
                    <p className="font-semibold">{order.delivery_location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold capitalize">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">Order Items</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-3 flex justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₵{(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>₵{order.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Tracking */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg">Order Status</h2>
            </div>
            <div className="p-4">
              <OrderTracker orderId={order.id} />
              
              {order.status === 'preparing' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-center text-blue-800">
                    Estimated delivery time: {order.estimated_delivery_time}
                  </p>
                </div>
              )}
              
              {/* Order Timeline */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Order Updates</h3>
                <div className="space-y-4">
                  {order.timeline.map((update, idx) => (
                    <div key={idx} className="flex">
                      <div className="mr-4 relative">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        {idx < order.timeline.length - 1 && (
                          <div className="h-full w-0.5 bg-blue-200 absolute top-3 left-1.5 -ml-px"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold">{update.message}</p>
                        <p className="text-xs text-gray-500">{update.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cancel Order Button */}
              {order.status === 'pending' && (
                <div className="mt-6">
                  <button 
                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        OrderService.cancelOrder(order.id)
                          .then(() => {
                            setOrder(prev => ({ ...prev, status: 'cancelled' }));
                          })
                          .catch(err => {
                            alert('Failed to cancel order. Please try again.');
                            console.error('Error cancelling order:', err);
                          });
                      }
                    }}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 