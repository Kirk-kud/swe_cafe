import React from "react";

const colorMap = {
  orange: "bg-orange-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  white: "bg-white",
};

const RestaurantCard = ({ text, color = "white", image }) => {
  const bgColor = colorMap[color] || "bg-white";
  return (
    <div
      className={`w-3xs h-auto rounded-lg shadow-sm hover:scale-105 ${bgColor} transition-all`}
    >
      <a href="#">
        <img className="rounded-t-lg" src={image} alt="" />
      </a>
      <div className={`p-5`}>
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
            {text}
          </h5>
        </a>
      </div>
    </div>
  );
};

export default RestaurantCard;
