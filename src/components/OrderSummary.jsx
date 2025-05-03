import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const OrderSummary = ({ onClose }) => {
  const { currentOrder, updateQuantity, removeItem, submitOrder } = useOrder();
  const { user } = useAuth();
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const handleQuantityChange = (itemId, change) => {
    const item = currentOrder.items.find(i => (i.item_id === itemId) || (i.id === itemId));
    if (item) {
      updateQuantity(itemId, item.quantity + change);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to place an order');
      return;
    }

    if (!deliveryLocation && deliveryOption === 'delivery') {
      setError('Please provide a delivery location');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitOrder(
        user.id, 
        deliveryLocation, 
        deliveryOption,
        paymentMethod
      );
      
      setOrderSubmitted(true);
      setOrderNumber(response.order_id || 'TMP' + Math.floor(Math.random() * 10000));
    } catch (err) {
      setError('Failed to submit order. Please try again.');
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSubmitted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">Your order number is <span className="font-semibold">#{orderNumber}</span></p>
          <p className="text-gray-600 mb-6">You will receive a notification when your order is ready.</p>
          <button
            onClick={onClose}
            className="bg-red-900 text-white px-6 py-2 rounded-lg hover:bg-red-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (currentOrder.items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Order</h2>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Order</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {currentOrder.items.map(item => {
          const itemId = item.item_id || item.id;
          const itemName = item.item_name || item.name;
          return (
            <div key={itemId} className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{itemName}</h3>
                <p className="text-sm text-gray-600">GHC {parseFloat(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(itemId, -1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(itemId, 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>GHC {currentOrder.total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Option
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="pickup"
                checked={deliveryOption === 'pickup'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="mr-2"
              />
              Pickup
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="delivery"
                checked={deliveryOption === 'delivery'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="mr-2"
              />
              Delivery
            </label>
          </div>
        </div>

        {deliveryOption === 'delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Location
            </label>
            <select
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a location</option>
              <option value="Charlotte">Charlotte</option>
              <option value="New Hosanna">New Hosanna</option>
              <option value="Old Hosanna">Old Hosanna</option>
              <option value="Queenstar">Queenstar</option>
              <option value="New Masere">New Masere</option>
              <option value="Old Masere">Old Masere</option>
              <option value="Dufie Annex">Dufie Annex</option>
              <option value="Dufie Platinum">Dufie Platinum</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col items-center border p-3 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="account"
                checked={paymentMethod === 'account'}
                onChange={() => setPaymentMethod('account')}
                className="mb-2"
              />
              <svg className="w-6 h-6 mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="text-sm">Account</span>
            </label>
            
            <label className="flex flex-col items-center border p-3 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={paymentMethod === 'momo'}
                onChange={() => setPaymentMethod('momo')}
                className="mb-2"
              />
              <svg className="w-6 h-6 mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm">Mobile Money</span>
            </label>
            
            <label className="flex flex-col items-center border p-3 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="mb-2"
              />
              <svg className="w-6 h-6 mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm">Cash</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-900 text-white py-2 rounded-lg hover:bg-red-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderSummary; 