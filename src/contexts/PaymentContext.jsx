import React, { createContext, useContext, useState } from 'react';
import { PaymentContext as PaymentStrategyContext, MobileMoneyPayment, CardPayment, CashPayment } from '../features/orders/PaymentStrategy';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentStrategy, setPaymentStrategy] = useState(new MobileMoneyPayment());
  const [paymentStatus, setPaymentStatus] = useState(null);
  const paymentContext = new PaymentStrategyContext(paymentStrategy);

  const setPaymentMethod = (method) => {
    switch (method) {
      case 'mobile_money':
        setPaymentStrategy(new MobileMoneyPayment());
        break;
      case 'card':
        setPaymentStrategy(new CardPayment());
        break;
      case 'cash':
        setPaymentStrategy(new CashPayment());
        break;
      default:
        throw new Error('Invalid payment method');
    }
  };

  const processPayment = async (amount) => {
    try {
      const result = await paymentContext.processPayment(amount);
      setPaymentStatus(result);
      return result;
    } catch (error) {
      setPaymentStatus({ success: false, error: error.message });
      throw error;
    }
  };

  const value = {
    paymentStatus,
    setPaymentMethod,
    processPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}; 