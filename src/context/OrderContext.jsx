import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// Define the base API URL - change this to your actual backend URL
const API_BASE_URL = 'http://localhost:3000'; // Assuming your backend runs on port 3000

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
      
      // Ensure delivery location is never empty for pickup options
      const finalDeliveryLocation = deliveryOption === 'pickup' ? 'Pickup at restaurant' : deliveryLocation || 'Not specified';
      
      const orderData = {
        user_id: userId,
        restaurant_id: currentOrder.restaurantId,
        delivery_location: finalDeliveryLocation,
        delivery_option: deliveryOption,
        payment_method: paymentMethod,
        total_amount: currentOrder.total,
        status: 'pending', // Add a default status
        items: currentOrder.items.map(item => ({
          item_id: item.item_id || item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name || item.title || 'Item' // Ensure item has a name
        }))
      };
      
      console.log('Order data:', orderData);
      
      try {
        // Use the full API URL instead of a relative path
        const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000, // 10 second timeout
          withCredentials: true // Include credentials if using cookies for auth
        });
        
        clearOrder();
        return response.data;
      } catch (apiError) {
        console.error('Order submission error:', apiError.response?.data || apiError.message);
        throw new Error(apiError.response?.data?.message || apiError.response?.data?.error || 'Failed to submit order. Please try again.');
      }
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