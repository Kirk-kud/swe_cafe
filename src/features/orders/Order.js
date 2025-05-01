export class Order {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.items = data.items || [];
    this.studentId = data.studentId;
    this.status = 'pending';
    this.total = this.calculateTotal();
    this.observers = [];
    this.createdAt = new Date();
  }

  // Observer pattern methods
  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this));
  }

  // Status management
  updateStatus(newStatus) {
    this.status = newStatus;
    this.notifyObservers();
  }

  // Order operations
  addItem(item) {
    this.items.push(item);
    this.total = this.calculateTotal();
    this.notifyObservers();
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.total = this.calculateTotal();
    this.notifyObservers();
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get order details
  getOrderDetails() {
    return {
      id: this.id,
      items: this.items,
      studentId: this.studentId,
      status: this.status,
      total: this.total,
      createdAt: this.createdAt
    };
  }
} 