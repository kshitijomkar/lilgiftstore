import { ProductRepository } from '@/lib/repositories/product.repository';
import { APIError } from '@/lib/middleware/error-handler';

export class ProductService {
  private productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async getProduct(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new APIError('Product not found', 404);
    }
    return product;
  }

  async updateProduct(id: string, data: any, userRole: string) {
    if (userRole !== 'admin') {
      throw new APIError('Admin access required', 403);
    }

    const updated = await this.productRepo.update(id, {
      ...data,
      updated_at: new Date(),
    });

    if (!updated) {
      throw new APIError('Product not found', 404);
    }

    return updated;
  }

  async deleteProduct(id: string, userRole: string) {
    if (userRole !== 'admin') {
      throw new APIError('Admin access required', 403);
    }

    const deleted = await this.productRepo.delete(id);
    if (!deleted) {
      throw new APIError('Product not found', 404);
    }

    return true;
  }

  async listProducts(filters: any = {}) {
    return this.productRepo.findAll(filters);
  }

  async searchProducts(query: string) {
    return this.productRepo.search(query);
  }
}
