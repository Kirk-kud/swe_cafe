import { ChevronLeft, ChevronRight, Clipboard, DollarSign, Search, Truck, User, Users } from "lucide-react";
import { useState } from 'react';

const AshesiEatsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Sample data for the charts
  const orderData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [28, 35, 42, 30, 45, 35, 22],
        borderColor: '#7b1113',
        backgroundColor: 'rgba(123, 17, 19, 0.1)',
      },
      {
        label: 'Revenue (₵)',
        data: [580, 720, 850, 600, 880, 650, 300],
        borderColor: '#ffc845',
        backgroundColor: 'rgba(255, 200, 69, 0.1)',
      }
    ]
  };

  const restaurantData = {
    labels: ['Big Ben', 'Akornor', 'Italian Spot'],
    values: [42, 35, 28],
    colors: ['#FF5722', '#4CAF50', '#2196F3']
  };

  // Recent orders data
  const recentOrders = [
    { id: '#AE-237', student: 'John Mensah', restaurant: 'Big Ben', amount: '₵35.00', status: 'Delivered', color: 'big-ben' },
    { id: '#AE-236', student: 'Ama Kuffour', restaurant: 'Akornor', amount: '₵24.50', status: 'In Progress', color: 'akornor' },
    { id: '#AE-235', student: 'Michael Darko', restaurant: 'Hallmark', amount: '₵47.25', status: 'Cancelled', color: 'italian-spot' },
    { id: '#AE-234', student: 'Sophia Osei', restaurant: 'Big Ben', amount: '₵18.00', status: 'Delivered', color: 'big-ben' },
    { id: '#AE-233', student: 'Daniel Asare', restaurant: 'Akornor', amount: '₵31.75', status: 'In Progress', color: 'akornor' },
  ];

  // Restaurant performance data
  const restaurantPerformance = [
    { name: 'Big Ben', orders: 42, revenue: '₵1,830', rating: '4.8/5', color: 'big-ben' },
    { name: 'Akornor', orders: 35, revenue: '₵1,650', rating: '4.6/5', color: 'akornor' },
    { name: 'Hallmark', orders: 28, revenue: '₵1,100', rating: '4.7/5', color: 'italian-spot' },
  ];

  // Navigation menu items
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Orders', icon: '📋' },
    { name: 'Restaurants', icon: '🍽️' },
    { name: 'Delivery', icon: '🚚' },
    { name: 'Students', icon: '👥' },
    { name: 'Payments', icon: '💰' },
    { name: 'Settings', icon: '⚙️' },
  ];

  // Function to get status styling
  const getStatusStyle = (status) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-600';
    if (status === 'In Progress') return 'bg-yellow-100 text-yellow-600';
    if (status === 'Cancelled') return 'bg-red-100 text-red-600';
    return '';
  };

  // Function to get restaurant color
  const getRestaurantBorder = (type) => {
    if (type === 'big-ben') return 'border-l-4 border-orange-500';
    if (type === 'akornor') return 'border-l-4 border-green-500';
    if (type === 'italian-spot') return 'border-l-4 border-blue-500';
    return '';
  };

  // Render line chart (simplified representation)
  const LineChart = ({ data }) => (
    <div className="chart-container relative h-64 w-full">
      <div className="relative h-full bg-white rounded-lg">
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {data.labels.map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-2 bg-red-800 rounded-t" 
                style={{ 
                  height: `${data.datasets[0].data[index] * 100 / 50}%`,
                  backgroundColor: data.datasets[0].borderColor
                }}
              ></div>
              <span className="text-xs mt-1">{label}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-0 p-4 flex space-x-4">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: dataset.borderColor }}
              ></div>
              <span className="text-xs">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render bar chart (simplified representation)
  const BarChart = ({ data }) => (
    <div className="chart-container relative h-64 w-full">
      <div className="relative h-full bg-white rounded-lg">
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
          {data.labels.map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-16 rounded-t" 
                style={{ 
                  height: `${data.values[index] * 100 / 50}%`,
                  backgroundColor: data.colors[index]
                }}
              ></div>
              <span className="text-xs mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-red-900 text-white w-64 flex-shrink-0">
        <div className="p-5 border-b border-red-800">
          <h2 className="text-xl font-bold">Ashesi <span className="text-yellow-400">Eats</span></h2>
        </div>
        
        <div className="py-4">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.name}
                className={`flex items-center px-5 py-3 cursor-pointer hover:bg-red-800 ${activeTab === item.name ? 'bg-red-800' : ''}`}
                onClick={() => setActiveTab(item.name)}
              >
                <span className="mr-3">{item.icon}</span> {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap md:flex-nowrap">
          <h1 className="text-2xl font-bold">Ashesi Eats Dashboard</h1>
          
          <div className="flex bg-white rounded-full px-4 py-2 items-center shadow w-full md:w-64 mt-4 md:mt-0">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="ml-2 outline-none flex-1"
            />
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
              <User size={20} />
            </div>
            <span>Admin User</span>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">237</h3>
                <p className="text-xs mt-1">
                  <span className="text-green-500">▲ 15%</span> vs last week
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clipboard size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">₵4,580</h3>
                <p className="text-xs mt-1">
                  <span className="text-green-500">▲ 8.2%</span> vs last week
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Active Students</p>
                <h3 className="text-2xl font-bold mt-1">156</h3>
                <p className="text-xs mt-1">
                  <span className="text-green-500">▲ 12%</span> vs last week
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Delivery Time</p>
                <h3 className="text-2xl font-bold mt-1">18 min</h3>
                <p className="text-xs mt-1">
                  <span className="text-red-500">▼ 2 min</span> vs last week
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Truck size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart - Orders Overview */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Orders Overview</h3>
          </div>
          <LineChart data={orderData} />
        </div>
        
        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Recent Orders</h3>
              <span className="text-red-900 cursor-pointer text-sm">View All</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Student</th>
                    <th className="text-left p-3">Restaurant</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className={`border-b ${getRestaurantBorder(order.color)}`}>
                      <td className="p-3">{order.id}</td>
                      <td className="p-3">{order.student}</td>
                      <td className="p-3">{order.restaurant}</td>
                      <td className="p-3">{order.amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mt-4">
              <div className="flex space-x-2">
                <button className="w-8 h-8 flex items-center justify-center border rounded"><ChevronLeft size={16} /></button>
                <button className="w-8 h-8 flex items-center justify-center border rounded bg-red-900 text-white">1</button>
                <button className="w-8 h-8 flex items-center justify-center border rounded">2</button>
                <button className="w-8 h-8 flex items-center justify-center border rounded">3</button>
                <button className="w-8 h-8 flex items-center justify-center border rounded"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
          
          {/* Restaurant Performance Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Restaurant Performance</h3>
              <span className="text-red-900 cursor-pointer text-sm">View All</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3">Restaurant</th>
                    <th className="text-left p-3">Orders Today</th>
                    <th className="text-left p-3">Revenue</th>
                    <th className="text-left p-3">Rating</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurantPerformance.map((restaurant) => (
                    <tr key={restaurant.name} className={`border-b ${getRestaurantBorder(restaurant.color)}`}>
                      <td className="p-3">{restaurant.name}</td>
                      <td className="p-3">{restaurant.orders}</td>
                      <td className="p-3">{restaurant.revenue}</td>
                      <td className="p-3">{restaurant.rating}</td>
                      <td className="p-3">
                        <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Restaurant Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Restaurant Order Distribution</h3>
          </div>
          <BarChart data={restaurantData} />
        </div>
      </div>
    </div>
  );
}

export default AshesiEatsDashboard;