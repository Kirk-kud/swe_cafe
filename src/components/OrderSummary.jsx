import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const OrderSummary = ({ onClose }) => {
  const { currentOrder, updateQuantity, removeItem, submitOrder } = useOrder();
  const { user } = useAuth();
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleQuantityChange = (itemId, change) => {
    const item = currentOrder.items.find(i => i.item_id === itemId);
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
      await submitOrder(user.id, deliveryLocation, deliveryOption);
      onClose();
    } catch (err) {
      setError('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentOrder.items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Order</h2>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Order</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {currentOrder.items.map(item => (
          <div key={item.item_id} className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">₵{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(item.item_id, -1)}
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.item_id, 1)}
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₵{currentOrder.total.toFixed(2)}</span>
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
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

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