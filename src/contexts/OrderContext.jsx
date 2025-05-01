import React, { createContext, useContext, useState, useCallback } from 'react';
import { OrderFactory } from '../features/orders/OrderFactory';
import { OrderRepository } from '../features/orders/OrderRepository';
import { OrderCommandInvoker } from '../features/orders/OrderCommands';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const repository = new OrderRepository();
  const commandInvoker = new OrderCommandInvoker();

  const createOrder = useCallback(async (type, data) => {
    const order = OrderFactory.createOrder(type, data);
    const createCommand = new CreateOrderCommand(order, repository);
    const result = await commandInvoker.executeCommand(createCommand);
    setCurrentOrder(result);
    setOrders(prev => [...prev, result]);
    return result;
  }, []);

  const addItemToOrder = useCallback(async (item) => {
    if (!currentOrder) return;
    const addItemCommand = new AddItemToOrderCommand(currentOrder, repository, item);
    const result = await commandInvoker.executeCommand(addItemCommand);
    setCurrentOrder(result);
    return result;
  }, [currentOrder]);

  const removeItemFromOrder = useCallback(async (itemId) => {
    if (!currentOrder) return;
    const removeItemCommand = new RemoveItemFromOrderCommand(currentOrder, repository, itemId);
    const result = await commandInvoker.executeCommand(removeItemCommand);
    setCurrentOrder(result);
    return result;
  }, [currentOrder]);

  const updateOrderStatus = useCallback(async (status) => {
    if (!currentOrder) return;
    const updateStatusCommand = new UpdateOrderStatusCommand(currentOrder, repository, status);
    const result = await commandInvoker.executeCommand(updateStatusCommand);
    setCurrentOrder(result);
    return result;
  }, [currentOrder]);

  const getStudentOrders = useCallback(async (studentId) => {
    const studentOrders = await repository.findByStudentId(studentId);
    setOrders(studentOrders);
    return studentOrders;
  }, []);

  const value = {
    currentOrder,
    orders,
    createOrder,
    addItemToOrder,
    removeItemFromOrder,
    updateOrderStatus,
    getStudentOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 