import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
import HomePage from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import RestaurantProfiles from "./pages/RestaurantProfiles.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import Heading from "./components/Heading.jsx";
import Footer from "./components/Footer.jsx";

// Admin
// import AdminLayout from "./pages/admin/layout/AdminLayout.jsx";
// import Dashboard from "./pages/admin/Dashboard.jsx";

function App() {
  return (
    <Router>
      <div>
        {/* Header for all non-auth pages */}
        <Routes>
          <Route path="/login" element={null} />
          <Route path="/signup" element={null} />
          <Route path="/admin/*" element={null} />
          <Route path="*" element={
            <header>
              <Heading />
              <Navbar />
            </header>
          } />
        </Routes>

        {/* Main content */}
        <main className="min-h-screen">
          <Routes>
            {/* Home and public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantProfiles />} />
            <Route path="/RestaurantProfiles" element={<RestaurantProfiles />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin routes */}
            {/* <Route path="/admin" element={<AdminLayout />}> */}
              {/* <Route index element={<Dashboard />} /> */}
              {/* Add other admin routes here */}
            {/* </Route> */}
          </Routes>
        </main>

        {/* Footer for all non-auth pages */}
        <Routes>
          <Route path="/login" element={null} />
          <Route path="/signup" element={null} />
          {/* <Route path="/admin/*" element={null} /> */}
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;