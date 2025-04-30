import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Enable JSON parsing
app.use(express.json());

// CORS options
const corsOptions = {
  origin: "http://localhost:5173", // Vite default port
  credentials: true // Optional: if you use cookies/auth
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'AshesiEats',
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

    // 3. Find user by email (only essential fields)
    const [users] = await pool.execute(
      'SELECT user_id, password_hash FROM Users WHERE email = ?',
      [email]
    );

    // 4. Unified error response
    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // 5. Generate minimal token
    const token = jwt.sign({ userId: users[0].user_id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    // 6. Return only authentication confirmation
    res.json({ token });

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
      'SELECT * FROM Restaurants WHERE restaurant_id = ?',
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

// Start server
app.listen(8080, () => {
  console.log("✅ Server started on port 8080");
});
