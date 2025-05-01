import { Order } from './Order';

export class OrderFactory {
  static createOrder(type, data) {
    switch (type) {
      case 'regular':
        return new RegularOrder(data);
      case 'express':
        return new ExpressOrder(data);
      case 'group':
        return new GroupOrder(data);
      default:
        throw new Error(`Invalid order type: ${type}`);
    }
  }
}

class RegularOrder extends Order {
  constructor(data) {
    super(data);
    this.type = 'regular';
    this.priority = 'normal';
  }
}

class ExpressOrder extends Order {
  constructor(data) {
    super(data);
    this.type = 'express';
    this.priority = 'high';
    this.expressFee = 5.00;
  }
}

class GroupOrder extends Order {
  constructor(data) {
    super(data);
    this.type = 'group';
    this.priority = 'normal';
    this.groupDiscount = 0.10; // 10% discount for group orders
  }
} 