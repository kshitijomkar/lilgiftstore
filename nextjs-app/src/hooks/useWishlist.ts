import { useState, useEffect } from 'react';

export function useWishlist() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      const items = JSON.parse(saved);
      setWishlist(items);
      setWishlistCount(items.length);
    }
  }, []);

  const addToWishlist = (product: any) => {
    const updated = [...wishlist, product];
    setWishlist(updated);
    setWishlistCount(updated.length);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter(p => p.id !== productId);
    setWishlist(updated);
    setWishlistCount(updated.length);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  return {
    wishlist,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
