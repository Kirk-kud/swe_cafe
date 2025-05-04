/**
 * Script to run the migration to add is_paid column to orders table
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ashesi_eats',
};

async function runMigration() {
  console.log('Running migration to add is_paid column to orders table...');
  
  // Create connection
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Read migration SQL file
    const migrationPath = path.join(__dirname, 'migrate_add_is_paid.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split statements
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 80)}${statement.length > 80 ? '...' : ''}`);
      await connection.execute(statement);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run the migration
runMigration(); 