import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState({
    items: [],
    restaurantId: null,
    total: 0
  });

  const addItem = useCallback((item, restaurantId) => {
    setCurrentOrder(prev => {
      // Handle both item.id and item.item_id for flexibility
      const itemId = item.item_id || item.id;
      
      const existingItem = prev.items.find(i => 
        (i.item_id === itemId) || (i.id === itemId)
      );
      
      let newItems;
      
      if (existingItem) {
        newItems = prev.items.map(i => 
          (i.item_id === itemId || i.id === itemId)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Ensure the item has both id and item_id for consistency
        const normalizedItem = {
          ...item,
          id: item.id || item.item_id,
          item_id: item.item_id || item.id,
          quantity: 1
        };
        newItems = [...prev.items, normalizedItem];
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        restaurantId: restaurantId,
        total
      };
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setCurrentOrder(prev => {
      const newItems = prev.items.filter(item => 
        (item.item_id !== itemId) && (item.id !== itemId)
      );
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        total
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    setCurrentOrder(prev => {
      const newItems = prev.items.map(item => 
        (item.item_id === itemId || item.id === itemId)
          ? { ...item, quantity }
          : item
      );
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        total
      };
    });
  }, [removeItem]);

  const clearOrder = useCallback(() => {
    setCurrentOrder({
      items: [],
      restaurantId: null,
      total: 0
    });
  }, []);

  const submitOrder = useCallback(async (userId, deliveryLocation, deliveryOption, paymentMethod) => {
    try {
      console.log('Submitting order with payment method:', paymentMethod);
      
      const orderData = {
        user_id: userId,
        restaurant_id: currentOrder.restaurantId,
        delivery_location: deliveryLocation,
        delivery_option: deliveryOption,
        payment_method: paymentMethod,
        total_amount: currentOrder.total,
        items: currentOrder.items.map(item => ({
          item_id: item.item_id || item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      console.log('Order data:', orderData);
      
      // Use a mock order for now since we don't have a backend endpoint
      // In a real application, you would uncomment this and use a real endpoint
      // const response = await axios.post('http://localhost:3000/api/orders', orderData);
      
      // Mock response for development
      const mockResponse = {
        success: true,
        order_id: 'ORD' + Math.floor(Math.random() * 10000),
        message: 'Order placed successfully'
      };
      
      // For development/testing - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      clearOrder();
      return mockResponse;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  }, [currentOrder, clearOrder]);

  const value = {
    currentOrder,
    addItem,
    removeItem,
    updateQuantity,
    clearOrder,
    submitOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 