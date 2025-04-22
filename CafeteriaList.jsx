import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'react-feather';

const cafeterias = [
  {
    id: 'akornor',
    name: 'Akornor Cafeteria',
    location: 'Beside the Library',
    rating: 4.3,
    description: 'Main cafeteria serving local and continental dishes'
  },
  {
    id: 'munchies',
    name: 'Munchies',
    location: 'Near the Computer Lab',
    rating: 4.5,
    description: 'Quick bites and snacks spot'
  },
  {
    id: 'hallmark',
    name: 'Hallmark',
    location: 'Opposite Engineering Building',
    rating: 4.1,
    description: 'Casual dining with authentic local dishes'
  }
];

const CafeteriaList = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ashesi University Cafeterias</h1>
      
      <div className="space-y-4">
        {cafeterias.map(cafeteria => (
          <Link 
            to={`/cafeteria/${cafeteria.id}`} 
            key={cafeteria.id}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{cafeteria.name}</h2>
            <div className="flex items-center mt-1 text-gray-600">
              <MapPin size={14} className="mr-1" />
              <span>{cafeteria.location}</span>
            </div>
            <div className="flex items-center mt-2">
              <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">{cafeteria.rating}</span>
            </div>
            <p className="text-gray-700 mt-2">{cafeteria.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CafeteriaList;