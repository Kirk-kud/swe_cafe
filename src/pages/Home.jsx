import React from "react";
import RestaurantCard from "../components/Restaurant_Card.jsx";
import Api from "../components/Api.jsx";
import akonnorImage from "../assets/akonnor.jpg";
import munchiesImage from "../assets/test2.png";
import hallmarkImage from "../assets/test.png";
import mainImage from "../assets/dinning.png";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh]">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 bg-cover bg-center"
          style={{ backgroundImage: `url(${mainImage})` }}
        />
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
          <div className="bg-black bg-opacity-50 p-8 rounded-lg backdrop-blur-sm">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to AshesiEats
            </h1>
            <p className="text-2xl md:text-4xl">
              Crave it. Click it. Campus-delivered.
            </p>
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Featured Restaurants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best dining options on campus. From local favorites to international cuisine, we've got you covered.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <RestaurantCard 
              text="Akornor" 
              color="red" 
              image={akonnorImage}
              description="Authentic Ghanaian cuisine with a modern twist"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <RestaurantCard 
              text="Munchies" 
              color="blue" 
              image={munchiesImage}
              description="Quick bites and snacks for your busy schedule"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <RestaurantCard 
              text="Hallmark" 
              color="green" 
              image={hallmarkImage}
              description="Premium dining experience with international flavors"
            />
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300">
            View All Restaurants
          </button>
        </div>
      </div>
      <Api />
    </div>
  );
};

export default HomePage;
