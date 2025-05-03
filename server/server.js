require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { executeQuery } = require('./db/connection');
const adminRoutes = require('./routes/admin');
const ordersRoutes = require('./routes/orders');
const statsRoutes = require('./routes/stats');

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
    const [restaurants] = await executeQuery('SELECT * FROM restaurants');
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    // Return empty array instead of demo data
    res.status(500).json([]);
  }
});

// Get restaurant by ID with menu items
app.get('/api/restaurants/:id', async (req, res) => {
  console.log(`GET /api/restaurants/${req.params.id} endpoint hit`);
  try {
    console.log(`Restaurant ID from params:`, req.params.id);
    
    const [restaurants] = await executeQuery(
      'SELECT * FROM restaurants WHERE id = ?',
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
      'SELECT * FROM menuitems WHERE restaurant_id = ?',
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

// User Orders Routes
// Get all orders for a specific user
app.get('/api/users/:userId/orders', async (req, res) => {
  console.log(`GET /api/users/${req.params.userId}/orders endpoint hit`);
  try {
    const userId = req.params.userId;
    console.log(`Fetching orders for user ID:`, userId);
    
    // First, check if the Orders table exists and its structure
    try {
      const [tables] = await executeQuery(`SHOW TABLES`);
      console.log('Database tables:', tables);
      
      // Check orders table structure
      const [orderColumns] = await executeQuery(`DESCRIBE orders`);
      console.log('Orders table structure:', orderColumns);
      
      // Find the user ID column - could be user_id or student_id
      const userIdColumn = orderColumns.some(col => col.Field === 'user_id') ? 'user_id' : 'student_id';
      console.log(`Using ${userIdColumn} as user identifier in orders table`);
      
      // Get orders for this user using the correct column name
      const [orders] = await executeQuery(`
        SELECT o.*, r.name as restaurant_name 
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.${userIdColumn} = ?
        ORDER BY o.order_time DESC
      `, [userId]);
      
      console.log(`Found ${orders.length} orders for user ${userId}`);

      // For each order, get its items
      if (orders.length > 0) {
        // Check if we have an order_items table or orderitems table
        const [orderItemsTable] = await executeQuery(`
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = DATABASE()
          AND table_name IN ('order_items', 'orderitems')
          LIMIT 1
        `);
        
        const orderItemsTableName = orderItemsTable && orderItemsTable.length > 0 
          ? (orderItemsTable[0]['table_name'] || 'orderitems') 
          : 'orderitems';
        
        console.log(`Using ${orderItemsTableName} table for order items`);
        
        for (const order of orders) {
          const [items] = await executeQuery(`
            SELECT oi.*, mi.item_name as name, mi.price 
            FROM ${orderItemsTableName} oi
            JOIN menuitems mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = ?
          `, [order.order_id]);
          
          order.items = items || [];
        }
      }
      
      res.json(orders);
    } catch (dbError) {
      console.error('Database structure error:', dbError);
      
      // Return an empty array instead of demo data
      console.log('No orders found or database issue');
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user orders', 
      details: error.message 
    });
  }
});

// Get a specific order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  console.log(`GET /api/orders/${req.params.orderId} endpoint hit`);
  try {
    const orderId = req.params.orderId;
    
    // Get order details
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.order_id = ?
    `, [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    try {
      // Check if we have an order_items table or orderitems table
      const [orderItemsTable] = await executeQuery(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = DATABASE()
        AND table_name IN ('order_items', 'orderitems')
        LIMIT 1
      `);
      
      const orderItemsTableName = orderItemsTable && orderItemsTable.length > 0 
        ? (orderItemsTable[0]['table_name'] || 'orderitems') 
        : 'orderitems';
      
      const [items] = await executeQuery(`
        SELECT oi.*, mi.item_name as name, mi.price 
        FROM ${orderItemsTableName} oi
        JOIN menuitems mi ON oi.item_id = mi.item_id
        WHERE oi.order_id = ?
      `, [orderId]);
      
      order.items = items || [];
      
      // Add order timeline for tracking
      order.timeline = [
        { status: 'pending', timestamp: order.order_time, message: 'Order placed' }
      ];
      
      // Format the date and time for display
      order.date = new Date(order.order_time).toLocaleDateString();
      order.time = new Date(order.order_time).toLocaleTimeString();
      
      // Add estimated delivery time based on status
      if (order.status === 'pending' || order.status === 'confirmed') {
        order.estimated_delivery_time = '45-60 minutes';
      } else if (order.status === 'preparing') {
        order.estimated_delivery_time = '30-45 minutes';
      } else if (order.status === 'ready_for_pickup') {
        order.estimated_delivery_time = '15-20 minutes';
      } else if (order.status === 'out_for_delivery') {
        order.estimated_delivery_time = '5-10 minutes';
      }
      
      res.json(order);
    } catch (itemError) {
      console.error('Error fetching order items:', itemError);
      // Return order without items if there's an error
      res.json(order);
    }
  } catch (error) {
    console.error('Error fetching order details:', error);
    
    // Return a 404 error instead of demo data
    res.status(404).json({ 
      error: 'Order not found or could not be retrieved',
      details: error.message
    });
  }
});

