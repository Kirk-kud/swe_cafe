const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db/connection');

// Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(total_amount) as totalRevenue,
        COUNT(DISTINCT student_id) as activeStudents,
        AVG(delivery_time) as deliveryTime
      FROM orders
    `);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router; 