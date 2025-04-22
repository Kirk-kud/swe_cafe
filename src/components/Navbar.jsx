import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <header
        className="flex justify-between items-center text-black py-6 px-8
        md:px-32 bg-blue"
      >
        <a href="" className="w-52 hover:scale-105 transition-all">
          AshesiEats
        </a>
        <ul className="flex items-center gap-12 font-semibold text-base">
          <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
            <Link to="/AshesiEatsDashboard">Dashboard</Link>
          </li>
          <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
            <Link to="/RestaurantProfiles">Restaurants</Link>
          </li>
          <li className="p-3 hover:text-red-400 rounded-md transition-all cursor-pointer">
            Track Order
          </li>
          <div className="flex items-center gap-4">
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
          </div>
        </ul>
      </header>
    </nav>
  );
};

export default Navbar;
