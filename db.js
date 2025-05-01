import mysql from 'mysql2';

// Create a connection pool
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

// Example query to fetch all users
pool.query('SELECT * FROM Users', (err, results) => {
  if (err) {
    console.error('Database query error:', err);
    return;
  }
  console.log('Fetched users:', results);
});

export default pool; // ES module export