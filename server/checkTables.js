require('dotenv').config();
const { executeQuery } = require('./db/connection');

async function checkDatabaseTables() {
  try {
    console.log('Checking database tables structure...');
    
    // Check Restaurants table structure
    const [restaurantsColumns] = await executeQuery('DESCRIBE Restaurants');
    console.log('\nRestaurants table structure:');
    restaurantsColumns.forEach(column => {
      console.log(`${column.Field}: ${column.Type} ${column.Key === 'PRI' ? '(PRIMARY KEY)' : ''}`);
    });
    
    // Check sample data from Restaurants
    const [restaurants] = await executeQuery('SELECT * FROM Restaurants LIMIT 1');
    if (restaurants.length > 0) {
      console.log('\nSample restaurant data:');
      console.log(restaurants[0]);
      console.log('Object keys:', Object.keys(restaurants[0]));
    }
    
    // Check MenuItems table structure
    const [menuItemsColumns] = await executeQuery('DESCRIBE MenuItems');
    console.log('\nMenuItems table structure:');
    menuItemsColumns.forEach(column => {
      console.log(`${column.Field}: ${column.Type} ${column.Key === 'PRI' ? '(PRIMARY KEY)' : ''}`);
    });
    
  } catch (error) {
    console.error('Error checking database tables:', error);
  }
}

checkDatabaseTables(); 