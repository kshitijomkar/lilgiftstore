// @ts-ignore - screen and fireEvent are exported from @testing-library/react
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '@/components/ProductCard';

describe('ProductCard Component', () => {
  const mockProduct: any = {
    _id: '123',
    name: 'Test Gift',
    price: 29.99,
    originalPrice: 39.99,
    category: 'gifts',
    image: 'https://example.com/gift.jpg',
    rating: 4.5,
    reviews: 10,
    inStock: true,
    tags: ['popular', 'bestseller'],
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Gift')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Gift')).toBeInTheDocument();
  });

  it('displays discount badge when originalPrice exists', () => {
    render(<ProductCard product={mockProduct} />);
    
    const discountPercentage = Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100);
    expect(screen.getByText(new RegExp(`${discountPercentage}%`))).toBeInTheDocument();
  });

  it('shows product rating and review count', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
    expect(screen.getByText(/10 reviews/i)).toBeInTheDocument();
  });

  it('applies out-of-stock styling when inStock is false', () => {
    const outOfStockProduct: any = { ...mockProduct, inStock: false };
    render(<ProductCard product={outOfStockProduct} />);
    
    const card = screen.getByRole('link');
    expect(card).toHaveClass('opacity-50');
  });

  it('renders wishlist button', () => {
    render(<ProductCard product={mockProduct} />);
    
    const wishlistButton = screen.getByRole('button', { name: /wishlist|heart/i });
    expect(wishlistButton).toBeInTheDocument();
  });

  it('displays "View Details" link', () => {
    render(<ProductCard product={mockProduct} />);
    
    const viewLink = screen.getByRole('link', { name: /view|details/i });
    expect(viewLink).toBeInTheDocument();
  });
});
