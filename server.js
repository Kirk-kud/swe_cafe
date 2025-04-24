import cors from "cors";
import express from "express";

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

// // Test route
// app.get("/", (req, res) => {
//   res.json({ message: "Hello from the server!" });
// });

// Example for Express backend
app.get('/api', (req, res) => {
    res.json({ message: "👋 Welcome back to AshesiEats!" });
  });


// Start server
app.listen(8080, () => {
  console.log("✅ Server started on port 8080");
});
