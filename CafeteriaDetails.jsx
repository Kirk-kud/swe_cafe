import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, ChevronLeft } from 'react-feather';

// Cafeteria data
const cafeterias = {
  akornor: {
    name: "Akornor Cafeteria",
    location: "Beside the Library",
    rating: 4.3,
    description: "Main cafeteria serving local and continental dishes. Famous for their jollof rice on Fridays.",
    hours: "7:30 AM - 7:00 PM (Mon-Thu), 7:30 AM - 5:00 PM (Fri)",
    popularItems: [
      { name: "Jollof Rice with Chicken", price: "GH₵18" },
      { name: "Banku with Tilapia", price: "GH₵20" },
      { name: "Fried Rice with Veggies", price: "GH₵15" }
    ]
  },
  munchies: {
    name: "Munchies",
    location: "Near the Computer Lab",
    rating: 4.5,
    description: "Quick bites and snacks spot. Best burgers on campus!",
    hours: "8:00 AM - 8:00 PM (Mon-Thu), 8:00 AM - 6:00 PM (Fri)",
    popularItems: [
      { name: "Club Sandwich", price: "GH₵15" },
      { name: "Chicken Burger", price: "GH₵18" },
      { name: "Mango Smoothie", price: "GH₵10" }
    ]
  },
  hallmark: {
    name: "Hallmark",
    location: "Opposite Engineering Building",
    rating: 4.1,
    description: "Casual dining with authentic local dishes. Wednesday waakye special!",
    hours: "8:00 AM - 11:00 PM (Mon-Fri)",
    popularItems: [
      { name: "Waakye with Chicken", price: "GH₵35" },
      { name: "Fufu with Light Soup", price: "GH₵40" },
      { name: "Red Red with Plantain", price: "GH₵14" }
    ]
  }
};

const CafeteriaDetails = () => {
  const { cafeteriaId } = useParams();
  const [activeTab, setActiveTab] = useState('menu');
  const cafeteria = cafeterias[cafeteriaId];

  if (!cafeteria) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">Cafeteria not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back button */}
      <Link 
        to="/cafeterias" 
        className="flex items-center text-blue-600 mb-4 hover:underline"
      >
        <ChevronLeft size={20} />
        <span>Back to all cafeterias</span>
      </Link>

      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{cafeteria.name}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin size={16} className="mr-1" />
          <span>{cafeteria.location}</span>
        </div>
        <div className="flex items-center mt-1">
          <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-medium">{cafeteria.rating}</span>
          <span className="text-gray-500 ml-1">({cafeteria.rating > 4.4 ? 'Excellent' : 'Very Good'})</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-6">{cafeteria.description}</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'menu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'hours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('hours')}
        >
          Hours
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'menu' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Items</h2>
          <div className="space-y-4">
            {cafeteria.popularItems.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <span className="font-semibold text-green-600">{item.price}</span>
                </div>
                <button className="mt-2 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Add to order
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hours' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
            <Clock size={20} className="text-gray-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">{cafeteria.hours}</p>
              <p className="text-gray-600 mt-1">Closed on weekends</p>
            </div>
          </div>
        </div>
      )}

      {/* Fixed order button */}
      <div className="fixed bottom-6 right-6">
        <button className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition flex items-center">
          <span className="mr-2">View Order</span>
          <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center">3</span>
        </button>
      </div>
    </div>
  );
};

export default CafeteriaDetails;