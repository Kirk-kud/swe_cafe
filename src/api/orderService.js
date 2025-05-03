// Define the base API URL - same as used in other services
const API_BASE_URL = 'http://localhost:3000';

/**
 * Service for order history and tracking
 */
const OrderService = {
  /**
   * Get all orders for a specific user
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>} - Array of user orders
   */
  async getUserOrders(userId) {
    try {
      console.log(`Fetching orders for user ${userId}`);
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/orders`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Orders response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  /**
   * Get a specific order by ID
   * @param {string} orderId - The ID of the order
   * @returns {Promise<Object>} - Order details
   */
  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  /**
   * Get updates for a specific order (for real-time tracking)
   * @param {string} orderId - The ID of the order
   * @returns {Promise<Object>} - Order status updates
   */
  async getOrderUpdates(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/updates`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching order updates:', error);
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {string} orderId - The ID of the order to cancel
   * @returns {Promise<Object>} - Cancellation response
   */
  async cancelOrder(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
};

export default OrderService; 