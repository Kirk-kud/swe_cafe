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
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/menu`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/menu-items/${menuItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/menu-items/${menuItemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/orders`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Normalize the data to ensure all expected fields exist
      return {
        totalOrders: data.totalOrders || data.orders || 0,
        pendingOrders: data.pendingOrders || 0,
        completedOrders: data.completedOrders || 0,
        todayRevenue: data.todayRevenue || (data.revenue ? `₵${data.revenue}` : '₵0'),
        popularItems: Array.isArray(data.popularItems) ? data.popularItems : []
      };
    } catch (error) {
      console.error('Error fetching restaurant stats:', error);
      // Return default data structure on error
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        todayRevenue: '₵0',
        popularItems: []
      };
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
      const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating restaurant settings:', error);
      throw error;
    }
  },

  /**
   * Update order payment status
   * @param {string} orderId - The ID of the order
   * @param {boolean} isPaid - Whether the order is paid for
   * @returns {Promise<Object>} - The updated order
   */
  async updateOrderPaymentStatus(orderId, isPaid) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_paid: isPaid })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};

export default CafeteriaService; 