const express = require('express');
const { executeQuery, pool } = require('../db/connection');

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, CONCAT(u.first_name, ' ', u.last_name) as user_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_time DESC
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
      SELECT o.*, r.name as restaurant_name, CONCAT(u.first_name, ' ', u.last_name) as user_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    const [orderItems] = await executeQuery(`
      SELECT oi.*, mi.item_name, mi.description 
      FROM orderitems oi
      JOIN menuitems mi ON oi.item_id = mi.item_id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    // Combine order with its items
    const orderWithItems = {
      ...orders[0],
      items: orderItems
    };

    res.json(orderWithItems);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { 
      user_id, 
      restaurant_id, 
      delivery_location, 
      delivery_option, 
      delivery_time_option,
      scheduled_delivery_time,
      payment_method,
      items 
    } = req.body;
    
    // Calculate total amount from items
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create the order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        user_id, 
        restaurant_id, 
        delivery_location, 
        delivery_option, 
        delivery_time_option,
        scheduled_delivery_time,
        total_amount,
        payment_method,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, 
        restaurant_id, 
        delivery_location, 
        delivery_option, 
        delivery_time_option || 'Now',
        scheduled_delivery_time || null,
        total_amount,
        payment_method,
        'pending'
      ]
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO orderitems (order_id, item_id, quantity, item_price_at_order) VALUES (?, ?, ?, ?)',
        [orderId, item.item_id, item.quantity, item.price]
      );
    }
    
    await connection.commit();
    
    // Get the created order with details
    const [orders] = await connection.query(`
      SELECT o.*, r.name as restaurant_name, CONCAT(u.first_name, ' ', u.last_name) as user_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [orderId]);
    
    // Get order items
    const [orderItems] = await connection.query(`
      SELECT oi.*, mi.item_name, mi.description 
      FROM orderitems oi
      JOIN menuitems mi ON oi.item_id = mi.item_id
      WHERE oi.order_id = ?
    `, [orderId]);
    
    // Combine order with its items
    const orderWithItems = {
      ...orders[0],
      items: orderItems
    };

    res.status(201).json(orderWithItems);
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await executeQuery(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get updated order with details
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, CONCAT(u.first_name, ' ', u.last_name) as user_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [req.params.id]);
    
    // Get order items
    const [orderItems] = await executeQuery(`
      SELECT oi.*, mi.item_name, mi.description 
      FROM orderitems oi
      JOIN menuitems mi ON oi.item_id = mi.item_id
      WHERE oi.order_id = ?
    `, [req.params.id]);
    
    // Combine order with its items
    const orderWithItems = {
      ...orders[0],
      items: orderItems
    };

    res.json(orderWithItems);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get orders by user
router.get('/user/:userId', async (req, res) => {
  try {
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, CONCAT(u.first_name, ' ', u.last_name) as user_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.user_id = ?
      ORDER BY o.order_time DESC
    `, [req.params.userId]);
    
    // For each order, get its items
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [orderItems] = await executeQuery(`
        SELECT oi.*, mi.item_name, mi.description 
        FROM orderitems oi
        JOIN menuitems mi ON oi.item_id = mi.item_id
        WHERE oi.order_id = ?
      `, [order.order_id]);
      
      return {
        ...order,
        items: orderItems
      };
    }));

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Get orders by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, CONCAT(u.first_name, ' ', u.last_name) as user_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.restaurant_id = ?
      ORDER BY o.order_time DESC
    `, [req.params.restaurantId]);
    
    // For each order, get its items
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [orderItems] = await executeQuery(`
        SELECT oi.*, mi.item_name, mi.description 
        FROM orderitems oi
        JOIN menuitems mi ON oi.item_id = mi.item_id
        WHERE oi.order_id = ?
      `, [order.order_id]);
      
      return {
        ...order,
        items: orderItems
      };
    }));

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant orders' });
  }
});

// Assign delivery person to order
router.patch('/:id/assign-delivery', async (req, res) => {
  try {
    const { delivery_person_id } = req.body;
    
    const [result] = await executeQuery(
      'UPDATE orders SET delivery_person_id = ? WHERE order_id = ?',
      [delivery_person_id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get updated order with details
    const [orders] = await executeQuery(`
      SELECT o.*, r.name as restaurant_name, CONCAT(u.first_name, ' ', u.last_name) as user_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [req.params.id]);

    res.json(orders[0]);
  } catch (error) {
    console.error('Error assigning delivery person:', error);
    res.status(500).json({ error: 'Failed to assign delivery person' });
  }
});

module.exports = router;