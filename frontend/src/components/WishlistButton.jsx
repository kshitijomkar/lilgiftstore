import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';

export default function WishlistButton({ productId, className = '', size = 'default' }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInWishlist(isInWishlist(productId));
  }, [productId, isInWishlist]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    if (inWishlist) {
      const success = await removeFromWishlist(productId);
      if (success) setInWishlist(false);
    } else {
      const success = await addToWishlist(productId);
      if (success) setInWishlist(true);
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={inWishlist ? 'default' : 'outline'}
      size={size}
      className={`${inWishlist ? 'bg-[#b96a82] hover:bg-[#a05670] shadow-lg' : 'bg-white/90 backdrop-blur-sm border-[#b96a82] text-[#b96a82] hover:bg-[#fce6ec] shadow-md'} rounded-full transition-all hover:scale-110 ${className}`}
      data-testid="wishlist-btn"
    >
      <Heart
        className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`}
      />
    </Button>
  );
}
