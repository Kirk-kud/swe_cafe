const express = require('express');
const { executeQuery } = require('../db/connection');

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const [restaurants] = await executeQuery('SELECT * FROM Restaurants');
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const [restaurants] = await executeQuery(
      'SELECT * FROM Restaurants WHERE id = ?',
      [req.params.id]
    );
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurants[0]);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

module.exports = router; 