'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.items || []);
        setWishlistCount((data.items || []).length);
      } else {
        setWishlist([]);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="My Wishlist - The Lil Gift Corner"
        description="Your saved favorite gifts and products"
        type="website"
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fce6ec] rounded-full mb-4">
            <Heart className="w-8 h-8 text-[#b96a82] fill-current" />
          </div>
          <h1 className="text-4xl font-bold text-[#4b2e2b] mb-2">My Wishlist</h1>
          <p className="text-lg text-muted">
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-[#f7c7d3]/30">
            <Heart className="w-20 h-20 mx-auto text-[#4b2e2b]/20 mb-6" />
            <h2 className="text-2xl font-semibold text-[#4b2e2b] mb-4">Your wishlist is empty</h2>
            <p className="text-[#4b2e2b]/60 mb-8">
              Start adding products you love to your wishlist!
            </p>
            <Link href="/shop">
              <Button className="bg-[#b96a82] hover:bg-[#a05670] text-white px-8 py-6 rounded-full text-lg">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
