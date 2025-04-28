import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/restaurants/${id}`);
        setRestaurant(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant details');
        console.error('Error fetching restaurant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!restaurant) {
    return <div className="flex justify-center items-center h-screen">Restaurant not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src={restaurant.image_url} 
            alt={restaurant.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{restaurant.rating}</span>
              <span className="mx-2">•</span>
              <span>{restaurant.location}</span>
            </div>
            <p className="text-gray-600 mb-4">{restaurant.description}</p>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Opening Hours</h2>
              <p>{restaurant.opening_hours}</p>
            </div>
            
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.menu?.map((item) => (
                  <div key={item.item_id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="text-green-600 font-semibold mt-2">${item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails; 