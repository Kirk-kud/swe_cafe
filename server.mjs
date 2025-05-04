import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import ordersRouter from "./server/routes/orders.js";

// Load environment variables
dotenv.config();

const app = express();

// Enable JSON parsing
app.use(express.json());

// CORS options
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ashesi_eats',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database!');
    connection.release();
  } catch (error) {
    console.error('❌ Error connecting to MySQL:', error);
    process.exit(1); // Exit if database connection fails
  }
}

// Test the connection when server starts
testConnection();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'ashesi-eats-default-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.execute('SELECT * FROM Users WHERE user_id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    //1. Get user data from request body
    const { fullName, email, password, studentId, phoneNumber } = req.body;

    // 2. Validate required fields
    if (!fullName || !email || !password || !studentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 3. Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 4. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert new user into database
    const [result] = await pool.execute(
      'INSERT INTO Users (first_name, last_name, email, phone, password_hash, user_type) VALUES (?, ?, ?, ?, ?, ?)',
      [fullName.split(' ')[0], fullName.split(' ')[1] || '', email, phoneNumber, hashedPassword, 'student']
    );

    // 6. Generate JWT token for authentication
    const token = jwt.sign({ userId: result.insertId }, JWT_SECRET, { expiresIn: '24h' });

    // 7. Send success response with token and user data
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        email,
        fullName,
        studentId,
        phoneNumber
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    // 1. Extract credentials
    const { email, password } = req.body;
   
    // 2. Basic presence check
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // 3. Find user by email (get all fields)
    const [users] = await pool.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    // 4. Unified error response
    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // 5. Check if user is a restaurant admin
    let isRestaurantAdmin = false;
    let restaurantId = null;
    let permissionLevel = null;
    
    // First check if user is an admin in user_type
    const isAdmin = user.user_type === 'admin';
    
    // Check restaurant_admins table
    const [restaurantAdmins] = await pool.execute(
      'SELECT * FROM restaurant_admins WHERE user_id = ?',
      [user.user_id]
    );
    
    if (restaurantAdmins.length > 0) {
      isRestaurantAdmin = true;
      restaurantId = restaurantAdmins[0].restaurant_id;
      // Get the permission level from restaurant_admins table
      permissionLevel = restaurantAdmins[0].permission_level || 'partial_access';
    }
    
    // 6. Generate minimal token
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // 7. Return token and user data
    res.json({
      token,
      user: {
        id: user.user_id,
        email: user.email,
        fullName: `${user.first_name} ${user.last_name}`,
        phoneNumber: user.phone,
        user_type: user.user_type,
        role: user.user_type,
        isAdmin: isAdmin,
        isRestaurantAdmin: isRestaurantAdmin,
        restaurant_id: restaurantId,
        permissionLevel: permissionLevel
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});


// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Example for Express backend
app.get('/api', (req, res) => {
    res.json({ message: "👋 Welcome back to AshesiEats!" });
  });

// Get restaurant details
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get restaurant details
    const [restaurants] = await pool.execute(
      'SELECT * FROM Restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Get menu items for this restaurant
    const [menuItems] = await pool.execute(
      'SELECT * FROM MenuItems WHERE restaurant_id = ?',
      [id]
    );

    // Combine restaurant details with menu items
    const restaurantData = {
      ...restaurants[0],
      menu: menuItems
    };

    res.json(restaurantData);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    // Get all restaurants
    const [restaurants] = await pool.execute('SELECT * FROM Restaurants');
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json([]);
  }
});

// Get restaurant stats for dashboard
app.get('/api/restaurants/:id/stats', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    // Get order count for this restaurant
    const [orderCountResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM Orders WHERE restaurant_id = ?',
      [restaurantId]
    );
    const totalOrders = orderCountResult[0].total || 0;
    
    // Get revenue for this restaurant
    const [revenueResult] = await pool.execute(
      'SELECT SUM(total_amount) as revenue FROM Orders WHERE restaurant_id = ?',
      [restaurantId]
    );
    const totalRevenue = parseFloat(revenueResult[0].revenue || 0);
    
    // Default rating (in a real app, this would come from a ratings table)
    const rating = 4.2;
    
    res.json({
      restaurant_id: restaurantId,
      orders: totalOrders,
      revenue: totalRevenue,
      rating: rating
    });
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    res.status(500).json({ 
      restaurant_id: req.params.id,
      orders: 0,
      revenue: 0,
      rating: 4.0
    });
  }
});

// Get dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    // Get order count
    const [orderCountResult] = await pool.execute('SELECT COUNT(*) as total FROM Orders');
    const totalOrders = orderCountResult[0].total || 0;
    
    // Get revenue
    const [revenueResult] = await pool.execute('SELECT SUM(total_amount) as revenue FROM Orders');
    const totalRevenue = parseFloat(revenueResult[0].revenue || 0);
    
    // Get active students (users who placed orders)
    const [activeStudentsResult] = await pool.execute('SELECT COUNT(DISTINCT user_id) as active FROM Orders');
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
      totalOrders: 0,
      totalRevenue: 0,
      activeStudents: 0,
      deliveryTime: 0
    });
  }
});

// Use the orders routes
app.use('/api/orders', ordersRouter);

// Session validation endpoint
app.get('/api/auth/session', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Check if user is a restaurant admin
    let isRestaurantAdmin = false;
    let restaurantId = null;
    let permissionLevel = null;
    
    // First check if user is an admin in user_type
    const isAdmin = user.user_type === 'admin';
    
    // Check restaurant_admins table
    const [restaurantAdmins] = await pool.execute(
      'SELECT * FROM restaurant_admins WHERE user_id = ?',
      [user.user_id]
    );
    
    if (restaurantAdmins.length > 0) {
      isRestaurantAdmin = true;
      restaurantId = restaurantAdmins[0].restaurant_id;
      // Get the permission level from restaurant_admins table
      permissionLevel = restaurantAdmins[0].permission_level || 'partial_access';
    }
    
    res.json({
      user: {
        id: user.user_id,
        email: user.email,
        fullName: `${user.first_name} ${user.last_name}`,
        phoneNumber: user.phone,
        user_type: user.user_type,
        role: user.user_type,
        isAdmin: isAdmin,
        isRestaurantAdmin: isRestaurantAdmin,
        restaurant_id: restaurantId,
        permissionLevel: permissionLevel
      }
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Get order updates (for tracking)
app.get('/api/orders/:orderId/updates', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    // Get order status and timestamp
    const [orderResult] = await pool.execute(`
      SELECT status, order_time, updated_at
      FROM Orders
      WHERE order_id = ?
    `, [orderId]);
    
    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult[0];
    
    // Create timeline based on current status
    const timeline = [
      { status: 'pending', timestamp: new Date(order.order_time).toISOString(), message: 'Order placed' }
    ];
    
    // Add more timeline events based on status
    if (order.status !== 'pending') {
      // Add confirmed status
      timeline.push({
        status: 'confirmed',
        timestamp: new Date(new Date(order.order_time).getTime() + 5*60000).toISOString(),
        message: 'Order confirmed by restaurant'
      });
    }
    
    if (['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'preparing',
        timestamp: new Date(new Date(order.order_time).getTime() + 10*60000).toISOString(),
        message: 'Restaurant is preparing your order'
      });
    }
    
    if (['ready', 'out_for_delivery', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'ready',
        timestamp: new Date(new Date(order.order_time).getTime() + 20*60000).toISOString(),
        message: 'Your order is ready for pickup'
      });
    }
    
    if (['out_for_delivery', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'out_for_delivery',
        timestamp: new Date(new Date(order.order_time).getTime() + 25*60000).toISOString(),
        message: 'Your order is on the way'
      });
    }
    
    if (order.status === 'delivered') {
      timeline.push({
        status: 'delivered',
        timestamp: new Date(new Date(order.order_time).getTime() + 35*60000).toISOString(),
        message: 'Order delivered successfully'
      });
    }
    
    // Return updates
    res.json({
      status: order.status,
      updated_at: order.updated_at || order.order_time,
      timeline
    });
  } catch (error) {
    console.error('Error fetching order updates:', error);
    res.status(500).json({ error: 'Failed to fetch order updates' });
  }
});

