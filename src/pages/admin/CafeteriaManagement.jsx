import { ChevronLeft, ChevronRight, ClipboardList, DollarSign, Edit, Search, Settings, ShoppingBag, Trash, Users, Plus } from "lucide-react";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import CafeteriaService from "../../api/cafeteriaService";

const CafeteriaManagement = () => {
  const [activeTab, setActiveTab] = useState('Menu');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cafeteriaStats, setCafeteriaStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayRevenue: '₵0',
    popularItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMenuItemForm, setShowAddMenuItemForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const { user } = useAuth();
  const { restaurantId } = useParams();

  // Get the active restaurant ID
  const activeRestaurantId = restaurantId || user?.restaurant_id || 1;

  // New menu item form state
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    available: true,
    image: '',
    description: ''
  });

  // Categories for menu items
  const categories = ['Main Course', 'Appetizer', 'Beverage', 'Dessert', 'Side Dish'];

  // Fetch menu items from the API
  const fetchMenuItems = async () => {
    try {
      const data = await CafeteriaService.getMenuItems(activeRestaurantId);
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items');
      // Don't use placeholder data
      setMenuItems([]);
    }
  };

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const data = await CafeteriaService.getOrders(activeRestaurantId);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Set orders to empty array instead of using demo data
      setOrders([]);
    }
  };

  // Fetch cafeteria statistics from the API
  const fetchStats = async () => {
    try {
      const data = await CafeteriaService.getRestaurantStats(activeRestaurantId);
      
      // Normalize data to ensure all fields exist
      const normalizedData = {
        totalOrders: data.totalOrders || data.orders || 0,
        pendingOrders: data.pendingOrders || 0,
        completedOrders: data.completedOrders || 0,
        todayRevenue: data.todayRevenue || (data.revenue ? `₵${data.revenue}` : '₵0'),
        popularItems: Array.isArray(data.popularItems) ? data.popularItems : []
      };
      
      setCafeteriaStats(normalizedData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Calculate stats from available orders as a fallback
      if (orders.length > 0) {
        const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
        const completedCount = orders.filter(o => o.status === 'Delivered' || o.status === 'Ready').length;
        const todayTotal = orders.reduce((sum, order) => {
          const amount = parseFloat(order.amount?.replace('₵', '') || '0');
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        
        // Count occurrences of each item safely
        const itemCounts = {};
        orders.forEach(order => {
          if (Array.isArray(order.items)) {
            order.items.forEach(item => {
              if (item) {
                const itemName = String(item);
                itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
              }
            });
          }
        });
        
        // Sort items by popularity
        const popularItems = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0])
          .slice(0, 3);
        
        setCafeteriaStats({
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          completedOrders: completedCount,
          todayRevenue: `₵${todayTotal.toFixed(2)}`,
          popularItems
        });
      } else {
        // Set defaults if no orders available
        setCafeteriaStats({
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          todayRevenue: '₵0',
          popularItems: []
        });
      }
    }
  };

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMenuItems(), fetchOrders()]);
      await fetchStats();
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Set up periodic refresh
    const refreshInterval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(refreshInterval);
  }, [activeRestaurantId]);

  // Handle menu item submission (add/edit)
  const handleMenuItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        ...newMenuItem,
        price: parseFloat(newMenuItem.price).toFixed(2),
      };

      if (editingMenuItem) {
        // Update existing item
        await CafeteriaService.updateMenuItem(editingMenuItem.id, itemData);
      } else {
        // Add new item
        await CafeteriaService.addMenuItem(activeRestaurantId, itemData);
      }
      
      // Refresh menu items
      await fetchMenuItems();
      
      // Reset form
      setNewMenuItem({
        name: '',
        price: '',
        category: 'Main Course',
        available: true,
        image: '',
        description: ''
      });
      setEditingMenuItem(null);
      setShowAddMenuItemForm(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item. Please try again.');
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      // Ensure itemId is properly formatted
      const formattedItemId = String(itemId);
      
      await CafeteriaService.deleteMenuItem(formattedItemId);
      // Refresh menu items after deletion
      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item. Please try again.');
    }
  };

  // Edit menu item
  const handleEditMenuItem = (item) => {
    // Handle property name differences
    const itemName = item.name || item.item_name || '';
    const itemPrice = item.price || 0;
    const itemCategory = item.category || 'Main Course';
    const itemAvailable = item.available !== undefined ? item.available : true;
    const itemImage = item.image || item.image_url || '';
    const itemDescription = item.description || '';
    
    // Format price - remove currency symbol if present
    const formattedPrice = typeof itemPrice === 'string' ? 
      itemPrice.replace('₵', '').trim() : 
      itemPrice.toString();
    
    setEditingMenuItem(item);
    setNewMenuItem({
      name: itemName,
      price: formattedPrice,
      category: itemCategory,
      available: itemAvailable,
      image: itemImage,
      description: itemDescription
    });
    setShowAddMenuItemForm(true);
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Ensure orderId is properly formatted
      const formattedOrderId = String(orderId);
      
      await CafeteriaService.updateOrderStatus(formattedOrderId, newStatus);
      // Refresh orders after status update
      await fetchOrders();
      // Also refresh stats as this may affect them
      await fetchStats();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Update payment status
  const handleUpdatePaymentStatus = async (orderId, isPaid) => {
    try {
      // Ensure orderId is properly formatted
      const formattedOrderId = String(orderId);
      
      await CafeteriaService.updateOrderPaymentStatus(formattedOrderId, isPaid);
      // Refresh orders after payment status update
      await fetchOrders();
      // Also refresh stats as this may affect them
      await fetchStats();
      
      alert(`Order marked as ${isPaid ? 'paid' : 'unpaid'}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
    }
  };

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item => {
    // Handle property name differences between API and frontend
    const itemName = item.name || item.item_name || '';
    const itemCategory = item.category || '';
    const search = searchTerm.toLowerCase();
    
    return itemName.toLowerCase().includes(search) ||
           itemCategory.toLowerCase().includes(search);
  });

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    // Convert all values to strings explicitly
    const id = String(order.id || '');
    const customer = String(order.customer || '');
    const status = String(order.status || '');
    const search = searchTerm.toLowerCase();
    
    // Ensure items array exists before calling some() on it
    const itemsMatch = Array.isArray(order.items) ? 
      order.items.some(item => String(item || '').toLowerCase().includes(search)) : 
      false;
    
    return id.toLowerCase().includes(search) ||
           customer.toLowerCase().includes(search) ||
           status.toLowerCase().includes(search) ||
           itemsMatch;
  });

  // Navigation tabs
  const tabs = [
    { name: 'Menu', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', icon: <ClipboardList size={20} /> },
    { name: 'Analytics', icon: <DollarSign size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ];

  // Function to get status styling
  const getStatusStyle = (status) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-600';
    if (status === 'Ready') return 'bg-blue-100 text-blue-600';
    if (status === 'Preparing') return 'bg-yellow-100 text-yellow-600';
    if (status === 'Pending') return 'bg-orange-100 text-orange-600';
    return '';
  };

  // Menu Item Form component
  const MenuItemForm = () => (
    <form onSubmit={handleMenuItemSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Item Name*</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-lg" 
            value={newMenuItem.name}
            onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Price (₵)*</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded-lg" 
            value={newMenuItem.price}
            onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Category*</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={newMenuItem.category}
            onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Availability</label>
          <div className="flex items-center mt-2">
            <input 
              type="checkbox" 
              id="available" 
              className="mr-2"
              checked={newMenuItem.available}
              onChange={(e) => setNewMenuItem({...newMenuItem, available: e.target.checked})}
            />
            <label htmlFor="available">Available for ordering</label>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Image URL</label>
        <input 
          type="url" 
          className="w-full p-2 border rounded-lg" 
          value={newMenuItem.image}
          onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea 
          className="w-full p-2 border rounded-lg" 
          rows="3"
          value={newMenuItem.description}
          onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
          placeholder="Describe the dish, ingredients, etc."
        ></textarea>
      </div>
      
      <div className="flex justify-end">
        <button 
          type="button" 
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          onClick={() => {
            setShowAddMenuItemForm(false);
            setEditingMenuItem(null);
            setNewMenuItem({
              name: '',
              price: '',
              category: 'Main Course',
              available: true,
              image: '',
              description: ''
            });
          }}
        >
          Cancel
        </button>
        <button type="submit" className="bg-red-900 text-white px-4 py-2 rounded">
          {editingMenuItem ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );

  // Menu Item component
  const MenuItem = ({ item }) => {
    // Handle property name differences
    const itemId = item.id || item.item_id;
    const itemName = item.name || item.item_name || 'Unnamed Item';
    const itemCategory = item.category || '';
    const itemDescription = item.description || '';
    const itemImage = item.image || item.image_url;
    const itemPrice = item.price || 0;
    const itemAvailable = item.available !== undefined ? item.available : true;
    
    return (
      <div className="bg-white rounded-lg shadow p-4 flex">
        <img 
          src={itemImage} 
          alt={itemName} 
          className="w-20 h-20 object-cover rounded-lg mr-4"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/80x80?text=Food"; 
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-bold">{itemName}</h3>
            <span className="font-bold text-red-900">{typeof itemPrice === 'string' && itemPrice.includes('₵') ? itemPrice : `₵${itemPrice}`}</span>
          </div>
          <p className="text-gray-500 text-sm">{itemCategory}</p>
          {itemDescription && <p className="text-gray-600 text-sm mt-1">{itemDescription}</p>}
          <div className="flex justify-between items-center mt-2">
            <span className={`px-2 py-1 rounded-full text-xs ${itemAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
              {itemAvailable ? 'Available' : 'Unavailable'}
            </span>
            <div className="flex space-x-2">
              <button 
                className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                onClick={() => handleEditMenuItem(item)}
              >
                <Edit size={16} />
              </button>
              <button 
                className="p-1 text-red-500 hover:bg-red-50 rounded"
                onClick={() => handleDeleteMenuItem(itemId)}
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Item component
  const OrderItem = ({ order }) => {
    if (!order) return null;
    
    // Ensure all properties have proper defaults and type conversions
    const id = String(order.id || '');
    const status = String(order.status || '');
    const customer = String(order.customer || '');
    const time = String(order.time || '');
    const amount = String(order.amount || '');
    const items = Array.isArray(order.items) ? order.items : [];
    const isPaid = Boolean(order.is_paid || order.isPaid);
    
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{id}</span>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(status)}`}>
              {status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${isPaid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
        </div>
        <p className="text-sm">{customer}</p>
        <div className="my-2">
          {items.map((item, index) => (
            <span key={index} className="text-sm text-gray-600 block">• {String(item || '')}</span>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span>{time}</span>
          <span className="font-bold">{amount}</span>
        </div>
        <div className="flex flex-wrap justify-end space-x-2 mt-3">
          {/* Order preparation status buttons */}
          {status === 'Pending' && (
            <button 
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm my-1"
              onClick={() => handleUpdateOrderStatus(id, 'Preparing')}
            >
              Start Preparing
            </button>
          )}
          {status === 'Preparing' && (
            <button 
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm my-1"
              onClick={() => handleUpdateOrderStatus(id, 'Ready')}
            >
              Mark as Ready
            </button>
          )}
          {status === 'Ready' && (
            <button 
              className="bg-green-500 text-white px-3 py-1 rounded text-sm my-1"
              onClick={() => handleUpdateOrderStatus(id, 'Delivered')}
            >
              Complete Order
            </button>
          )}
          
          {/* Payment status buttons */}
          {!isPaid && (
            <button 
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm my-1"
              onClick={() => handleUpdatePaymentStatus(id, true)}
            >
              Mark as Paid
            </button>
          )}
          {isPaid && (
            <button 
              className="bg-red-400 text-white px-3 py-1 rounded text-sm my-1"
              onClick={() => handleUpdatePaymentStatus(id, false)}
            >
              Mark as Unpaid
            </button>
          )}
          
          <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm my-1">
            Details
          </button>
        </div>
      </div>
    );
  };

  // Analytics summary component
  const AnalyticsSummary = () => {
    // Ensure we have valid data with proper defaults
    const totalOrders = cafeteriaStats.totalOrders || 0;
    const completedOrders = cafeteriaStats.completedOrders || 0;
    const pendingOrders = cafeteriaStats.pendingOrders || 0;
    const todayRevenue = cafeteriaStats.todayRevenue || '₵0';
    const popularItems = Array.isArray(cafeteriaStats.popularItems) ? cafeteriaStats.popularItems : [];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Orders</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-sm text-gray-500">Total Orders Today</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-green-500 font-semibold">{completedOrders}</p>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-orange-500 font-semibold">{pendingOrders}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-2xl font-bold">{todayRevenue}</p>
          <p className="text-sm text-gray-500">Total Revenue Today</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Popular Items</h3>
          {popularItems.length > 0 ? (
            <ul className="text-sm">
              {popularItems.map((item, index) => (
                <li key={index} className="py-1 flex items-center">
                  <span className="inline-block w-4 h-4 bg-red-900 rounded-full mr-2"></span>
                  {String(item || '')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>
    );
  };

  // Settings component
  const CafeteriaSettings = () => {
    const [settings, setSettings] = useState({
      name: 'Akornor Restaurant',
      description: 'Serving authentic Ghanaian cuisine with a modern twist. Our specialty is Waakye and Jollof.',
      openingTime: '07:30',
      closingTime: '21:00',
      phone: '+233 50 123 4567',
      email: 'akornor@asheiseats.com'
    });
    
    const handleSettingsChange = (e) => {
      const { name, value } = e.target;
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    const handleSubmitSettings = async (e) => {
      e.preventDefault();
      try {
        await CafeteriaService.updateRestaurantSettings(activeRestaurantId, settings);
        alert('Settings updated successfully!');
      } catch (error) {
        console.error('Error updating settings:', error);
        alert('Failed to update settings. Please try again.');
      }
    };
    
    return (
      <form onSubmit={handleSubmitSettings} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Cafeteria Settings</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Cafeteria Name</label>
        <input 
          type="text" 
            name="name"
          className="w-full p-2 border rounded-lg" 
            value={settings.name}
            onChange={handleSettingsChange}
            required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea 
            name="description"
          className="w-full p-2 border rounded-lg" 
          rows="3"
            value={settings.description}
            onChange={handleSettingsChange}
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Operating Hours</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Opening Time</label>
              <input 
                type="time" 
                name="openingTime"
                className="w-full p-2 border rounded-lg" 
                value={settings.openingTime}
                onChange={handleSettingsChange}
              />
          </div>
          <div>
            <label className="text-sm text-gray-600">Closing Time</label>
              <input 
                type="time" 
                name="closingTime"
                className="w-full p-2 border rounded-lg" 
                value={settings.closingTime}
                onChange={handleSettingsChange}
              />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Contact Information</label>
        <input 
          type="tel" 
            name="phone"
          className="w-full p-2 border rounded-lg mb-2" 
          placeholder="Phone Number"
            value={settings.phone}
            onChange={handleSettingsChange}
        />
        <input 
          type="email" 
            name="email"
          className="w-full p-2 border rounded-lg" 
          placeholder="Email"
            value={settings.email}
            onChange={handleSettingsChange}
        />
      </div>
      
      <div className="flex justify-end">
          <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">
          Cancel
        </button>
          <button type="submit" className="bg-red-900 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-lg">Loading cafeteria management data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            className="mt-4 bg-red-900 text-white px-4 py-2 rounded"
            onClick={loadData}
          >
            Try Again
        </button>
      </div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Cafeteria Management</h1>
          
          <div className="flex bg-white rounded-full px-4 py-2 items-center shadow w-full md:w-64">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search menu, orders..."
              className="ml-2 outline-none flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto mb-6 bg-white rounded-lg shadow p-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center px-4 py-2 rounded-lg mr-2 ${
                activeTab === tab.name 
                  ? 'bg-red-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon}
              <span className="ml-2">{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* Menu Tab */}
          {activeTab === 'Menu' && (
            <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Menu Management</h2>
              {showAddMenuItemForm ? null : (
                <button 
                  className="bg-red-900 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => setShowAddMenuItemForm(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Menu Item
                </button>
              )}
            </div>
            
            {showAddMenuItemForm && <MenuItemForm />}
            
            {filteredMenuItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 mb-4">No menu items found.</p>
                {!showAddMenuItemForm && (
                  <button 
                    className="bg-red-900 text-white px-4 py-2 rounded"
                    onClick={() => setShowAddMenuItemForm(true)}
                  >
                    Add Your First Menu Item
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </div>
            )}
            </div>
          )}
          
        {/* Orders Tab */}
          {activeTab === 'Orders' && (
            <div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Order Management</h2>
                </div>
            
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No orders found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            )}
            </div>
          )}
          
        {/* Analytics Tab */}
          {activeTab === 'Analytics' && (
            <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Analytics & Insights</h2>
            </div>
            
              <AnalyticsSummary />
            </div>
          )}
          
        {/* Settings Tab */}
          {activeTab === 'Settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Cafeteria Settings</h2>
            </div>
            
            <CafeteriaSettings />
          </div>
          )}
      </div>
    </div>
  );
};

export default CafeteriaManagement; 