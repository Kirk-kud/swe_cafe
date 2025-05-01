export class OrderRepository {
  constructor() {
    this.orders = new Map();
  }

  async create(order) {
    this.orders.set(order.id, order);
    return order;
  }

  async findById(id) {
    return this.orders.get(id);
  }

  async findByStudentId(studentId) {
    return Array.from(this.orders.values())
      .filter(order => order.studentId === studentId);
  }

  async update(order) {
    if (!this.orders.has(order.id)) {
      throw new Error('Order not found');
    }
    this.orders.set(order.id, order);
    return order;
  }

  async delete(id) {
    if (!this.orders.has(id)) {
      throw new Error('Order not found');
    }
    this.orders.delete(id);
    return true;
  }

  async findAll() {
    return Array.from(this.orders.values());
  }

  async findByStatus(status) {
    return Array.from(this.orders.values())
      .filter(order => order.status === status);
  }
} 