const express = require('express');
const { executeQuery } = require('../db/connection');

const router = express.Router();

// Get total orders count
router.get('/orders', async (req, res) => {
  try {
    const [result] = await executeQuery('SELECT COUNT(*) as total FROM Orders');
    res.json({ total: result[0].total });
  } catch (error) {
    console.error('Error fetching orders count:', error);
    res.status(500).json({ error: 'Failed to fetch orders count' });
  }
});

// Get total restaurants count
router.get('/restaurants', async (req, res) => {
  try {
    const [result] = await executeQuery('SELECT COUNT(*) as total FROM Restaurants');
    res.json({ total: result[0].total });
  } catch (error) {
    console.error('Error fetching restaurants count:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants count' });
  }
});

// Get total revenue
router.get('/revenue', async (req, res) => {
  try {
    const [result] = await executeQuery('SELECT SUM(total_amount) as revenue FROM Orders');
    res.json({ revenue: result[0].revenue || 0 });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
});

module.exports = router; 