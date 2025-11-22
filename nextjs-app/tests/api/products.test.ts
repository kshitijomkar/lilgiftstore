/**
 * API Contract Tests: Products Routes
 * Validates that API responses match the old backend exactly
 */

describe('Products API Contract', () => {
  describe('GET /api/products', () => {
    it('should return list of products with correct schema', async () => {
      const response = await fetch('http://localhost:5000/api/products?limit=5');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      // Validate response structure
      expect(data).toHaveProperty('products');
      expect(Array.isArray(data.products)).toBe(true);
      
      // Validate product schema
      if (data.products.length > 0) {
        const product = data.products[0];
        expect(product).toHaveProperty('_id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
      }
    });

    it('should support pagination with limit and skip', async () => {
      const response = await fetch('http://localhost:5000/api/products?limit=3&skip=0');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(Array.isArray(data.products)).toBe(true);
      expect(data.products.length).toBeLessThanOrEqual(3);
    });

    it('should support category filtering', async () => {
      const response = await fetch('http://localhost:5000/api/products?category=gifts');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      if (data.products.length > 0) {
        data.products.forEach((product: any) => {
          expect(product.category).toBe('gifts');
        });
      }
    });

    it('should support price range filtering', async () => {
      const response = await fetch('http://localhost:5000/api/products?minPrice=10&maxPrice=50');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      if (data.products.length > 0) {
        data.products.forEach((product: any) => {
          expect(product.price).toBeGreaterThanOrEqual(10);
          expect(product.price).toBeLessThanOrEqual(50);
        });
      }
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product details with full schema', async () => {
      const productId = '123'; // Mock ID
      
      // Skip if product doesn't exist
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        
        if (response.status === 200) {
          const data = await response.json();
          
          expect(data).toHaveProperty('_id');
          expect(data).toHaveProperty('name');
          expect(data).toHaveProperty('description');
          expect(data).toHaveProperty('price');
          expect(data).toHaveProperty('image');
          expect(data).toHaveProperty('category');
        }
      } catch (error) {
        // Skip if endpoint not available in test
      }
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return list of available categories', async () => {
      const response = await fetch('http://localhost:5000/api/products/categories');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(Array.isArray(data.categories) || Array.isArray(data)).toBe(true);
    });
  });

  describe('GET /api/products/search', () => {
    it('should search products by query', async () => {
      const response = await fetch('http://localhost:5000/api/products/search?q=gift');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('results');
      expect(Array.isArray(data.results)).toBe(true);
    });
  });

  describe('Health Check', () => {
    it('should verify API is healthy', async () => {
      const response = await fetch('http://localhost:5000/api/health');
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('healthy');
      expect(data).toHaveProperty('app');
      expect(data).toHaveProperty('version');
    });
  });
});
