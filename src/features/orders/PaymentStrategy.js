// Payment Strategy Interface
export class PaymentStrategy {
  processPayment(amount) {
    throw new Error('Method processPayment() must be implemented');
  }
}

// Concrete Payment Strategies
export class MobileMoneyPayment extends PaymentStrategy {
  processPayment(amount) {
    // Implement mobile money payment logic
    return {
      success: true,
      method: 'mobile_money',
      amount,
      transactionId: `MM_${Date.now()}`
    };
  }
}

export class CardPayment extends PaymentStrategy {
  processPayment(amount) {
    // Implement card payment logic
    return {
      success: true,
      method: 'card',
      amount,
      transactionId: `CARD_${Date.now()}`
    };
  }
}

export class CashPayment extends PaymentStrategy {
  processPayment(amount) {
    // Implement cash payment logic
    return {
      success: true,
      method: 'cash',
      amount,
      transactionId: `CASH_${Date.now()}`
    };
  }
}

// Payment Context
export class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  processPayment(amount) {
    return this.strategy.processPayment(amount);
  }
} 