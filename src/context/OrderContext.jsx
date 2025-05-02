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
      const existingItem = prev.items.find(i => i.item_id === item.item_id);
      let newItems;
      
      if (existingItem) {
        newItems = prev.items.map(i => 
          i.item_id === item.item_id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...prev.items, { ...item, quantity: 1 }];
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
      const newItems = prev.items.filter(item => item.item_id !== itemId);
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
        item.item_id === itemId 
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

  const submitOrder = useCallback(async (userId, deliveryLocation, deliveryOption) => {
    try {
      const response = await axios.post('/api/orders', {
        student_id: userId,
        restaurant_id: currentOrder.restaurantId,
        items: currentOrder.items.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: currentOrder.total,
        delivery_location: deliveryLocation,
        delivery_option: deliveryOption
      });

      clearOrder();
      return response.data;
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