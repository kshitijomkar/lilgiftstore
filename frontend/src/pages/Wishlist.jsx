import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';

export default function Wishlist() {
  const { wishlist, loading, wishlistCount } = useWishlist();

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
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fce6ec] rounded-full mb-4">
            <Heart className="w-8 h-8 text-[#b96a82] fill-current" />
          </div>
          <h1 className="text-4xl font-bold text-[#4b2e2b] mb-2">My Wishlist</h1>
          <p className="text-lg text-[#4b2e2b]/70">
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
            <Link to="/shop">
              <Button className="bg-[#b96a82] hover:bg-[#a05670] text-white px-8 py-6 rounded-full text-lg">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="wishlist-grid">
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
