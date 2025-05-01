export class OrderCommand {
  constructor(order, repository) {
    this.order = order;
    this.repository = repository;
  }

  execute() {
    throw new Error('Method execute() must be implemented');
  }
}

export class CreateOrderCommand extends OrderCommand {
  async execute() {
    return await this.repository.create(this.order);
  }
}

export class UpdateOrderStatusCommand extends OrderCommand {
  constructor(order, repository, newStatus) {
    super(order, repository);
    this.newStatus = newStatus;
  }

  async execute() {
    this.order.updateStatus(this.newStatus);
    return await this.repository.update(this.order);
  }
}

export class AddItemToOrderCommand extends OrderCommand {
  constructor(order, repository, item) {
    super(order, repository);
    this.item = item;
  }

  async execute() {
    this.order.addItem(this.item);
    return await this.repository.update(this.order);
  }
}

export class RemoveItemFromOrderCommand extends OrderCommand {
  constructor(order, repository, itemId) {
    super(order, repository);
    this.itemId = itemId;
  }

  async execute() {
    this.order.removeItem(this.itemId);
    return await this.repository.update(this.order);
  }
}

// Command Invoker
export class OrderCommandInvoker {
  constructor() {
    this.commands = [];
  }

  async executeCommand(command) {
    const result = await command.execute();
    this.commands.push(command);
    return result;
  }

  async undo() {
    if (this.commands.length === 0) {
      throw new Error('No commands to undo');
    }
    const command = this.commands.pop();
    // Implement undo logic based on command type
    return command;
  }
} 