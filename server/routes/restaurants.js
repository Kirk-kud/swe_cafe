const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db/connection');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await executeQuery('SELECT * FROM restaurants');
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

module.exports = router; 