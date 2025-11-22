import { BaseRepository } from './base.repository';
import { getDatabase } from '@/lib/db';

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  stock: number;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products');
  }

  async search(query: string, limit: number = 20): Promise<Product[]> {
    const db = await getDatabase();
    const regex = new RegExp(query, 'i');
    return (await db
      .collection(this.collectionName)
      .find({
        $or: [
          { name: regex },
          { description: regex },
          { tags: regex },
        ],
      })
      .limit(limit)
      .toArray()) as Product[];
  }

  async getCategories(): Promise<string[]> {
    const db = await getDatabase();
    return (await db.collection(this.collectionName).distinct('category')) as string[];
  }

  async getByCategory(category: string, limit: number = 20): Promise<Product[]> {
    return this.findAll(
      { category },
      { limit, sort: { created_at: -1 } }
    );
  }

  async getSuggestions(query: string, limit: number = 10): Promise<string[]> {
    const products = await this.search(query, limit);
    return [...new Set(products.map(p => p.name))];
  }

  async filterByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.findAll({
      price: { $gte: minPrice, $lte: maxPrice },
    });
  }
}
