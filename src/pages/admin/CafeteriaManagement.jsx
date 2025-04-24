import { ChevronLeft, ChevronRight, ClipboardList, DollarSign, Edit, Search, Settings, ShoppingBag, Trash, Users } from "lucide-react";
import { useState } from 'react';

const CafeteriaManagement = () => {
  const [activeTab, setActiveTab] = useState('Menu');
  
  // Sample menu data
  const menuItems = [
    { id: 1, name: 'Jollof Rice with Chicken', price: '₵25.00', category: 'Main Course', available: true, image: '/src/assets/jollof.jpg' },
    { id: 2, name: 'Waakye Special', price: '₵30.00', category: 'Main Course', available: true, image: '/src/assets/waakye.jpg' },
    { id: 3, name: 'Kelewele', price: '₵10.00', category: 'Appetizer', available: true, image: '/src/assets/kelewele.jpg' },
    { id: 4, name: 'Tilapia with Banku', price: '₵35.00', category: 'Main Course', available: false, image: '/src/assets/tilapia.jpg' },
    { id: 5, name: 'Fresh Fruit Juice', price: '₵8.00', category: 'Beverage', available: true, image: '/src/assets/juice.jpg' },
  ];

  // Sample orders data
  const orders = [
    { id: '#ORD-237', customer: 'John Mensah', items: ['Jollof Rice with Chicken', 'Fresh Fruit Juice'], amount: '₵33.00', status: 'Pending', time: '10:30 AM' },
    { id: '#ORD-236', customer: 'Ama Kuffour', items: ['Waakye Special'], amount: '₵30.00', status: 'Preparing', time: '10:15 AM' },
    { id: '#ORD-235', customer: 'Michael Darko', items: ['Tilapia with Banku', 'Kelewele'], amount: '₵45.00', status: 'Ready', time: '9:45 AM' },
    { id: '#ORD-234', customer: 'Sophia Osei', items: ['Jollof Rice with Chicken'], amount: '₵25.00', status: 'Delivered', time: '9:30 AM' },
    { id: '#ORD-233', customer: 'Daniel Asare', items: ['Waakye Special', 'Fresh Fruit Juice'], amount: '₵38.00', status: 'Delivered', time: '9:15 AM' },
  ];

  // Sample cafeteria stats
  const cafeteriaStats = {
    totalOrders: 43,
    pendingOrders: 12,
    completedOrders: 31,
    todayRevenue: '₵1,250',
    popularItems: ['Jollof Rice with Chicken', 'Waakye Special', 'Fresh Fruit Juice']
  };

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

  // Menu Item component
  const MenuItem = ({ item }) => (
    <div className="bg-white rounded-lg shadow p-4 flex">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-20 h-20 object-cover rounded-lg mr-4"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/80x80?text=Food"; 
        }}
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-bold">{item.name}</h3>
          <span className="font-bold text-red-900">{item.price}</span>
        </div>
        <p className="text-gray-500 text-sm">{item.category}</p>
        <div className="flex justify-between items-center mt-2">
          <span className={`px-2 py-1 rounded-full text-xs ${item.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            {item.available ? 'Available' : 'Unavailable'}
          </span>
          <div className="flex space-x-2">
            <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
              <Edit size={16} />
            </button>
            <button className="p-1 text-red-500 hover:bg-red-50 rounded">
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Order Item component
  const OrderItem = ({ order }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{order.id}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      </div>
      <p className="text-sm">{order.customer}</p>
      <div className="my-2">
        {order.items.map((item, index) => (
          <span key={index} className="text-sm text-gray-600 block">• {item}</span>
        ))}
      </div>
      <div className="flex justify-between text-sm">
        <span>{order.time}</span>
        <span className="font-bold">{order.amount}</span>
      </div>
      <div className="flex justify-end space-x-2 mt-3">
        {order.status === 'Pending' && (
          <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
            Start Preparing
          </button>
        )}
        {order.status === 'Preparing' && (
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
            Mark as Ready
          </button>
        )}
        {order.status === 'Ready' && (
          <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
            Complete Order
          </button>
        )}
        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
          Details
        </button>
      </div>
    </div>
  );

  // Analytics summary component
  const AnalyticsSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Orders</h3>
        <div className="flex justify-between">
          <div>
            <p className="text-2xl font-bold">{cafeteriaStats.totalOrders}</p>
            <p className="text-sm text-gray-500">Total Orders Today</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-green-500 font-semibold">{cafeteriaStats.completedOrders}</p>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-orange-500 font-semibold">{cafeteriaStats.pendingOrders}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Revenue</h3>
        <p className="text-2xl font-bold">{cafeteriaStats.todayRevenue}</p>
        <p className="text-sm text-gray-500">Total Revenue Today</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Popular Items</h3>
        <ul className="text-sm">
          {cafeteriaStats.popularItems.map((item, index) => (
            <li key={index} className="py-1 flex items-center">
              <span className="inline-block w-4 h-4 bg-red-900 rounded-full mr-2"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Settings component
  const CafeteriaSettings = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Cafeteria Settings</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Cafeteria Name</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded-lg" 
          defaultValue="Akornor Restaurant"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea 
          className="w-full p-2 border rounded-lg" 
          rows="3"
          defaultValue="Serving authentic Ghanaian cuisine with a modern twist. Our specialty is Waakye and Jollof."
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Operating Hours</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Opening Time</label>
            <input type="time" className="w-full p-2 border rounded-lg" defaultValue="07:30" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Closing Time</label>
            <input type="time" className="w-full p-2 border rounded-lg" defaultValue="21:00" />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Contact Information</label>
        <input 
          type="tel" 
          className="w-full p-2 border rounded-lg mb-2" 
          placeholder="Phone Number"
          defaultValue="+233 50 123 4567"
        />
        <input 
          type="email" 
          className="w-full p-2 border rounded-lg" 
          placeholder="Email"
          defaultValue="akornor@asheiseats.com"
        />
      </div>
      
      <div className="flex justify-end">
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">
          Cancel
        </button>
        <button className="bg-red-900 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Cafeteria Management</h1>
          
          <div className="flex bg-white rounded-full px-4 py-2 items-center shadow w-full md:w-64">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search menu, orders..."
              className="ml-2 outline-none flex-1"
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
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
        
        {/* Content based on active tab */}
        <div>
          {activeTab === 'Menu' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Menu Management</h2>
                <button className="bg-red-900 text-white px-4 py-2 rounded-lg flex items-center">
                  <span className="mr-1">+</span> Add New Item
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'Orders' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Management</h2>
                <div className="flex">
                  <button className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow mr-2">
                    Filter
                  </button>
                  <button className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow ml-1">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'Analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <AnalyticsSummary />
              
              <div className="mt-8 bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Order Statistics (Today)</h3>
                <div className="h-64 w-full bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-500">Charts will be displayed here</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'Settings' && (
            <CafeteriaSettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeteriaManagement; 