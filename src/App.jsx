import React from "react";
import HomePage from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Heading from "./components/heading.jsx";
import Footer from "./components/Footer.jsx";
import RestaurantProfiles from "./pages/RestaurantProfiles.jsx";
import RestaurantDetailsPage from "./pages/RestaurantDetails.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AshesiEatsDashboard from "./pages/admin/AshesiEatsDashboard.jsx";
import CafeteriaManagement from "./pages/admin/CafeteriaManagement.jsx";
import OrderTracker from "./components/OrderTracker.jsx";
import OrderHistory from "./components/OrderHistory.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from './context/OrderContext';
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <PaymentProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/RestaurantProfiles" element={<RestaurantProfiles />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Order tracking routes */}
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders/:orderId" 
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Redirect /track-order to /orders */}
                  <Route path="/track-order" element={<Navigate to="/orders" replace />} />
                  
                  {/* Admin routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AshesiEatsDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/cafeteria" 
                    element={
                      <ProtectedRoute>
                        <CafeteriaManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/cafeteria/:restaurantId" 
                    element={
                      <ProtectedRoute>
                        <CafeteriaManagement />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </PaymentProvider>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
