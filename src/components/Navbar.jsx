import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user, loading } = useAuth();
  
  // Enhanced debugging for authentication state
  useEffect(() => {
    // console.log("Auth state in Navbar:", { 
    //   isAuthenticated, 
    //   userExists: !!user, 
    //   loading,
    //   token: localStorage.getItem('token'),
    //   storedUserData: localStorage.getItem('user')
    // });
    
    if (user) {
      //console.log("User data in Navbar:", user);
      //console.log("Permission level:", user.permissionLevel);
      //console.log("User type:", user.user_type);
    } else {
      console.log("User is null in Navbar");
      // Check if there's data in localStorage that's not being loaded properly
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          console.log("Found user data in localStorage:", JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data from localStorage", e);
        }
      } else {
        console.log("No user data found in localStorage");
      }
    }
  }, [user, isAuthenticated, loading]);
  
  // Check if user is a cafeteria admin
  // Check multiple possible admin indicators
  const isCafeteriaAdmin = user && (
    user.user_type === 'admin' || 
    user.role === 'admin' || 
    user.isAdmin === true ||
    user.isRestaurantAdmin === true
  );
  
  // Check if user has full access permission
  const hasFullAccess = user && (
    // Only users with explicit full_access permission level should see dashboard
    user.permissionLevel === 'full_access'
  );
  
  //console.log("Is cafeteria admin?", isCafeteriaAdmin);
  //console.log("Has full access?", hasFullAccess);

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
              {/* Only show Dashboard for users with full access permission */}
              {hasFullAccess && (
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
