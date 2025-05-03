import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderService from '../api/orderService';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching orders for user:', user.id);
        const data = await OrderService.getUserOrders(user.id);
        console.log('Orders data received:', data);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your order history from the server.');
        setOrders([]);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">No orders to display.</p>
          <Link 
            to="/RestaurantProfiles" 
            className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-800"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Please log in to view your order history.</p>
          <Link to="/login" className="font-semibold underline">
            Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link 
            to="/RestaurantProfiles" 
            className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-800"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{order.restaurant_name}</p>
                    <p className="text-sm text-gray-500">
                      {order.date} at {order.time}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                    <span className="text-sm mt-1">Order #{order.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50">
                <h3 className="text-sm font-semibold mb-2">Order Items</h3>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between py-1 text-sm">
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span className="font-semibold">
                        ₵{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold">Total: ₵{order.total_amount.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to={`/orders/${order.id}`} 
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Track Order
                  </Link>
                  
                  {order.status === 'pending' && (
                    <button 
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          OrderService.cancelOrder(order.id)
                            .then(() => {
                              // Update the order in the list
                              setOrders(orders.map(o => 
                                o.id === order.id ? { ...o, status: 'cancelled' } : o
                              ));
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
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 