import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  
  // Debug user information 
  useEffect(() => {
    if (user) {
      console.log("User data in Navbar:", user);
    }
  }, [user]);
  
  // Check if user is a cafeteria admin
  // Check multiple possible admin indicators
  const isCafeteriaAdmin = user && (
    user.user_type === 'admin' || 
    user.role === 'admin' || 
    user.isAdmin === true ||
    user.isRestaurantAdmin === true || 
    (user.restaurant_id && user.restaurant_id > 0)
  );
  
  console.log("Is cafeteria admin?", isCafeteriaAdmin);

  return (
    <nav>
      <header
        className="flex justify-between items-center text-black py-6 px-8
        md:px-32 bg-blue"
      >
        <Link to="/" className="w-52 hover:scale-105 transition-all">
          AshesiEats
        </Link>
        <ul className="flex items-center gap-12 font-semibold text-base">
          <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          {isAuthenticated && (
            <>
              {isCafeteriaAdmin && (
                <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
              )}
              <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
                <Link to="/RestaurantProfiles">Restaurants</Link>
              </li>
              {isCafeteriaAdmin ? (
                <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
                  <Link to="/admin/cafeteria">Cafeteria Management</Link>
                </li>
              ) : (
                <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
                  <Link to="/orders">Track Order</Link>
                </li>
              )}
            </>
          )}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <li>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-800 hover:text-red-400 transition-all cursor-pointer"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </div>
        </ul>
      </header>
    </nav>
  );
};

export default Navbar;
