import axios from 'axios';

// Define the base API URL
const API_BASE_URL = 'http://localhost:3000';

/**
 * Service for cafeteria management API calls
 */
export const CafeteriaService = {
  /**
   * Fetch menu items for a restaurant
   * @param {number} restaurantId - The ID of the restaurant
   * @returns {Promise<Array>} - The menu items
   */
  async getMenuItems(restaurantId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  /**
   * Add a new menu item
   * @param {number} restaurantId - The ID of the restaurant
   * @param {Object} menuItem - The menu item to add
   * @returns {Promise<Object>} - The created menu item
   */
  async addMenuItem(restaurantId, menuItem) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/restaurants/${restaurantId}/menu`, menuItem);
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  /**
   * Update a menu item
   * @param {number} menuItemId - The ID of the menu item to update
   * @param {Object} menuItem - The updated menu item data
   * @returns {Promise<Object>} - The updated menu item
   */
  async updateMenuItem(menuItemId, menuItem) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/menu-items/${menuItemId}`, menuItem);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  /**
   * Delete a menu item
   * @param {number} menuItemId - The ID of the menu item to delete
   * @returns {Promise<Object>} - Response data
   */
  async deleteMenuItem(menuItemId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/menu-items/${menuItemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  /**
   * Fetch orders for a restaurant
   * @param {number} restaurantId - The ID of the restaurant
   * @returns {Promise<Array>} - The orders
   */
  async getOrders(restaurantId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/${restaurantId}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Update order status
   * @param {string} orderId - The ID of the order
   * @param {string} status - The new status
   * @returns {Promise<Object>} - The updated order
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Fetch statistics for a restaurant
   * @param {number} restaurantId - The ID of the restaurant
   * @returns {Promise<Object>} - The statistics
   */
  async getRestaurantStats(restaurantId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/${restaurantId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant stats:', error);
      throw error;
    }
  },

  /**
   * Update restaurant settings
   * @param {number} restaurantId - The ID of the restaurant
   * @param {Object} settings - The updated settings
   * @returns {Promise<Object>} - The updated restaurant
   */
  async updateRestaurantSettings(restaurantId, settings) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/restaurants/${restaurantId}`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating restaurant settings:', error);
      throw error;
    }
  }
};

export default CafeteriaService; 