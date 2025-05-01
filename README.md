# AshesiEats

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Set-up instructions for local hosting
# Setting Up the Complete AshesiEats Application for Local Hosting

This comprehensive guide will help you set up the entire AshesiEats application, including both the admin dashboard and the student-facing components.

## Step 1: Prerequisites

1. Install the following software:
   - Node.js (v16 or later)
   - MySQL (v8.0 or later)
   - Git

2. Verify installations:
   ```bash
   node -v
   npm -v
   mysql --version
   git --version
   ```

## Step 2: Clone the Repository

```bash
git clone https://github.com/your-username/ashesi-eats.git
cd ashesi-eats
```

(Note: Replace with your actual repository URL if you have one, or create a new directory if starting from scratch)

## Step 3: Set Up the Database

1. Start MySQL service:
   ```bash
   # Windows
   net start mysql
   
   # Mac
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

2. Create and populate the database:
   ```bash
   mysql -u root -p < AshesiEats_schema.sql
   ```

3. Verify database setup:
   ```bash
   mysql -u root -p
   > use AshesiEats;
   > show tables;
   > select * from Restaurants;
   > exit
   ```

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=AshesiEats
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # JWT Secret for Authentication
   JWT_SECRET=your_secret_key
   
   # Optional: Email Configuration (for notifications)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   ```

## Step 5: Project Directory Structure

Create the following directory structure:

```
ashesi-eats/
├── client/                    # Frontend applications
│   ├── admin/                 # Admin dashboard
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Next.js pages
│   │   ├── public/            # Static assets
│   │   └── styles/            # CSS styles
│   └── student/               # Student-facing application
│       ├── components/        # React components
│       ├── hooks/             # Custom React hooks
│       ├── pages/             # Next.js pages
│       ├── public/            # Static assets
│       └── styles/            # CSS styles
├── server/                    # Backend server
│   ├── api/                   # API routes
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Data models
│   │   └── routes/            # Route definitions
│   ├── config/                # Configuration files
│   ├── services/              # Business logic
│   │   └── DataService.js     # Data service with observer pattern
│   └── utils/                 # Utility functions
├── shared/                    # Shared code between client and server
│   ├── constants/             # Shared constants
│   └── types/                 # Type definitions
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## Step 6: Install Dependencies

1. Create a root `package.json`:
   ```bash
   npm init -y
   ```

2. Install core dependencies:
   ```bash
   npm install express cors mysql dotenv jsonwebtoken bcryptjs
   npm install --save-dev nodemon concurrently
   ```

3. Set up client applications:
   ```bash
   # Admin dashboard
   cd client/admin
   npm init -y
   npm install react react-dom next lucide-react recharts tailwindcss postcss autoprefixer
   
   # Student app
   cd ../../client/student
   npm init -y
   npm install react react-dom next lucide-react tailwindcss postcss autoprefixer
   ```

## Step 7: Configure the Backend Server

1. Create `server/server.js`:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const path = require('path');
   require('dotenv').config();

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Middleware
   app.use(cors());
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));

   // Import routes
   const orderRoutes = require('./api/routes/orders');
   const restaurantRoutes = require('./api/routes/restaurants');
   const studentRoutes = require('./api/routes/students');
   const authRoutes = require('./api/routes/auth');

   // Use routes
   app.use('/api/orders', orderRoutes);
   app.use('/api/restaurants', restaurantRoutes);
   app.use('/api/students', studentRoutes);
   app.use('/api/auth', authRoutes);

   // Error handling middleware
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).send('Something broke!');
   });

   // Start server
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. Create `server/api/routes/orders.js` and other route files.

3. Set up `server/config/db.js`:
   ```javascript
   const mysql = require('mysql');
   require('dotenv').config();

   const pool = mysql.createPool({
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || '',
     database: process.env.DB_NAME || 'AshesiEats',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
   });

   module.exports = pool;
   ```

4. Copy the provided `DataService.js` to `server/services/DataService.js`

## Step 8: Configure the Admin Dashboard

1. Update `client/admin/pages/index.js`:
   ```javascript
   import AshesiEatsDashboard from '../components/AshesiEatsDashboard';

   export default function Home() {
     return <AshesiEatsDashboard />;
   }
   ```

2. Copy the provided `AshesiEatsDashboard.jsx` to `client/admin/components/`

3. Set up Tailwind CSS:
   ```bash
   cd client/admin
   npx tailwindcss init -p
   ```

4. Create `client/admin/styles/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## Step 9: Configure the Student Application

