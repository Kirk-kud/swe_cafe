import React, { useEffect } from "react";
import HomePage from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Heading from "./components/heading.jsx";
import Footer from "./components/Footer.jsx";
import RestaurantProfiles from "./pages/RestaurantProfiles.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AshesiEatsDashboard from "./pages/admin/AshesiEatsDashboard.jsx"
import CafeteriaManagement from "./pages/admin/CafeteriaManagement.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider, useSession } from './context/SessionContext';
import Header from './components/Header';
import RestaurantDetails from './components/RestaurantDetails';
import Dashboard from './components/Dashboard';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSession();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/RestaurantProfiles" element={<RestaurantProfiles />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/restaurants/:id" element={<RestaurantDetails />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                exact
                path="/AshesiEatsDashboard"
                element={<AshesiEatsDashboard />}
              ></Route>
              <Route
                exact
                path="/CafeteriaManagement"
                element={<CafeteriaManagement />}
              ></Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;
