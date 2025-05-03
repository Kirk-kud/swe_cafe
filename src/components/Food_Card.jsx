import React from "react";

const FoodCard = ({ title, text, image, price }) => {
  return (
    <div className="flex flex-col sm:flex-row w-lg sm:max-w-full rounded-lg shadow-md overflow-hidden">
      <div className="w-full sm:w-48 h-48 flex-shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h5 className="text-lg font-bold mb-2">{title}</h5>
          <p className="text-gray-700 text-sm mb-2">{text}</p>
          <p className="text-blue-600 font-bold">GHC {price}</p>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            Buy Now
          </button>
          <button className="bg-gray-300 text-black px-3 py-1 rounded">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
