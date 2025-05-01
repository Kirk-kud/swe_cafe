import React, { useState } from 'react';
import { usePayment } from '../../contexts/PaymentContext';

const MobileMoneyPayment = ({ amount, onSuccess, onError }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('mtn');
  const { processPayment } = usePayment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await processPayment({
        method: 'mobile_money',
        amount,
        details: {
          phoneNumber,
          network
        }
      });
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Mobile Money Payment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0244XXXXXXX"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="mtn">MTN</option>
            <option value="vodafone">Vodafone</option>
            <option value="airteltigo">AirtelTigo</option>
          </select>
        </div>

        <div className="text-lg font-semibold">
          Amount: GHC {amount.toFixed(2)}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Pay with Mobile Money
        </button>
      </form>
    </div>
  );
};

export default MobileMoneyPayment; 