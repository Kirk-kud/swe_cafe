const express = require('express');
const { executeQuery } = require('../db/connection');

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, u.name as student_name 
      FROM Orders o
      JOIN Restaurants r ON o.restaurant_id = r.id
      JOIN Users u ON o.student_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, u.name as student_name 
      FROM Orders o
      JOIN Restaurants r ON o.restaurant_id = r.id
      JOIN Users u ON o.student_id = u.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orders[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { student_id, restaurant_id, items, total_amount } = req.body;
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create the order
      const [result] = await connection.execute(
        'INSERT INTO Orders (student_id, restaurant_id, items, total_amount, status) VALUES (?, ?, ?, ?, ?)',
        [student_id, restaurant_id, JSON.stringify(items), total_amount, 'pending']
      );

      // Get the created order with details
      const [orders] = await connection.execute(`
        SELECT o.*, r.name as restaurant_name, u.name as student_name 
        FROM Orders o
        JOIN Restaurants r ON o.restaurant_id = r.id
        JOIN Users u ON o.student_id = u.id
        WHERE o.id = ?
      `, [result.insertId]);

      await connection.commit();
      res.status(201).json(orders[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await executeQuery(
      'UPDATE Orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get updated order with details
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, u.name as student_name 
      FROM Orders o
      JOIN Restaurants r ON o.restaurant_id = r.id
      JOIN Users u ON o.student_id = u.id
      WHERE o.id = ?
    `, [req.params.id]);

    res.json(orders[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get orders by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, u.name as student_name 
      FROM Orders o
      JOIN Restaurants r ON o.restaurant_id = r.id
      JOIN Users u ON o.student_id = u.id
      WHERE o.student_id = ?
      ORDER BY o.created_at DESC
    `, [req.params.studentId]);

    res.json(orders);
  } catch (error) {
    console.error('Error fetching student orders:', error);
    res.status(500).json({ error: 'Failed to fetch student orders' });
  }
});

// Get orders by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, u.name as student_name 
      FROM Orders o
      JOIN Restaurants r ON o.restaurant_id = r.id
      JOIN Users u ON o.student_id = u.id
      WHERE o.restaurant_id = ?
      ORDER BY o.created_at DESC
    `, [req.params.restaurantId]);

    res.json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant orders' });
  }
});

module.exports = router; 