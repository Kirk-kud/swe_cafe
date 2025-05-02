import React, { useState, useEffect } from "react";
import FoodCard from "../components/Food_Card";
import MenuBar from "../components/MenuBar";
import ShoppingBasket from "../components/ShoppingBasket";
import Search from "../components/Search";
import RestaurantInfoCard from "../components/RestaurantInfoCard";
import axios from "axios";
import { Link } from "react-router-dom";

const RestaurantProfiles = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log('Fetching restaurants...');
        const response = await axios.get("http://localhost:3000/api/restaurants");
        console.log('Restaurants response:', response.data);
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError(err.response?.data?.error || "Failed to fetch restaurants");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Restaurants</h1>
          </div>
          <div className="w-64">
            <Search />
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="w-64">
            <MenuBar />
          </div>

          <div className="flex-1">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                      <p className="text-gray-600">{restaurant.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500">★ {restaurant.rating}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{restaurant.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurant.menuItems?.map((item) => (
                      <Link to={`/restaurant/${restaurant.id}`} key={item.id}>
                        <FoodCard
                          title={item.item_name}
                          text={item.description}
                          price={item.price}
                          image={item.image_url}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-64">
            <ShoppingBasket />
          </div>
        </div>

        <div className="mt-8">
          <RestaurantInfoCard />
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfiles;
