import React from "react";

const LocationBar = () => {
  return (
    <div className="flex items-center justify-between  w-full">
      <div className="flex items-center py-2 px-4">
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
            Regent Street, A4, A4201, London
          </span>
          <span className="ml-3 text-orange-500 font-medium text-sm cursor-pointer hover:underline">
            Change Location
          </span>
        </div>
      </div>

      {/* Right side - Shopping Cart */}
      <div className="flex h-full">
        <div className="bg-green-600 text-white flex items-center px-4 py-2">
          <div className="flex items-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2H5a2 2 0 0 0-2 2v3m15 0V4a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <div className="ml-1 flex items-center justify-center bg-white text-green-600 rounded-full h-5 w-5 font-bold text-xs">
              WG
            </div>
          </div>
          <span className="font-medium">23 Items</span>
        </div>
        <div className="bg-green-600 text-white flex items-center px-4 border-l border-green-700">
          <span className="font-medium">GBP 79.89</span>
        </div>
        <div className="bg-green-600 text-white flex items-center px-4 border-l border-green-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LocationBar;
