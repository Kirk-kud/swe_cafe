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
    if (restaurant === 'Big Ben') return 'border-l-4 border-orange-500';
    if (restaurant === 'Akornor') return 'border-l-4 border-green-500';
    if (restaurant === 'Hallmark') return 'border-l-4 border-blue-500';
    return '';
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
              {currentOrders.map((order) => (
                <TableRow key={order.id} className={getRestaurantBorder(order.restaurant)}>
                  <TableCell className="p-3">{order.id}</TableCell>
                  <TableCell className="p-3">{order.student}</TableCell>
                  <TableCell className="p-3">{order.restaurant}</TableCell>
                  <TableCell className="p-3">₵{order.amount.toFixed(2)}</TableCell>
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
        </div>

        <div className="flex justify-end mt-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            {pageNumbers.map(number => (
              <Button
                key={number}
                variant={number === currentPage ? "default" : "outline"}
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
            <Button
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
          <div className="text-2xl font-bold">₵{totalRevenue.toFixed(2)}</div>
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
    if (restaurant === 'Big Ben') return 'border-l-4 border-orange-500';
    if (restaurant === 'Akornor') return 'border-l-4 border-green-500';
    if (restaurant === 'Hallmark') return 'border-l-4 border-blue-500';
    return '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Restaurant Performance</h3>
        <span className="text-red-900 cursor-pointer text-sm">View All</span>
      </div>

      <div className="overflow-x-auto">
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
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant.name} className={getRestaurantBorder(restaurant.name)}>
                <TableCell className="p-3">{restaurant.name}</TableCell>
                <TableCell className="p-3">{restaurant.orders}</TableCell>
                <TableCell className="p-3">₵{restaurant.revenue.toFixed(2)}</TableCell>
                <TableCell className="p-3">{restaurant.rating}/5</TableCell>
                <TableCell className="p-3">
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Restaurant Order Distribution Chart Component
const RestaurantOrderDistributionChart = ({ data }) => {
  const restaurantColors = {
    'Big Ben': '#FF5722',
    'Akornor': '#4CAF50',
    'Hallmark': '#2196F3',
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
              <Cell key={`cell-${index}`} fill={restaurantColors[entry.name] || '#8884d8'} />
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

  const fetchData = async () => {
    setLoading(true);
    try {
      // Parallel requests
      const [orders, restaurants, statsData] = await Promise.all([
        OrderService.getAll(),
        fetch('/api/restaurants').then(res => res.json()),
        fetch('/api/stats').then(res => res.json())
      ]);

      setOrders(orders);
      setRestaurants(restaurants);
      setStats({
        totalOrders: statsData.totalOrders || 0,
        totalRevenue: statsData.totalRevenue || 0,
        activeStudents: statsData.activeStudents || 0,
        deliveryTime: Math.round(statsData.deliveryTime || 0)
      });
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add your dashboard content here */}
            </div>
          )}
          
          {/* Add other tab content here */}
        </div>
      </div>
    </div>
  );
};

export default AshesiEatsDashboard;