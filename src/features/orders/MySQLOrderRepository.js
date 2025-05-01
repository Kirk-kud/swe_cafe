import mysql from 'mysql2/promise';

export class MySQLOrderRepository {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ashesi_eats',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async create(order) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert order
      const [orderResult] = await connection.execute(
        'INSERT INTO orders (id, student_id, type, status, total, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [order.id, order.studentId, order.type, order.status, order.total, order.createdAt]
      );

      // Insert order items
      for (const item of order.items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [order.id, item.id, item.quantity, item.price]
        );
      }

      await connection.commit();
      return order;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id) {
    const [orders] = await this.pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) return null;

    const [items] = await this.pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    return {
      ...orders[0],
      items
    };
  }

  async findByStudentId(studentId) {
    const [orders] = await this.pool.execute(
      'SELECT * FROM orders WHERE student_id = ?',
      [studentId]
    );

    const result = [];
    for (const order of orders) {
      const [items] = await this.pool.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      result.push({
        ...order,
        items
      });
    }

    return result;
  }

  async update(order) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update order
      await connection.execute(
        'UPDATE orders SET status = ?, total = ? WHERE id = ?',
        [order.status, order.total, order.id]
      );

      // Delete existing items
      await connection.execute(
        'DELETE FROM order_items WHERE order_id = ?',
        [order.id]
      );

      // Insert updated items
      for (const item of order.items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [order.id, item.id, item.quantity, item.price]
        );
      }

      await connection.commit();
      return order;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(id) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete order items
      await connection.execute(
        'DELETE FROM order_items WHERE order_id = ?',
        [id]
      );

      // Delete order
      await connection.execute(
        'DELETE FROM orders WHERE id = ?',
        [id]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findAll() {
    const [orders] = await this.pool.execute('SELECT * FROM orders');

    const result = [];
    for (const order of orders) {
      const [items] = await this.pool.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      result.push({
        ...order,
        items
      });
    }

    return result;
  }

  async findByStatus(status) {
    const [orders] = await this.pool.execute(
      'SELECT * FROM orders WHERE status = ?',
      [status]
    );

    const result = [];
    for (const order of orders) {
      const [items] = await this.pool.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      result.push({
        ...order,
        items
      });
    }

    return result;
  }
} 