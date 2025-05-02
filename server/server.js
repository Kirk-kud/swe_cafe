require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ordersRouter = require('./routes/orders');
const restaurantsRouter = require('./routes/restaurants');
const statsRouter = require('./routes/stats');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 