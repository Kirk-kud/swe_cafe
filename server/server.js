require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { executeQuery } = require('./db/connection');

const app = express();
const port = process.env.PORT || 3000;

console.log('Starting server...');

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));

// Middleware
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is working!' });
});

// Restaurant Routes
console.log('Setting up restaurant routes...');

// Get all restaurants with their menu items
app.get('/api/restaurants', async (req, res) => {
  console.log('GET /api/restaurants endpoint hit');
  try {
    // Get all restaurants
    const [restaurants] = await executeQuery('SELECT * FROM Restaurants');
    console.log('Raw restaurants data from database:', JSON.stringify(restaurants, null, 2));
    console.log(`Found ${restaurants.length} restaurants`);
    
    // Debug each restaurant object
    restaurants.forEach((restaurant, index) => {
      console.log(`Restaurant ${index + 1}:`, restaurant);
      console.log(`ID property:`, restaurant.id);
      console.log(`Keys in restaurant object:`, Object.keys(restaurant));
    });
    
    // For each restaurant, get its menu items
    const restaurantsWithMenu = await Promise.all(
      restaurants.map(async (restaurant) => {
        console.log(`Fetching menu items for restaurant:`, restaurant.name);
        console.log(`Restaurant ID:`, typeof restaurant.id, restaurant.id);
        
        // Use null check to avoid undefined
        const restaurantId = restaurant.id || null;
        console.log(`Using restaurant ID:`, restaurantId);
        
        const [menuItems] = await executeQuery(
          'SELECT * FROM MenuItems WHERE restaurant_id = ?',
          [restaurantId]
        );
        console.log(`Found ${menuItems.length} menu items for ${restaurant.name}`);
        return {
          ...restaurant,
          menuItems
        };
      })
    );
    
    res.json(restaurantsWithMenu);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get restaurant by ID with menu items
app.get('/api/restaurants/:id', async (req, res) => {
  console.log(`GET /api/restaurants/${req.params.id} endpoint hit`);
  try {
    console.log(`Restaurant ID from params:`, req.params.id);
    
    const [restaurants] = await executeQuery(
      'SELECT * FROM Restaurants WHERE id = ?',
      [req.params.id]
    );
    
    console.log(`Query result:`, JSON.stringify(restaurants, null, 2));
    
    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    console.log(`Restaurant details:`, restaurants[0]);
    console.log(`Restaurant ID for menu query:`, restaurants[0].id);
    
    // Use null check to avoid undefined
    const restaurantId = restaurants[0].id || req.params.id || null;
    console.log(`Using restaurant ID for menu items:`, restaurantId);
    
    const [menuItems] = await executeQuery(
      'SELECT * FROM MenuItems WHERE restaurant_id = ?',
      [restaurantId]
    );

    console.log(`Found ${menuItems.length} menu items`);
    
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Available endpoints:');
  console.log('- GET /api/test');
  console.log('- GET /api/restaurants');
  console.log('- GET /api/restaurants/:id');
}); 