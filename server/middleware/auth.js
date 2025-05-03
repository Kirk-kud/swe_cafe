const jwt = require('jsonwebtoken');
const { executeQuery } = require('../db/connection');

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Authorization middleware for admin access
 * Checks both user_type and restaurant_administrators table
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // If user is already an admin or cafeteria_admin, allow access
    if (req.user.role === 'admin' || req.user.role === 'cafeteria_admin') {
      return next();
    }
    
    // If user is staff, check if they have admin privileges via restaurant_administrators table
    if (req.user.role === 'staff') {
      // Check the restaurant_administrators table
      const [admins] = await executeQuery(
        'SELECT * FROM restaurant_administrators WHERE user_id = ?',
        [req.user.id]
      );
      
      if (admins.length > 0) {
        // User has admin access to at least one restaurant
        // Add admin info to request object for future use
        req.userAdminInfo = admins;
        return next();
      }
    }
    
    // If we reach here, user doesn't have admin privileges
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

/**
 * Authorization middleware for restaurant-specific admin access
 * Checks both user_type and restaurant_administrators table
 */
const requireRestaurantAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Get the requested restaurant ID from route params or request body
    const requestedRestaurantId = parseInt(req.params.restaurantId || req.body.restaurant_id);
    
    if (!requestedRestaurantId) {
      return res.status(400).json({ error: 'Restaurant ID required' });
    }
    
    // System admin can access all restaurants
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Cafeteria admins can only access their assigned restaurant
    if (req.user.role === 'cafeteria_admin' && req.user.restaurant_id === requestedRestaurantId) {
      return next();
    }
    
    // Staff with admin privileges via restaurant_administrators table
    if (req.user.role === 'staff') {
      const [admins] = await executeQuery(
        'SELECT * FROM restaurant_administrators WHERE user_id = ? AND restaurant_id = ?',
        [req.user.id, requestedRestaurantId]
      );
      
      if (admins.length > 0) {
        // User has admin access to this specific restaurant
        req.userAdminInfo = admins[0];
        
        // Check if the user has the required permission level (if specified)
        const requiredPermission = req.adminPermission;
        if (requiredPermission && req.userAdminInfo.permission_level !== 'full_access' && 
            req.userAdminInfo.permission_level !== requiredPermission) {
          return res.status(403).json({ 
            error: `Access denied. '${requiredPermission}' permission required.`
          });
        }
        
        return next();
      }
    }
    
    // If we reach here, user doesn't have admin privileges for this restaurant
    return res.status(403).json({ 
      error: 'Access denied. You do not have admin access to this restaurant.'
    });
  } catch (error) {
    console.error('Restaurant admin authorization error:', error);
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

/**
 * Permission-specific middleware factory
 * Creates middleware that requires specific permission level
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    req.adminPermission = permission;
    requireRestaurantAdmin(req, res, next);
  };
};

/**
 * Middleware to check if user owns the resource or has admin access
 */
const requireOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    const resourceId = req.params.id;
    const resourceType = req.baseUrl.split('/').pop(); // e.g., 'orders', 'menuItems'
    
    if (resourceType === 'orders') {
      // Check if order belongs to user or user's restaurant (for admin)
      const [orders] = await executeQuery(
        'SELECT * FROM orders WHERE order_id = ?',
        [resourceId]
      );
      
      if (orders.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const order = orders[0];
      
      // Direct access if user is the order owner
      if (order.user_id === req.user.id) {
        return next();
      }
      
      // Check for cafeteria admin access
      if (req.user.role === 'cafeteria_admin' && order.restaurant_id === req.user.restaurant_id) {
        return next();
      }
      
      // Check for staff with admin privileges
      if (req.user.role === 'staff') {
        const [admins] = await executeQuery(
          'SELECT * FROM restaurant_administrators WHERE user_id = ? AND restaurant_id = ?',
          [req.user.id, order.restaurant_id]
        );
        
        if (admins.length > 0) {
          req.userAdminInfo = admins[0];
          return next();
        }
      }
    }
    
    // If we reach here, user doesn't have access
    return res.status(403).json({ error: 'Access denied. You do not have permission to access this resource.' });
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  requireRestaurantAdmin,
  requirePermission,
  requireOwnershipOrAdmin
}; 