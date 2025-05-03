import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = ({ orderNumber, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 mb-2">Your order number</p>
          <p className="text-xl font-bold">#{orderNumber}</p>
        </div>
        
        <p className="text-gray-600 mb-6">
          Thank you for your order! You will receive a notification when your order is ready for pickup or delivery.
        </p>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={onClose}
            className="bg-red-900 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
          >
            Close
          </button>
          
          <Link 
            to="/"
            className="text-red-900 px-6 py-2 rounded-lg border border-red-900 hover:bg-red-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 