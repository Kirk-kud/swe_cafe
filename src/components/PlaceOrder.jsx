import React, { useState } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { usePayment } from '../contexts/PaymentContext';
import { Button } from './ui/button';

export const PlaceOrder = ({ studentId, items }) => {
  const { createOrder, addItemToOrder, currentOrder } = useOrder();
  const { setPaymentMethod, processPayment } = usePayment();
  const [orderType, setOrderType] = useState('regular');
  const [paymentMethod, setPaymentMethodState] = useState('mobile_money');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethodState(method);
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      // Create the order
      const order = await createOrder(orderType, {
        studentId,
        items: []
      });

      // Add items to the order
      for (const item of items) {
        await addItemToOrder(item);
      }

      // Process payment
      const paymentResult = await processPayment(currentOrder.total);

      if (paymentResult.success) {
        // Update order status to paid
        await updateOrderStatus('paid');
        alert('Order placed successfully!');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Type
        </label>
        <select
          value={orderType}
          onChange={handleOrderTypeChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="regular">Regular</option>
          <option value="express">Express</option>
          <option value="group">Group</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="mobile_money">Mobile Money</option>
          <option value="card">Card</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>GHC {item.price}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-bold">
            <span>Total: GHC {currentOrder?.total || 0}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </Button>
    </div>
  );
}; 