// Get order updates (for polling)
app.get('/api/orders/:orderId/updates', async (req, res) => {
  console.log(`GET /api/orders/${req.params.orderId}/updates endpoint hit`);
  try {
    const orderId = req.params.orderId;
    
    const [orders] = await executeQuery(`
      SELECT status, updated_at, order_time
      FROM orders
      WHERE order_id = ?
    `, [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Create a timeline based on current status
    const order = orders[0];
    const timeline = [
      { status: 'pending', timestamp: order.order_time, message: 'Order placed' }
    ];
    
    // Add more timeline entries based on status
    if (order.status !== 'pending' && order.status !== 'cancelled') {
      timeline.push({ 
        status: 'confirmed', 
        timestamp: new Date(new Date(order.order_time).getTime() + 5*60000).toISOString(), 
        message: 'Order confirmed by restaurant' 
      });
    }
    
    if (['preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'].includes(order.status)) {
      timeline.push({ 
        status: 'preparing', 
        timestamp: new Date(new Date(order.order_time).getTime() + 10*60000).toISOString(), 
        message: 'Restaurant is preparing your order' 
      });
    }
    
    if (['ready_for_pickup', 'out_for_delivery', 'delivered'].includes(order.status)) {
      timeline.push({ 
        status: 'ready', 
        timestamp: new Date(new Date(order.order_time).getTime() + 25*60000).toISOString(), 
        message: 'Your order is ready' 
      });
    }
    
    if (['out_for_delivery', 'delivered'].includes(order.status)) {
      timeline.push({ 
        status: 'out_for_delivery', 
        timestamp: new Date(new Date(order.order_time).getTime() + 30*60000).toISOString(), 
        message: 'Your order is on the way' 
      });
    }
    
    if (order.status === 'delivered') {
      timeline.push({ 
        status: 'delivered', 
        timestamp: new Date(new Date(order.order_time).getTime() + 45*60000).toISOString(), 
        message: 'Order delivered successfully' 
      });
    }
    
    if (order.status === 'cancelled') {
      timeline.push({ 
        status: 'cancelled', 
        timestamp: new Date(new Date(order.order_time).getTime() + 5*60000).toISOString(), 
        message: 'Order was cancelled' 
      });
    }
    
    res.json({
      status: order.status,
      updated_at: order.updated_at,
      timeline
    });
  } catch (error) {
    console.error('Error fetching order updates:', error);
    
    // Return error message instead of fallback demo data
    res.status(404).json({
      error: 'Unable to retrieve order updates',
      details: error.message
    });
  }
});

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/stats', statsRoutes);

// Add a combined stats endpoint for the dashboard
app.get('/api/stats', async (req, res) => {
  try {
    // Get order count
    const [orderCountResult] = await executeQuery('SELECT COUNT(*) as total FROM Orders');
    const totalOrders = orderCountResult[0].total || 0;
    
    // Get revenue
    const [revenueResult] = await executeQuery('SELECT SUM(total_amount) as revenue FROM Orders');
    const totalRevenue = revenueResult[0].revenue || 0;
    
    // Get active students (users who placed orders)
    const [activeStudentsResult] = await executeQuery('SELECT COUNT(DISTINCT user_id) as active FROM Orders');
    const activeStudents = activeStudentsResult[0].active || 0;
    
    // Average delivery time - mock value for now
    const deliveryTime = 15;
    
    res.json({
      totalOrders,
      totalRevenue,
      activeStudents,
      deliveryTime
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      totalOrders: 0,
      totalRevenue: 0,
      activeStudents: 0,
      deliveryTime: 0
    });
  }
});

// Add restaurant stats endpoint for dashboard
app.get('/api/restaurants/:id/stats', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    // Get order count for this restaurant
    const [orderCountResult] = await executeQuery(
      'SELECT COUNT(*) as total FROM orders WHERE restaurant_id = ?',
      [restaurantId]
    );
    const totalOrders = orderCountResult[0].total || 0;
    
    // Get revenue for this restaurant
    const [revenueResult] = await executeQuery(
      'SELECT SUM(total_amount) as revenue FROM orders WHERE restaurant_id = ?',
      [restaurantId]
    );
    const totalRevenue = revenueResult[0].revenue || 0;
    
    // Get average rating if available (assuming there's a ratings table)
    let rating = 0;
    try {
      const [ratingResult] = await executeQuery(
        'SELECT AVG(rating) as avg_rating FROM ratings WHERE restaurant_id = ?',
        [restaurantId]
      );
      rating = ratingResult[0].avg_rating || 4.0; // Default to 4.0 if no ratings
    } catch (ratingErr) {
      console.error('Error fetching ratings, using default:', ratingErr);
      rating = 4.0; // Default rating if table doesn't exist
    }
    
    res.json({
      restaurant_id: restaurantId,
      orders: totalOrders,
      revenue: totalRevenue,
      rating: parseFloat(rating).toFixed(1)
    });
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    res.status(500).json({ 
      restaurant_id: req.params.id,
      orders: 0,
      revenue: 0,
      rating: 4.0,
      error: 'Failed to fetch restaurant statistics'
    });
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
  console.log('- GET /api/users/:userId/orders');
  console.log('- GET /api/orders/:orderId');
  console.log('- GET /api/orders/:orderId/updates');
}); 