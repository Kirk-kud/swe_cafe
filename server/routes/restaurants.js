const express = require('express');
const { executeQuery } = require('../db/connection');

const router = express.Router();

console.log('Restaurants router initialized');

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Restaurants test endpoint hit');
  res.json({ message: 'Restaurants route is working!' });
});

// Get all restaurants with their menu items
router.get('/', async (req, res) => {
  console.log('GET /api/restaurants endpoint hit');
  try {
    // Get all restaurants
    const [restaurants] = await executeQuery('SELECT * FROM Restaurants');
    console.log(`Found ${restaurants.length} restaurants`);
    console.log(JSON.stringify(restaurants, null, 2));
    
    // For each restaurant, get its menu items
    const restaurantsWithMenu = await Promise.all(
      restaurants.map(async (restaurant) => {
        // Check if restaurant ID exists before querying
        if (restaurant.id !== undefined) {
          const [menuItems] = await executeQuery(
            'SELECT * FROM MenuItems WHERE restaurant_id = ?',
            [restaurant.id]
          );
          return {
            ...restaurant,
            menuItems
          };
        } else {
          // Log the problematic restaurant for debugging
          console.warn('Restaurant with missing ID:', restaurant);
          return {
            ...restaurant,
            menuItems: [] // Return empty menu items for restaurants with no ID
          };
        }
      })
    );
    
    res.json(restaurantsWithMenu);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get restaurant by ID with menu items
router.get('/:id', async (req, res) => {
  try {
    const [restaurants] = await executeQuery(
      'SELECT * FROM Restaurants WHERE id = ?',
      [req.params.id]
    );
    
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const [menuItems] = await executeQuery(
      'SELECT * FROM MenuItems WHERE restaurant_id = ?',
      [req.params.id]
    );

    const restaurantData = {
      ...restaurants[0],
      menuItems
    };

    res.json(restaurantData);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

module.exports = router;