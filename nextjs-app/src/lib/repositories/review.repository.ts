import { BaseRepository } from './base.repository';

interface Review {
  id?: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  helpful_count?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class ReviewRepository extends BaseRepository<Review> {
  constructor() {
    super('reviews');
  }

  async findByProductId(productId: string): Promise<Review[]> {
    return this.findAll(
      { product_id: productId },
      { sort: { created_at: -1 } }
    );
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Review | null> {
    return this.findOne({ user_id: userId, product_id: productId });
  }

  async getAverageRating(productId: string): Promise<number> {
    const db = await (await import('@/lib/db')).getDatabase();
    const result = await db
      .collection(this.collectionName)
      .aggregate([
        { $match: { product_id: productId } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ])
      .toArray();

    return result[0]?.avg || 0;
  }
}
