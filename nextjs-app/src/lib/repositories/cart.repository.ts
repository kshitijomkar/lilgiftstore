import { BaseRepository } from './base.repository';

interface CartItem {
  id?: string;
  session_id?: string;
  product_id: string;
  quantity: number;
  added_at?: Date;
}

export class CartRepository extends BaseRepository<CartItem> {
  constructor() {
    super('cart');
  }

  async findBySessionId(sessionId: string): Promise<CartItem[]> {
    return this.findAll({ session_id: sessionId });
  }

  async removeBySessionId(sessionId: string): Promise<number> {
    return this.deleteMany({ session_id: sessionId });
  }
}
