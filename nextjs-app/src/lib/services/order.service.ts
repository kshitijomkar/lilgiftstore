import { OrderRepository } from '@/lib/repositories/order.repository';
import { APIError } from '@/lib/middleware/error-handler';

export class OrderService {
  private orderRepo: OrderRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
  }

  async getOrderById(orderId: string, userId: string, userRole: string) {
    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new APIError('Order not found', 404);
    }

    if (userRole !== 'admin' && order.user_id !== userId) {
      throw new APIError('Unauthorized', 403);
    }

    return order;
  }

  async updateOrder(
    orderId: string,
    data: Record<string, any>,
    userId: string,
    userRole: string
  ) {
    const order = await this.getOrderById(orderId, userId, userRole);

    if (data.status) {
      this.validateStatusTransition(order.status, data.status);
    }

    if (userRole !== 'admin') {
      const allowedFields = ['shipping_address', 'notes'];
      const updatedFields = Object.keys(data);
      const unauthorizedFields = updatedFields.filter(f => !allowedFields.includes(f));

      if (unauthorizedFields.length > 0) {
        throw new APIError(
          `Unauthorized to update fields: ${unauthorizedFields.join(', ')}`,
          403
        );
      }
    }

    const updatedOrder = await this.orderRepo.update(orderId, {
      ...data,
      updated_at: new Date(),
    });

    return updatedOrder;
  }

  async cancelOrder(orderId: string, userId: string, userRole: string) {
    const order = await this.getOrderById(orderId, userId, userRole);

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new APIError('Cannot cancel order in current status', 400);
    }

    return this.orderRepo.update(orderId, {
      status: 'cancelled',
      cancelled_at: new Date(),
    } as any);
  }

  private validateStatusTransition(currentStatus: string, newStatus: string) {
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['returned'],
      cancelled: [],
      returned: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new APIError(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
        400
      );
    }
  }
}
