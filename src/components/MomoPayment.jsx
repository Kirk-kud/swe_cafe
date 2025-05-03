import React, { useState } from 'react';

const MomoPayment = ({ amount, onCancel, onComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Enter number, 2: Processing, 3: Complete

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    setStep(2);
    
    try {
      // In a real app, you would make an API call to initiate payment
      // Here we're just simulating the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep(3);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setIsProcessing(false);
      setStep(1);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Mobile Money Payment</h2>
      
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Money Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter your Mobile Money number"
              className="w-full p-2 border rounded focus:ring-red-900 focus:border-red-900"
              maxLength="10"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your registered Mobile Money number to pay GHC {parseFloat(amount).toFixed(2)}
            </p>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-red-900 rounded-lg hover:bg-red-800 flex-1"
            >
              Pay GHC {parseFloat(amount).toFixed(2)}
            </button>
          </div>
        </form>
      )}
      
      {step === 2 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium mb-2">Processing Payment</h3>
          <p className="text-gray-600">
            We've sent a payment request to your mobile number. Please check your phone and approve the transaction.
          </p>
        </div>
      )}
      
      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
          <p className="text-gray-600">
            Your payment of GHC {parseFloat(amount).toFixed(2)} has been received.
          </p>
        </div>
      )}
    </div>
  );
};

export default MomoPayment; 