import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useOrder } from '../context/OrderContext';
import OrderSummary from './OrderSummary';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const { addItem, currentOrder } = useOrder();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/restaurants/${id}`);
        console.log('Restaurant details response:', response.data);
        setRestaurant(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant details');
        console.error('Error fetching restaurant:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const handleAddToOrder = (item) => {
    const orderItem = {
      id: item.item_id,
      name: item.item_name,
      price: parseFloat(item.price),
      description: item.description,
      image_url: item.image_url,
      restaurant_id: id
    };
    addItem(orderItem, id);
  };

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
            src={restaurant.image_url || "/api/placeholder/100/100"} 
            alt={restaurant.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{restaurant.rating}</span>
              <span className="mx-2">•</span>
              <span>{restaurant.location || 'Ashesi Campus'}</span>
            </div>
            <p className="text-gray-600 mb-4">{restaurant.description}</p>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Opening Hours</h2>
              <p>{restaurant.opening_hours || 'Monday - Sunday: 8:00 AM - 8:00 PM'}</p>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button
                  onClick={() => setShowOrderSummary(true)}
                  className="bg-red-900 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <span className="mr-2">View Order</span>
                  {currentOrder.items.length > 0 && (
                    <span className="bg-white text-red-900 rounded-full w-6 h-6 flex items-center justify-center">
                      {currentOrder.items.length}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.menu && restaurant.menu.length > 0 ? (
                  restaurant.menu.map((item) => (
                    <div key={item.item_id} className="border rounded-lg p-4">
                      <div className="flex mb-2">
                        <div className="w-16 h-16 flex-shrink-0 mr-3">
                          <img 
                            src={item.image_url || "/api/placeholder/100/100"} 
                            alt={item.item_name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.item_name}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-green-600 font-semibold">GHC {item.price}</p>
                        <button
                          onClick={() => handleAddToOrder(item)}
                          className="bg-red-900 text-white px-3 py-1 rounded hover:bg-red-800"
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center">No menu items available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOrderSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <OrderSummary onClose={() => setShowOrderSummary(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails; 