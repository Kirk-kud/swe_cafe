import React from "react";
import { useAuth } from "../context/AuthContext";

const Heading = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-between w-full bg-gray-100 py-2 px-4">
      <div className="flex items-center">
        <div className="flex items-center mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-sm">
            Ashesi University, Berekuso
          </span>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
            {user?.fullName?.[0] || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Welcome, {user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
