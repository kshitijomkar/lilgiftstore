'use client';
import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WishlistButton from '@/components/common/WishlistButton';
import { formatINR } from '@/lib/currency';
import { toast } from 'sonner';

function ProductCard({ product }: { product: any }) {
  const [adding, setAdding] = useState(false);

  const category = product.category || 'Gift';
  const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=400';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof window === 'undefined') {
      toast.error('Not available on server');
      return;
    }
    
    setAdding(true);
    try {
      let sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = `session_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
        localStorage.setItem('session_id', sessionId);
      }
      
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          session_id: sessionId
        }),
      });
      if (res.ok) {
        toast.success('Added to cart!');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div suppressHydrationWarning className="group bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative" data-testid={`product-card-${product.id}`}>
      {/* Wishlist Button - Top Right */}
      <div className="absolute top-4 right-4 z-20 opacity-90 hover:opacity-100 transition-opacity">
        <WishlistButton productId={product.id} />
      </div>

      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          <img 
            src={image} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-[#fce6ec] text-[#b96a82] rounded-full text-xs font-medium mb-3" data-testid={`product-category-${product.id}`}>
          {category}
        </span>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-[#4b2e2b] mb-2 hover:text-[#b96a82] transition-colors" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[#4b2e2b]/70 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl font-bold text-[#b96a82]" data-testid={`product-price-${product.id}`}>{formatINR(product.price)}</span>
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={handleAddToCart}
              disabled={adding}
              aria-label={`Add ${product.name} to cart`}
              className="bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-md hover:shadow-lg transition-all min-h-10 min-w-10"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Link href={`/product/${product.id}`}>
              <Button 
                size="sm"
                variant="outline"
                aria-label={`View details for ${product.name}`}
                className="border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full shadow-md hover:shadow-lg transition-all min-h-10 min-w-10"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
