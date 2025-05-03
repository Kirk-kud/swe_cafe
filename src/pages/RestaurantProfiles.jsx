import React, { useState, useEffect } from "react";
import FoodCard from "../components/Food_Card";
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
        const response = await axios.get("http://localhost:3000/api/restaurants/1");
        console.log('Restaurants response:', response.data);
        
        // Make sure we're setting an array to the state
        if (Array.isArray(response.data)) {
          setRestaurants(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // Check if the response contains a data/restaurants/items property that is an array
          if (response.data.restaurants && Array.isArray(response.data.restaurants)) {
            setRestaurants(response.data.restaurants);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            setRestaurants(response.data.data);
          } else if (response.data.items && Array.isArray(response.data.items)) {
            setRestaurants(response.data.items);
          } else {
            // If it's a single restaurant object, wrap it in an array
            setRestaurants([response.data]);
          }
        } else {
          throw new Error("Unexpected API response format");
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError(err.response?.data?.error || err.message || "Failed to fetch restaurants");
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

  // Guard against restaurants not being an array
  if (!Array.isArray(restaurants)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-500">Invalid restaurant data format</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Restaurants</h1>
        </div>
        
        <div className="flex-1">
          {restaurants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p>No restaurants found</p>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <div key={restaurant.id || `restaurant-${Math.random()}`} className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={restaurant.image_url || "/api/placeholder/100/100"}
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
                    {Array.isArray(restaurant.menuItems) && restaurant.menuItems.length > 0 ? (
                      restaurant.menuItems.map((item) => (
                        <Link to={`/restaurant/${restaurant.id}`} key={item.id || `item-${Math.random()}`}>
                          <FoodCard
                            title={item.item_name}
                            text={item.description}
                            price={item.price}
                            image={item.image_url || "/api/placeholder/100/100"}
                          />
                        </Link>
                      ))
                    ) : (
                      <p className="col-span-3">No menu items available</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfiles;