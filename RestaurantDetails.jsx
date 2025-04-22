import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, Globe, Heart } from 'react-feather';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState({});
  
  // Mock data - in a real app, you'd fetch this from an API
  useEffect(() => {
    // Simulate API call
    const fetchRestaurant = async () => {
      // This would be your actual API call:
      // const response = await fetch(`/api/restaurants/${id}`);
      // const data = await response.json();
      
      // Mock data
      const mockRestaurant = {
        id: id,
        name: "Gourmet Paradise",
        cuisine: "Italian, Mediterranean",
        rating: 4.7,
        reviewCount: 128,
        priceRange: "$$$",
        address: "123 Food Street, Culinary City",
        phone: "(555) 123-4567",
        website: "www.gourmetparadise.com",
        hours: {
          Monday: "11:00 AM - 10:00 PM",
          Tuesday: "11:00 AM - 10:00 PM",
          Wednesday: "11:00 AM - 10:00 PM",
          Thursday: "11:00 AM - 11:00 PM",
          Friday: "11:00 AM - 11:00 PM",
          Saturday: "10:00 AM - 11:00 PM",
          Sunday: "10:00 AM - 9:00 PM"
        },
        description: "Authentic Italian cuisine with a modern twist. Family-owned since 1985, we pride ourselves on using only the freshest ingredients.",
        images: [
          "https://example.com/restaurant1.jpg",
          "https://example.com/restaurant2.jpg"
        ],
        menu: {
          appetizers: [
            { id: 1, name: "Bruschetta", description: "Toasted bread topped with tomatoes, garlic, and fresh basil", price: 8.99 },
            { id: 2, name: "Calamari", description: "Crispy fried squid with marinara sauce", price: 12.99 }
          ],
          mains: [
            { id: 3, name: "Spaghetti Carbonara", description: "Classic Roman pasta with eggs, cheese, pancetta, and pepper", price: 18.99 },
            { id: 4, name: "Margherita Pizza", description: "Tomato sauce, fresh mozzarella, and basil", price: 16.99 }
          ],
          desserts: [
            { id: 5, name: "Tiramisu", description: "Coffee-flavored Italian dessert", price: 7.99 },
            { id: 6, name: "Cannoli", description: "Crispy pastry shell with sweet ricotta filling", price: 6.99 }
          ]
        },
        reviews: [
          { id: 1, user: "FoodLover42", rating: 5, comment: "Absolutely amazing! The pasta was cooked perfectly.", date: "2023-05-15" },
          { id: 2, user: "DiningExpert", rating: 4, comment: "Great food but service was a bit slow on a busy night.", date: "2023-04-22" }
        ]
      };
      
      setRestaurant(mockRestaurant);
    };
    
    fetchRestaurant();
  }, [id]);
  
  const handleAddToOrder = (itemId) => {
    setQuantity(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };
  
  const handleRemoveFromOrder = (itemId) => {
    if (quantity[itemId] && quantity[itemId] > 0) {
      setQuantity(prev => ({
        ...prev,
        [itemId]: prev[itemId] - 1
      }));
    }
  };
  
  if (!restaurant) {
    return <div className="loading">Loading restaurant details...</div>;
  }

  return (
    <div className="restaurant-details">
      {/* Header with image and basic info */}
      <div className="restaurant-header">
        <div className="restaurant-image">
          <img src={restaurant.images[0]} alt={restaurant.name} />
          <button 
            className={`favorite-button ${favorite ? 'active' : ''}`}
            onClick={() => setFavorite(!favorite)}
          >
            <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <div className="cuisine">{restaurant.cuisine}</div>
          
          <div className="rating-price">
            <div className="rating">
              <Star size={16} fill="currentColor" />
              <span>{restaurant.rating}</span>
              <span>({restaurant.reviewCount} reviews)</span>
            </div>
            <div className="price-range">{restaurant.priceRange}</div>
          </div>
          
          <div className="description">{restaurant.description}</div>
          
          <div className="contact-info">
            <div className="info-item">
              <MapPin size={16} />
              <span>{restaurant.address}</span>
            </div>
            <div className="info-item">
              <Phone size={16} />
              <span>{restaurant.phone}</span>
            </div>
            <div className="info-item">
              <Globe size={16} />
              <a href={`https://${restaurant.website}`} target="_blank" rel="noopener noreferrer">
                {restaurant.website}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="restaurant-tabs">
        <button 
          className={activeTab === 'menu' ? 'active' : ''}
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
        <button 
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button 
          className={activeTab === 'hours' ? 'active' : ''}
          onClick={() => setActiveTab('hours')}
        >
          Hours
        </button>
      </div>
      
      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'menu' && (
          <div className="menu-section">
            <h2>Appetizers</h2>
            {restaurant.menu.appetizers.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                  <p className="price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleRemoveFromOrder(item.id)}>-</button>
                  <span>{quantity[item.id] || 0}</span>
                  <button onClick={() => handleAddToOrder(item.id)}>+</button>
                </div>
              </div>
            ))}
            
            <h2>Main Courses</h2>
            {restaurant.menu.mains.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                  <p className="price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleRemoveFromOrder(item.id)}>-</button>
                  <span>{quantity[item.id] || 0}</span>
                  <button onClick={() => handleAddToOrder(item.id)}>+</button>
                </div>
              </div>
            ))}
            
            <h2>Desserts</h2>
            {restaurant.menu.desserts.map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                  <p className="price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleRemoveFromOrder(item.id)}>-</button>
                  <span>{quantity[item.id] || 0}</span>
                  <button onClick={() => handleAddToOrder(item.id)}>+</button>
                </div>
              </div>
            ))}
            
            {/* Order summary */}
            {Object.keys(quantity).some(key => quantity[key] > 0) && (
              <div className="order-summary">
                <h3>Your Order</h3>
                {Object.entries(quantity)
                  .filter(([_, qty]) => qty > 0)
                  .map(([itemId, qty]) => {
                    const item = [...restaurant.menu.appetizers, ...restaurant.menu.mains, ...restaurant.menu.desserts]
                      .find(i => i.id === parseInt(itemId));
                    return (
                      <div key={itemId} className="order-item">
                        <span>{item.name} x {qty}</span>
                        <span>${(item.price * qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                <button className="checkout-button">Proceed to Checkout</button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {restaurant.reviews.map(review => (
              <div key={review.id} className="review">
                <div className="review-header">
                  <span className="user">{review.user}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < review.rating ? 'currentColor' : 'none'} 
                      />
                    ))}
                  </div>
                  <span className="date">{review.date}</span>
                </div>
                <p className="comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'hours' && (
          <div className="hours-section">
            <h2>Opening Hours</h2>
            <ul className="hours-list">
              {Object.entries(restaurant.hours).map(([day, hours]) => (
                <li key={day}>
                  <span className="day">{day}</span>
                  <span className="time">{hours}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;