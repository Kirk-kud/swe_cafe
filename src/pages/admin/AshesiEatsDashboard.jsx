import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clipboard, DollarSign, Search, Truck, User, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderTracker from "../../components/OrderTracker.jsx";

// Observer pattern implementation
class OrderSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}

const orderSubject = new OrderSubject();

// API Service
const OrderService = {
  async getAll() {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  async create(newOrder) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) throw new Error('Failed to create order');
      const createdOrder = await response.json();
      orderSubject.notify({ type: 'CREATE', data: createdOrder });
      return createdOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async update(id, updatedOrder) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });
      if (!response.ok) throw new Error('Failed to update order');
      const order = await response.json();
      orderSubject.notify({ type: 'UPDATE', data: order });
      return order;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete order');
      const order = await response.json();
      orderSubject.notify({ type: 'DELETE', data: order });
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let variant = "default";
  if (status === 'Delivered') variant = "success";
  if (status === 'In Progress') variant = "secondary";
  if (status === 'Cancelled') variant = "destructive";

  return (
    <Badge variant={variant} className={cn(
      "px-2 py-1 rounded-full text-xs",
      variant === "success" && "bg-green-100 text-green-600",
      variant === "secondary" && "bg-yellow-100 text-yellow-600",
      variant === "destructive" && "bg-red-100 text-red-600",
      variant === "default" && "bg-gray-100 text-gray-600"
    )}>
      {status}
    </Badge>
  );
};

// Order Form Component
const OrderForm = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(order || {
    student: '',
    restaurant: 'Big Ben',
    amount: 0,
    status: 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Student</label>
        <Input
          name="student"
          value={formData.student}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Restaurant</label>
        <select
          name="restaurant"
          value={formData.restaurant}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Big Ben">Big Ben</option>
          <option value="Akornor">Akornor</option>
          <option value="Hallmark">Hallmark</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount (₵)</label>
        <Input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {order ? 'Update' : 'Create'} Order
        </Button>
      </div>
    </form>
  );
};

