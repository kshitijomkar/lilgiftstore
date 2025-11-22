import { BaseRepository } from './base.repository';

interface WishlistItem {
  id?: string;
  user_id?: string;
  product_id: string;
  added_at?: Date;
}

export class WishlistRepository extends BaseRepository<WishlistItem> {
  constructor() {
    super('wishlist');
  }

  async findByUserId(userId: string): Promise<WishlistItem[]> {
    return this.findAll({ user_id: userId });
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<WishlistItem | null> {
    return this.findOne({ user_id: userId, product_id: productId });
  }
}
