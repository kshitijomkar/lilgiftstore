'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistButton({ productId, className = '', size = 'default' }: any) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, [productId]);

  const checkWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInWishlist(data.items?.some((item: any) => item.product_id === productId) || false);
    } catch (error) {
      console.error('Failed to check wishlist:', error);
    }
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to use wishlist');
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`/api/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        });
      }
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={`${
        inWishlist ? 'bg-[#b96a82] hover:bg-[#a05670] shadow-lg' : 'bg-white/90 backdrop-blur-sm border-[#b96a82] text-[#b96a82] hover:bg-[#fce6ec] shadow-md'
      } rounded-full transition-all hover:scale-110 ${className}`}
    >
      <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
    </Button>
  );
}
