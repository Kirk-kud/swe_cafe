import React from "react";
import HomePage from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Heading from "./components/heading.jsx";
import Footer from "./components/Footer.jsx";
import RestaurantProfiles from "./pages/RestaurantProfiles.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AshesiEatsDashboard from "./pages/admin/AshesiEatsDashboard.jsx";
import CafeteriaManagement from "./pages/admin/CafeteriaManagement.jsx";
import OrderTracker from "./components/OrderTracker.jsx";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from './contexts/OrderContext';
import { PaymentProvider } from './contexts/PaymentContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <OrderProvider>
          <PaymentProvider>
            <div className="min-h-screen bg-gray-50">
              <header>
                <Heading />
                <Navbar />
              </header>
              <main>
                <Routes>
                  <Route exact path="/" element={<HomePage />} />
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/signup" element={<Signup />} />
                  <Route exact path="/track-order" element={<OrderTracker />} />
                  <Route
                    exact
                    path="/RestaurantProfiles"
                    element={
                      <ProtectedRoute>
                        <RestaurantProfiles />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    exact
                    path="/AshesiEatsDashboard"
                    element={
                      <ProtectedRoute>
                        <AshesiEatsDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    exact
                    path="/CafeteriaManagement"
                    element={
                      <ProtectedRoute>
                        <CafeteriaManagement />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <footer>
                <Footer />
              </footer>
            </div>
          </PaymentProvider>
        </OrderProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
