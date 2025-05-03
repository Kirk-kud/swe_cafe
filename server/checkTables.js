require('dotenv').config();
const { executeQuery } = require('./db/connection');

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Check Restaurants table
    console.log('Checking restaurants table...');
    try {
      const [restaurantsColumns] = await executeQuery('DESCRIBE restaurants');
      console.log('Restaurants table structure:', restaurantsColumns);
      
      console.log('Checking for data in restaurants table...');
      try {
        const [restaurants] = await executeQuery('SELECT * FROM restaurants LIMIT 1');
        console.log('Restaurant data example:', restaurants);
      } catch (error) {
        console.error('Error checking restaurant data:', error);
      }
    } catch (error) {
      console.error('Error checking restaurants table:', error);
    }
    
    // Check MenuItems table
    console.log('Checking menuitems table...');
    try {
      const [menuItemsColumns] = await executeQuery('DESCRIBE menuitems');
      console.log('MenuItems table structure:', menuItemsColumns);
    } catch (error) {
      console.error('Error checking menuitems table:', error);
    }
    
    console.log('Database check complete.');
  } catch (error) {
    console.error('Error during database check:', error);
  }
}

checkTables(); 