// Cancel an order
app.post('/api/orders/:orderId/cancel', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    // Check if order exists
    const [orderResult] = await pool.execute('SELECT * FROM Orders WHERE order_id = ?', [orderId]);
    
    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if order can be cancelled (only pending or confirmed orders)
    const order = orderResult[0];
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        error: 'Cannot cancel order', 
        message: 'Orders can only be cancelled when in pending or confirmed status' 
      });
    }
    
    // Update order status to cancelled
    await pool.execute('UPDATE Orders SET status = ?, updated_at = ? WHERE order_id = ?', 
      ['cancelled', new Date().toISOString(), orderId]
    );
    
    res.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      order_id: orderId
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get restaurant menu
app.get('/api/restaurants/:restaurantId/menu', async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    
    // Check if restaurant exists
    const [restaurantResult] = await pool.execute('SELECT * FROM Restaurants WHERE id = ?', [restaurantId]);
    
    if (restaurantResult.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Get menu items for this restaurant
    const [menuItems] = await pool.execute(
      'SELECT * FROM MenuItems WHERE restaurant_id = ?',
      [restaurantId]
    );
    
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Add menu item to restaurant
app.post('/api/restaurants/:restaurantId/menu', async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const { name, price, category, available, image, description } = req.body;
    
    // Validate required fields
    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert menu item
    const [result] = await pool.execute(
      'INSERT INTO MenuItems (restaurant_id, item_name, price, category, available, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [restaurantId, name, price, category, available ? 1 : 0, image || null, description || null]
    );
    
    // Get the inserted item
    const [items] = await pool.execute('SELECT * FROM MenuItems WHERE item_id = ?', [result.insertId]);
    
    res.status(201).json(items[0]);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Update menu item
app.put('/api/menu-items/:menuItemId', async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    const { name, price, category, available, image, description } = req.body;
    
    // Check if menu item exists
    const [itemResult] = await pool.execute('SELECT * FROM MenuItems WHERE item_id = ?', [menuItemId]);
    
    if (itemResult.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Update menu item
    await pool.execute(
      'UPDATE MenuItems SET item_name = ?, price = ?, category = ?, available = ?, image_url = ?, description = ? WHERE item_id = ?',
      [
        name || itemResult[0].item_name,
        price !== undefined ? price : itemResult[0].price,
        category || itemResult[0].category,
        available !== undefined ? (available ? 1 : 0) : itemResult[0].available,
        image || itemResult[0].image_url,
        description !== undefined ? description : itemResult[0].description,
        menuItemId
      ]
    );
    
    // Get the updated item
    const [updatedItem] = await pool.execute('SELECT * FROM MenuItems WHERE item_id = ?', [menuItemId]);
    
    res.json(updatedItem[0]);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item
app.delete('/api/menu-items/:menuItemId', async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    
    // Check if menu item exists
    const [itemResult] = await pool.execute('SELECT * FROM MenuItems WHERE item_id = ?', [menuItemId]);
    
    if (itemResult.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Delete menu item
    await pool.execute('DELETE FROM MenuItems WHERE item_id = ?', [menuItemId]);
    
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Get restaurant orders
app.get('/api/restaurants/:restaurantId/orders', async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    
    // Check if restaurant exists
    const [restaurantResult] = await pool.execute('SELECT * FROM Restaurants WHERE id = ?', [restaurantId]);
    
    if (restaurantResult.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Get orders for this restaurant
    const [orders] = await pool.execute(`
      SELECT o.*, u.first_name, u.last_name
      FROM Orders o
      JOIN Users u ON o.user_id = u.user_id
      WHERE o.restaurant_id = ?
      ORDER BY o.order_time DESC
    `, [restaurantId]);
    
    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.order_id,
      customer: `${order.first_name} ${order.last_name}`,
      items: [], // In a real app, you would fetch order items here
      status: order.status,
      time: new Date(order.order_time).toLocaleTimeString(),
      amount: `₵${order.total_amount}`
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Check if order exists
    const [orderResult] = await pool.execute('SELECT * FROM Orders WHERE order_id = ?', [orderId]);
    
    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update order status
    await pool.execute(
      'UPDATE Orders SET status = ?, updated_at = ? WHERE order_id = ?',
      [status, new Date().toISOString(), orderId]
    );
    
    // Get updated order
    const [updatedOrder] = await pool.execute(`
      SELECT o.*, u.first_name, u.last_name
      FROM Orders o
      JOIN Users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [orderId]);
    
    res.json({
      id: updatedOrder[0].order_id,
      status: updatedOrder[0].status,
      customer: `${updatedOrder[0].first_name} ${updatedOrder[0].last_name}`,
      updated_at: updatedOrder[0].updated_at || updatedOrder[0].order_time
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get orders for a specific user
app.get('/api/users/:userId/orders', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify user exists
    const [userResult] = await pool.execute('SELECT * FROM Users WHERE user_id = ?', [userId]);
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all orders for this user
    const [ordersResult] = await pool.execute(`
      SELECT o.*, r.name as restaurant_name
      FROM Orders o
      LEFT JOIN Restaurants r ON o.restaurant_id = r.id
      WHERE o.user_id = ?
      ORDER BY o.order_time DESC
    `, [userId]);
    
    // Format orders for frontend
    const orders = await Promise.all(ordersResult.map(async (order) => {
      // Get order items
      const [orderItemsResult] = await pool.execute(`
        SELECT oi.*, mi.item_name, mi.price
        FROM OrderItems oi
        JOIN MenuItems mi ON oi.item_id = mi.item_id
        WHERE oi.order_id = ?
      `, [order.order_id]);
      
      // Format date and time
      const orderDate = new Date(order.order_time);
      const formattedDate = orderDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const formattedTime = orderDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return {
        id: order.order_id,
        restaurant_id: order.restaurant_id,
        restaurant_name: order.restaurant_name || 'Unknown Restaurant',
        status: order.status || 'pending',
        date: formattedDate,
        time: formattedTime,
        items: orderItemsResult.map(item => ({
          id: item.order_item_id,
          name: item.item_name,
          price: parseFloat(item.price || 0),
          quantity: item.quantity || 1
        })),
        total_amount: parseFloat(order.total_amount || 0)
      };
    }));
    
    // Return empty array if no orders (not 404)
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user orders',
      details: error.message 
    });
  }
});

// Update order payment status
app.put('/api/orders/:orderId/payment', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { is_paid } = req.body;
    
    // Validate payment status
    if (is_paid === undefined) {
      return res.status(400).json({ error: 'Payment status is required' });
    }
    
    // Check if order exists
    const [orderResult] = await pool.execute('SELECT * FROM Orders WHERE order_id = ?', [orderId]);
    
    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update order payment status
    await pool.execute(
      'UPDATE Orders SET is_paid = ?, updated_at = ? WHERE order_id = ?',
      [is_paid ? 1 : 0, new Date().toISOString(), orderId]
    );
    
    // Get updated order
    const [updatedOrder] = await pool.execute(`
      SELECT o.*, u.first_name, u.last_name
      FROM Orders o
      JOIN Users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [orderId]);
    
    res.json({
      id: updatedOrder[0].order_id,
      status: updatedOrder[0].status,
      is_paid: Boolean(updatedOrder[0].is_paid),
      customer: `${updatedOrder[0].first_name} ${updatedOrder[0].last_name}`,
      updated_at: updatedOrder[0].updated_at || updatedOrder[0].order_time
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