// Recent Orders Table Component
const RecentOrdersTable = ({ orders, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editOrder, setEditOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const ordersPerPage = 5;

  const getRestaurantBorder = (restaurant) => {
    const name = restaurant?.name || '';
    // Use the first letter of restaurant name to determine a consistent color
    const firstChar = name.charAt(0).toLowerCase();
    
    if (firstChar >= 'a' && firstChar <= 'h') return 'border-l-4 border-blue-500';
    if (firstChar >= 'i' && firstChar <= 'p') return 'border-l-4 border-green-500';
    if (firstChar >= 'q' && firstChar <= 'z') return 'border-l-4 border-orange-500';
    
    return 'border-l-4 border-gray-500';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await OrderService.delete(id);
      onRefresh();
    }
  };

  const handleSubmit = async (orderData) => {
    try {
      if (editOrder) {
        await OrderService.update(editOrder.id, orderData);
      } else {
        await OrderService.create(orderData);
      }
      setIsDialogOpen(false);
      setEditOrder(null);
      onRefresh();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setEditOrder(null)}>
                  <Plus size={16} className="mr-1" /> Add Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editOrder ? 'Edit Order' : 'Create New Order'}</DialogTitle>
                </DialogHeader>
                <OrderForm
                  order={editOrder}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setIsDialogOpen(false);
                    setEditOrder(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="overflow-x-auto">
          {currentOrders.length === 0 ? (
            <div className="bg-white p-6 rounded-lg text-center">
              <p className="text-gray-500 mb-2">No orders found.</p>
              <p className="text-sm text-gray-400">New orders will appear here when customers place them.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-left p-3">Order ID</TableHead>
                  <TableHead className="text-left p-3">Student</TableHead>
                  <TableHead className="text-left p-3">Restaurant</TableHead>
                  <TableHead className="text-left p-3">Amount</TableHead>
                  <TableHead className="text-left p-3">Status</TableHead>
                  <TableHead className="text-left p-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order, index) => (
                  <TableRow key={`order-${order.id || index}`} className={getRestaurantBorder(order.restaurant)}>
                    <TableCell className="p-3">{order.id}</TableCell>
                    <TableCell className="p-3">{order.student}</TableCell>
                    <TableCell className="p-3">{order.restaurant}</TableCell>
                    <TableCell className="p-3">₵{order.amount ? order.amount.toFixed(2) : '0.00'}</TableCell>
                    <TableCell className="p-3">
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditOrder(order);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <div className="flex space-x-2">
            <Button
              key="prev-button"
              variant="outline"
              size="icon"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            {pageNumbers.map(number => (
              <Button
                key={`page-${number}`}
                variant={number === currentPage ? "default" : "outline"}
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              key="next-button"
              variant="outline"
              size="icon"
              onClick={() => paginate(Math.min(pageNumbers.length, currentPage + 1))}
              disabled={currentPage === pageNumbers.length}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// Stats Cards Component
const StatsCards = ({ totalOrders, totalRevenue, activeStudents, deliveryTime }) => {
  // Ensure totalRevenue is a number
  const revenue = typeof totalRevenue === 'number' ? totalRevenue : parseFloat(totalRevenue || 0);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Clipboard size={24} className="text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">▲ 15%</span> vs last week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign size={24} className="text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₵{revenue.toFixed(2)}</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">▲ 8.2%</span> vs last week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          <Users size={24} className="text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeStudents}</div>
          <p className="text-xs text-gray-500">
            <span className="text-green-500">▲ 12%</span> vs last week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivery Time</CardTitle>
          <Truck size={24} className="text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveryTime} min</div>
          <p className="text-xs text-gray-500">
            <span className="text-red-500">▼ 2 min</span> vs last week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Orders Overview Chart Component
const OrdersOverviewChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Orders Overview</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="order_date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Restaurant Performance Table Component
const RestaurantPerformanceTable = ({ restaurants }) => {
  const getRestaurantBorder = (restaurant) => {
    const name = restaurant?.name || '';
    // Use the first letter of restaurant name to determine a consistent color
    const firstChar = name.charAt(0).toLowerCase();
    
    if (firstChar >= 'a' && firstChar <= 'h') return 'border-l-4 border-blue-500';
    if (firstChar >= 'i' && firstChar <= 'p') return 'border-l-4 border-green-500';
    if (firstChar >= 'q' && firstChar <= 'z') return 'border-l-4 border-orange-500';
    
    return 'border-l-4 border-gray-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Restaurant Performance</h3>
        <span className="text-red-900 cursor-pointer text-sm">View All</span>
      </div>

      <div className="overflow-x-auto">
        {restaurants.length === 0 ? (
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-gray-500 mb-2">No restaurant data available.</p>
            <p className="text-sm text-gray-400">Restaurant information will appear here when data is available.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left p-3">Restaurant</TableHead>
                <TableHead className="text-left p-3">Orders Today</TableHead>
                <TableHead className="text-left p-3">Revenue</TableHead>
                <TableHead className="text-left p-3">Rating</TableHead>
                <TableHead className="text-left p-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => {
                // Ensure revenue is a number
                const revenue = typeof restaurant.revenue === 'number' ? 
                  restaurant.revenue : parseFloat(restaurant.revenue || 0);
                
                return (
                  <TableRow key={restaurant.id} className={getRestaurantBorder(restaurant)}>
                    <TableCell className="p-3">{restaurant.name || 'Unnamed'}</TableCell>
                    <TableCell className="p-3">{restaurant.orders || 0}</TableCell>
                    <TableCell className="p-3">₵{revenue.toFixed(2)}</TableCell>
                    <TableCell className="p-3">{restaurant.rating || 0}/5</TableCell>
                    <TableCell className="p-3">
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

// Restaurant Order Distribution Chart Component
const RestaurantOrderDistributionChart = ({ data }) => {
  // Generate colors dynamically based on restaurant name
  const getRestaurantColor = (name) => {
    // Use a basic hash function to generate a number from the name
    const hash = Array.from(name || '').reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
    );
    
    // Use a set of predefined colors for consistency
    const colors = ['#4CAF50', '#2196F3', '#FF5722', '#9C27B0', '#FFC107', '#03A9F4'];
    const index = Math.abs(hash) % colors.length;
    
    return colors[index];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Restaurant Order Distribution</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRestaurantColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Menu Component
const Menu = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Orders', icon: '📋' },
    { name: 'Restaurants', icon: '🍽️' },
    { name: 'Delivery', icon: '🚚' },
    { name: 'Students', icon: '👥' },
    { name: 'Payments', icon: '💰' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
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
  );
};

// Header Component
const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex justify-between items-center mb-8 flex-wrap md:flex-nowrap">
      <h1 className="text-2xl font-bold">Ashesi Eats Dashboard</h1>

      <div className="flex bg-white rounded-full px-4 py-2 items-center shadow w-full md:w-64 mt-4 md:mt-0">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search orders..."
          className="ml-2 outline-none flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center mt-4 md:mt-0">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
          <User size={20} />
        </div>
        <span>Admin User</span>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AshesiEatsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeStudents: 0,
    deliveryTime: 0
  });
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform order data into chart data
  const generateOrdersChartData = (orders) => {
    if (!orders || orders.length === 0) return [];
    
    // Group orders by date
    const ordersByDate = orders.reduce((acc, order) => {
      // Extract date from order timestamp or use order date if available
      const orderDate = order.order_time 
        ? new Date(order.order_time).toLocaleDateString('en-US', { weekday: 'short' })
        : (order.date || 'Unknown');
      
      // Calculate order amount
      const amount = order.total_amount || order.amount || 0;
      
      // If this date already exists in our accumulator, update it
      if (acc[orderDate]) {
        acc[orderDate].orders += 1;
        acc[orderDate].revenue += Number(amount);
      } else {
        // Otherwise create a new entry
        acc[orderDate] = {
          order_date: orderDate,
          orders: 1,
          revenue: Number(amount)
        };
      }
      
      return acc;
    }, {});
    
    // Convert the object to an array of values
    return Object.values(ordersByDate);
  };

  useEffect(() => {
    // Initialize menu items for sidebar
    setMenuItems([
      { name: 'Dashboard', icon: '📊' },
      { name: 'Orders', icon: '📋' },
      { name: 'Restaurants', icon: '🍽️' },
      { name: 'Delivery', icon: '🚚' },
      { name: 'Students', icon: '👥' },
      { name: 'Payments', icon: '💰' },
      { name: 'Settings', icon: '⚙️' },
    ]);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Make individual requests with error handling for each
      let ordersData = [];
      let restaurantsData = [];
      let statsData = { totalOrders: 0, totalRevenue: 0, activeStudents: 0, deliveryTime: 0 };
      
      try {
        ordersData = await OrderService.getAll();
      } catch (err) {
        console.error('Error fetching orders:', err);
        ordersData = [];
      }
      
      try {
        // Fetch restaurants with their statistics
        const restaurantIds = [1, 2, 3]; // The three restaurant IDs
        const restaurants = [];
        
        for (const id of restaurantIds) {
          try {
            // Fetch restaurant details
            const restaurantRes = await fetch(`http://localhost:3000/api/restaurants/${id}`);
            if (!restaurantRes.ok) continue;
            
            const restaurantData = await restaurantRes.json();
            
            // Fetch restaurant stats (orders, revenue, rating) - handle potential 404
            try {
              const statsRes = await fetch(`http://localhost:3000/api/restaurants/${id}/stats`);
              let statsData = { orders: 0, revenue: 0, rating: 0 };
              
              if (statsRes.ok) {
                statsData = await statsRes.json();
              }
              
              // Combine restaurant data with its stats
              restaurants.push({
                ...restaurantData,
                orders: statsData.orders || 0,
                revenue: statsData.revenue || 0,
                rating: statsData.rating || 4.0
              });
            } catch (statsErr) {
              console.error(`Error fetching stats for restaurant ${id}:`, statsErr);
              // Still add the restaurant with default stats
              restaurants.push({
                ...restaurantData,
                orders: 0,
                revenue: 0,
                rating: 4.0
              });
            }
          } catch (err) {
            console.error(`Error fetching restaurant ${id}:`, err);
          }
        }
        
        restaurantsData = restaurants;
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        restaurantsData = [];
      }
      
      try {
        const statsResponse = await fetch('http://localhost:3000/api/stats');
        if (statsResponse.ok) {
          statsData = await statsResponse.json();
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Use default stats
      }
      
      setOrders(ordersData);
      setRestaurants(restaurantsData);
      setStats({
        totalOrders: statsData.totalOrders || 0,
        totalRevenue: statsData.totalRevenue || 0,
        activeStudents: statsData.activeStudents || 0,
        deliveryTime: Math.round(statsData.deliveryTime || 0)
      });
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
      // Initialize with empty arrays
      setOrders([]);
      setRestaurants([]);
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        activeStudents: 0,
        deliveryTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to order changes
    const handleOrderChange = ({ type, data }) => {
      console.log(`Order ${type}d:`, data);
      fetchData();
    };

    orderSubject.subscribe(handleOrderChange);
    return () => orderSubject.unsubscribe(handleOrderChange);
  }, []);

  // Use real data from the API - no mock data
  const prepareRestaurantData = () => {
    if (!restaurants || restaurants.length === 0) return [];
    
    // Just return the restaurants directly - they already have real data
    return restaurants;
  };

  // Prepare restaurant data for charts using real data
  const restaurantChartData = restaurants.map(restaurant => ({
    name: restaurant.name,
    orders: restaurant.orders || 0
  }));

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
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
        <div className="flex-1 p-8">
          {/* Header */}
          <Header />

          {/* Content based on active tab */}
          {activeTab === 'Dashboard' && (
            <>
              {/* Stats Cards - First row, full width */}
              <StatsCards 
                totalOrders={stats.totalOrders} 
                totalRevenue={stats.totalRevenue} 
                activeStudents={stats.activeStudents} 
                deliveryTime={stats.deliveryTime} 
              />
              
              {/* Second row: Orders Overview Chart - only show if there's data */}
              {orders.length > 0 ? (
                <OrdersOverviewChart 
                  data={generateOrdersChartData(orders)}
                />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow mb-8 text-center">
                  <p className="text-gray-500 mb-2">No order data available for chart visualization.</p>
                  <p className="text-sm text-gray-400">Charts will appear here when orders are placed.</p>
                </div>
              )}
              
              {/* Third row: Recent Orders Table - full width */}
              <div className="mb-8">
                <RecentOrdersTable 
                  orders={orders} 
                  onRefresh={fetchData} 
                />
              </div>
              
              {/* Fourth row: Restaurant Performance and Distribution - side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <RestaurantPerformanceTable restaurants={restaurants} />
                <RestaurantOrderDistributionChart data={restaurants.map(r => ({
                  name: r.name,
                  orders: r.orders || 0
                }))} />
              </div>
            </>
          )}
          
          {/* Add other tab content here */}
        </div>
      </div>
    </div>
  );
};

export default AshesiEatsDashboard;