import React from 'react';
import RestaurantDetails from '../components/RestaurantDetails';
import { OrderProvider } from '../context/OrderContext';

const RestaurantDetailsPage = () => {
  return (
    <OrderProvider>
      <div className="bg-gray-50 min-h-screen">
        <RestaurantDetails />
      </div>
    </OrderProvider>
  );
};

export default RestaurantDetailsPage; 