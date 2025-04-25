import mysql from 'mysql';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'AshesiEats',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Example query to fetch all users
pool.query('SELECT * FROM Users', (err, results) => {
  if (err) {
    console.error('Database query error:', err);
    return;
  }
  console.log('Fetched users:', results);
});

export default pool; // ES module export