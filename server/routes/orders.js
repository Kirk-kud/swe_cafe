const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db/connection');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await executeQuery('SELECT * FROM orders');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { student_id, restaurant_id, items, total_amount, status } = req.body;
    const result = await executeQuery(
      'INSERT INTO orders (student_id, restaurant_id, items, total_amount, status) VALUES (?, ?, ?, ?, ?)',
      [student_id, restaurant_id, JSON.stringify(items), total_amount, status]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await executeQuery('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ id, status });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await executeQuery('DELETE FROM orders WHERE id = ?', [id]);
    res.json({ id });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router; 