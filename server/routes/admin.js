const express = require('express');
const { executeQuery } = require('../db/connection');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticate);

/**
 * Get all restaurant administrators
 * Requires admin privileges
 */
router.get('/restaurant-admins', requireAdmin, async (req, res) => {
  try {
    const [admins] = await executeQuery(`
      SELECT ra.*, u.first_name, u.last_name, u.email, r.name as restaurant_name 
      FROM restaurant_administrators ra
      JOIN users u ON ra.user_id = u.user_id
      JOIN restaurants r ON ra.restaurant_id = r.id
      ORDER BY ra.restaurant_id, u.last_name, u.first_name
    `);
    
    res.json(admins);
  } catch (error) {
    console.error('Error fetching restaurant administrators:', error);
    res.status(500).json({ error: 'Failed to fetch administrators' });
  }
});

/**
 * Get administrators for a specific restaurant
 * Requires admin privileges
 */
router.get('/restaurant-admins/restaurant/:restaurantId', requireAdmin, async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    
    const [admins] = await executeQuery(`
      SELECT ra.*, u.first_name, u.last_name, u.email, r.name as restaurant_name 
      FROM restaurant_administrators ra
      JOIN users u ON ra.user_id = u.user_id
      JOIN restaurants r ON ra.restaurant_id = r.id
      WHERE ra.restaurant_id = ?
      ORDER BY u.last_name, u.first_name
    `, [restaurantId]);
    
    res.json(admins);
  } catch (error) {
    console.error('Error fetching restaurant administrators:', error);
    res.status(500).json({ error: 'Failed to fetch administrators' });
  }
});

/**
 * Add a new restaurant administrator
 * Requires admin privileges
 */
router.post('/restaurant-admins', requireAdmin, async (req, res) => {
  try {
    const { user_id, restaurant_id, permission_level } = req.body;
    
    if (!user_id || !restaurant_id) {
      return res.status(400).json({ error: 'User ID and restaurant ID are required' });
    }
    
    // Check if user exists and is staff
    const [users] = await executeQuery(
      'SELECT * FROM users WHERE user_id = ?',
      [user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if restaurant exists
    const [restaurants] = await executeQuery(
      'SELECT * FROM restaurants WHERE id = ?',
      [restaurant_id]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Check if assignment already exists
    const [existingAssignments] = await executeQuery(
      'SELECT * FROM restaurant_administrators WHERE user_id = ? AND restaurant_id = ?',
      [user_id, restaurant_id]
    );
    
    if (existingAssignments.length > 0) {
      return res.status(409).json({ error: 'This user is already an administrator for this restaurant' });
    }
    
    // Add the administrator assignment
    await executeQuery(
      'INSERT INTO restaurant_administrators (user_id, restaurant_id, permission_level, created_by) VALUES (?, ?, ?, ?)',
      [user_id, restaurant_id, permission_level || 'full_access', req.user.id]
    );
    
    // Get the newly created assignment
    const [newAssignment] = await executeQuery(`
      SELECT ra.*, u.first_name, u.last_name, u.email, r.name as restaurant_name 
      FROM restaurant_administrators ra
      JOIN users u ON ra.user_id = u.user_id
      JOIN restaurants r ON ra.restaurant_id = r.id
      WHERE ra.user_id = ? AND ra.restaurant_id = ?
    `, [user_id, restaurant_id]);
    
    res.status(201).json(newAssignment[0]);
  } catch (error) {
    console.error('Error adding restaurant administrator:', error);
    res.status(500).json({ error: 'Failed to add administrator' });
  }
});

/**
 * Update a restaurant administrator's permission level
 * Requires admin privileges
 */
router.put('/restaurant-admins/:id', requireAdmin, async (req, res) => {
  try {
    const { permission_level } = req.body;
    const assignmentId = req.params.id;
    
    if (!permission_level) {
      return res.status(400).json({ error: 'Permission level is required' });
    }
    
    // Check if assignment exists
    const [assignments] = await executeQuery(
      'SELECT * FROM restaurant_administrators WHERE id = ?',
      [assignmentId]
    );
    
    if (assignments.length === 0) {
      return res.status(404).json({ error: 'Administrator assignment not found' });
    }
    
    // Update the permission level
    await executeQuery(
      'UPDATE restaurant_administrators SET permission_level = ? WHERE id = ?',
      [permission_level, assignmentId]
    );
    
    // Get the updated assignment
    const [updatedAssignment] = await executeQuery(`
      SELECT ra.*, u.first_name, u.last_name, u.email, r.name as restaurant_name 
      FROM restaurant_administrators ra
      JOIN users u ON ra.user_id = u.user_id
      JOIN restaurants r ON ra.restaurant_id = r.id
      WHERE ra.id = ?
    `, [assignmentId]);
    
    res.json(updatedAssignment[0]);
  } catch (error) {
    console.error('Error updating restaurant administrator:', error);
    res.status(500).json({ error: 'Failed to update administrator' });
  }
});

/**
 * Remove a restaurant administrator
 * Requires admin privileges
 */
router.delete('/restaurant-admins/:id', requireAdmin, async (req, res) => {
  try {
    const assignmentId = req.params.id;
    
    // Check if assignment exists
    const [assignments] = await executeQuery(
      'SELECT * FROM restaurant_administrators WHERE id = ?',
      [assignmentId]
    );
    
    if (assignments.length === 0) {
      return res.status(404).json({ error: 'Administrator assignment not found' });
    }
    
    // Delete the assignment
    await executeQuery(
      'DELETE FROM restaurant_administrators WHERE id = ?',
      [assignmentId]
    );
    
    res.status(200).json({ message: 'Administrator removed successfully' });
  } catch (error) {
    console.error('Error removing restaurant administrator:', error);
    res.status(500).json({ error: 'Failed to remove administrator' });
  }
});

module.exports = router; 