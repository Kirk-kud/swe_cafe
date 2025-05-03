import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RestaurantCard = ({ text, color, image, description, id }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  const handleViewMenu = () => {
    if (isAuthenticated) {
      navigate(`/restaurant/${id || getRestaurantId(text)}`);
    } else {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 3000); // Hide message after 3 seconds
    }
  };

  // Helper function to get restaurant ID based on name
  const getRestaurantId = (name) => {
    switch(name.toLowerCase()) {
      case 'akornor':
        return 1;
      case 'hallmark':
        return 2;
      case 'munchies':
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg relative">
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={text}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Restaurant Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800">{text}</h3>
          <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
        </div>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm text-gray-600">4.8 (120 reviews)</span>
          </div>
          <button 
            onClick={handleViewMenu} 
            className="text-red-600 hover:text-red-700 font-medium"
          >
            View Menu →
          </button>
        </div>
      </div>

      {/* Login message tooltip */}
      {showLoginMsg && (
        <div className="absolute bottom-20 right-0 left-0 mx-auto w-max bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-up">
          Please log in to view the menu
        </div>
      )}
    </div>
  );
};

export default RestaurantCard;
