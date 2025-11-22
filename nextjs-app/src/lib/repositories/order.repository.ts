import { BaseRepository } from './base.repository';
import { getDatabase } from '@/lib/db';

interface Order {
  id?: string;
  user_id: string;
  items: any[];
  total_amount: number;
  status: string;
  payment_status?: 'pending' | 'completed' | 'failed' | 'expired';
  stripe_session_id?: string;
  payment_intent_id?: string;
  paid_at?: Date;
  payment_error?: string;
  shipping_address?: any;
  created_at?: Date;
  updated_at?: Date;
  cancelled_at?: Date;
}

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('orders');
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.findAll(
      { user_id: userId },
      { sort: { created_at: -1 } }
    );
  }

  async getTotalRevenue(): Promise<number> {
    const db = await getDatabase();
    const result = await db
      .collection(this.collectionName)
      .aggregate([
        { $match: { payment_status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ])
      .toArray();

    return result[0]?.total || 0;
  }

  async getCountByStatus(status: string): Promise<number> {
    return this.count({ status });
  }

  async findByPaymentIntent(intentId: string): Promise<Order | null> {
    return this.findOne({ payment_intent_id: intentId });
  }
}