1. Create `client/student/pages/index.js`:
   ```javascript
   import { useState, useEffect } from 'react';
   import RestaurantList from '../components/RestaurantList';

   export default function Home() {
     const [restaurants, setRestaurants] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       async function fetchRestaurants() {
         try {
           const response = await fetch('http://localhost:3000/api/restaurants');
           const data = await response.json();
           setRestaurants(data);
         } catch (error) {
           console.error('Error fetching restaurants:', error);
         } finally {
           setLoading(false);
         }
       }

       fetchRestaurants();
     }, []);

     if (loading) return <div>Loading...</div>;

     return (
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-6">AshesiEats</h1>
         <RestaurantList restaurants={restaurants} />
       </div>
     );
   }
   ```

2. Create necessary components for the student application:
   - RestaurantList.jsx
   - RestaurantMenu.jsx
   - Cart.jsx
   - OrderTracker.jsx

3. Set up Tailwind CSS for the student app as well.

## Step 10: Update Root package.json Scripts

Add these scripts to your root `package.json`:

```json
"scripts": {
  "server": "nodemon server/server.js",
  "admin": "cd client/admin && npm run dev",
  "student": "cd client/student && npm run dev",
  "dev": "concurrently \"npm run server\" \"npm run admin\" \"npm run student\"",
  "build": "cd client/admin && npm run build && cd ../../client/student && npm run build",
  "start": "node server/server.js"
}
```

## Step 11: Create Client-Side API Services

1. Create `client/admin/services/api.js`:
   ```javascript
   const API_URL = 'http://localhost:3000/api';

   export const fetchStats = async () => {
     const response = await fetch(`${API_URL}/stats`);
     return response.json();
   };

   export const fetchOrders = async (page = 1) => {
     const response = await fetch(`${API_URL}/orders?page=${page}`);
     return response.json();
   };

   export const updateOrderStatus = async (orderId, status) => {
     const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
       method: 'PATCH',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ status }),
     });
     return response.json();
   };

   // Add more API methods as needed
   ```

2. Create a similar file for the student app.

## Step 12: Set Up Authentication

1. Create authentication controllers and middleware.

2. Implement JWT token-based authentication.

3. Add protected routes for admin and student areas.

## Step 13: Run the Application

1. Start everything in development mode:
   ```bash
   npm run dev
   ```

2. This will start:
   - Backend server on http://localhost:3000
   - Admin dashboard on http://localhost:3001
   - Student app on http://localhost:3002

## Step 14: Access the Applications

- Admin Dashboard: http://localhost:3001
- Student App: http://localhost:3002
- API: http://localhost:3000/api

## Step 15: Testing

1. Test the observer pattern implementation:
   - Make changes to orders or restaurants
   - Verify that the dashboard updates in real-time

2. Test all CRUD operations:
   - Create new orders
   - Update order status
   - Add/edit restaurants
   - View order history

## Deployment Considerations

For production deployment:

1. Use a proper database credential system
2. Set up HTTPS
3. Implement rate limiting
4. Add proper error logging
5. Set up monitoring
6. Consider containerizing the application with Docker

## Troubleshooting

- **Database Connection Issues**: Check your MySQL credentials and make sure the service is running
- **CORS Errors**: Verify that your CORS configuration is correct
- **React Component Errors**: Check the console for specific error messages
- **API 404 Errors**: Ensure your route paths are defined correctly

By following these steps, you'll have the complete AshesiEats application running locally with both the admin dashboard and student-facing application, all connected to the MySQL database with real-time updates via the observer pattern.

# Purpose of the AshesiEats application
The purpose of this application is to improve the technological convenience of Ashesi cafeteria systems by utilizing technological elements to ensure that customer waiting  times are reduced drastically and they get their food delivered smoothly.
# Tools used
Frontend: React.js
A JavaScript library for building user interfaces, focusing on component-based architecture. React allows developers to create reusable UI components that efficiently update when data changes through its virtual DOM approach. It's maintained by Facebook/Meta and has a robust ecosystem of supporting libraries.

Backend: Node.js
A JavaScript runtime environment that executes code outside the browser. Node.js enables building scalable server-side applications using JavaScript. It's event-driven and non-blocking, making it efficient for handling concurrent connections. Popular frameworks like Express.js simplify API development and server-side logic.

Database: MySQL
A popular open-source relational database management system. MySQL uses structured query language (SQL) for managing data and supports complex queries, transactions, and referential integrity through foreign keys. It's known for reliability, performance, and compatibility with various platforms and programming languages.
