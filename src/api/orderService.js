import axios from 'axios';

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
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/orders`, {
        withCredentials: true
      });
      console.log('Orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      // No longer returning fallback demo data
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
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      // For development - fallback demo data
      return {
        id: orderId,
        date: '2023-07-17',
        time: '7:15 PM',
        restaurant_name: 'Akornor Restaurant',
        restaurant_id: 1,
        total_amount: 50.00,
        status: 'preparing',
        delivery_option: 'delivery',
        delivery_location: 'New Hosanna Hall, Room 204',
        payment_method: 'momo',
        payment_status: 'paid',
        estimated_delivery_time: '30-45 minutes',
        items: [
          { name: 'Tilapia with Banku', quantity: 1, price: 35.00 },
          { name: 'Kelewele', quantity: 1, price: 10.00 },
          { name: 'Soft Drink', quantity: 1, price: 5.00 }
        ],
        timeline: [
          { status: 'pending', timestamp: '2023-07-17 7:15 PM', message: 'Order placed' },
          { status: 'paid', timestamp: '2023-07-17 7:16 PM', message: 'Payment confirmed' },
          { status: 'preparing', timestamp: '2023-07-17 7:20 PM', message: 'Restaurant is preparing your order' }
        ]
      };
    }
  },

  /**
   * Get updates for a specific order (for real-time tracking)
   * @param {string} orderId - The ID of the order
   * @returns {Promise<Object>} - Order status updates
   */
  async getOrderUpdates(orderId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}/updates`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order updates:', error);
      // For development - fallback data for order updates
      return {
        status: 'preparing',
        updated_at: new Date().toISOString(),
        timeline: [
          { status: 'pending', timestamp: '2023-07-17 7:15 PM', message: 'Order placed' },
          { status: 'paid', timestamp: '2023-07-17 7:16 PM', message: 'Payment confirmed' },
          { status: 'preparing', timestamp: '2023-07-17 7:20 PM', message: 'Restaurant is preparing your order' }
        ]
      };
    }
  },

  /**
   * Cancel an order
   * @param {string} orderId - The ID of the order to cancel
   * @returns {Promise<Object>} - Cancellation response
   */
  async cancelOrder(orderId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      // For development - simulate successful cancellation
      return { success: true, message: 'Order cancelled successfully' };
    }
  }
};

export default OrderService; 