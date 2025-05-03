const express = require('express');
const { executeQuery } = require('../db/connection');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await executeQuery(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const [result] = await executeQuery(
      'INSERT INTO Users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, password, first_name, last_name, role || 'student']
    );

    const [newUser] = await executeQuery(
      'SELECT * FROM Users WHERE id = ?',
      [result.insertId]
    );

    const token = jwt.sign(
      { id: newUser[0].id, email: newUser[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        first_name: newUser[0].first_name,
        last_name: newUser[0].last_name,
        role: newUser[0].role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await executeQuery(
      'SELECT u.*, r.name as restaurant_name FROM users u LEFT JOIN restaurants r ON u.restaurant_id = r.id WHERE u.email = ? AND u.password_hash = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const token = jwt.sign(
      { 
        id: user.user_id, 
        email: user.email,
        role: user.user_type,
        restaurant_id: user.restaurant_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({
      user: {
        id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.user_type,
        restaurant_id: user.restaurant_id,
        restaurant_name: user.restaurant_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Session check endpoint
router.get('/session', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await executeQuery(
      'SELECT u.*, r.name as restaurant_name FROM users u LEFT JOIN restaurants r ON u.restaurant_id = r.id WHERE u.user_id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      user: {
        id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.user_type,
        restaurant_id: user.restaurant_id,
        restaurant_name: user.restaurant_name
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router; 