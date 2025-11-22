'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CouponInput from '@/components/common/CouponInput';
import SEOHead from '@/components/SEOHead';
import { formatINR } from '@/lib/currency';
import { getSessionId } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const res = await fetch(`/api/cart?session_id=${sessionId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCartItems(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(`/api/cart/${cartItemId}`, { 
        method: 'DELETE',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Item removed from cart');
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item?.product?.price || 0;
      const quantity = item?.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    if (appliedCoupon) {
      return appliedCoupon.final_amount;
    }
    return subtotal;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Shopping Cart - The Lil Gift Corner"
        description="View and manage your shopping cart. Proceed to checkout to complete your purchase."
        type="website"
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-8" data-testid="cart-title">
          Your Shopping Cart
        </h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-cart">
            <ShoppingBag className="w-24 h-24 mx-auto text-[#f7c7d3] mb-6" />
            <p className="text-2xl text-muted mb-8">Your cart is empty</p>
            <Link href="/shop">
              <Button className="px-8 py-6 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg" data-testid="continue-shopping-btn">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                  data-testid={`cart-item-${item?.product?.id}`}
                >
                  <div className="flex gap-6">
                    <Link href={`/product/${item.product.id}`}>
                      <img
                        src={item.product.image || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200'}
                        alt={item.product.name}
                        className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="text-lg font-semibold text-[#4b2e2b] hover:text-[#b96a82] cursor-pointer">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-[#b96a82] font-semibold text-lg mt-1">
                        {formatINR(item.product.price)}
                      </p>
                      <p className="text-sm text-muted mt-1">Qty: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-[#4b2e2b]">
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.cart_item_id)}
                        className="mt-2 text-red-600 hover:text-red-700"
                        data-testid={`remove-item-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg sticky top-24">
                <h2 className="text-xl sm:text-2xl font-bold text-[#4b2e2b] mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>{formatINR(calculateTotal())}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-{formatINR(appliedCoupon.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-[#f7c7d3] pt-4">
                    <div className="flex justify-between text-xl font-bold text-[#4b2e2b]">
                      <span>Total</span>
                      <span>{formatINR(calculateFinalTotal())}</span>
                    </div>
                  </div>
                  
                  <CouponInput 
                    cartTotal={calculateTotal()}
                    onApply={setAppliedCoupon}
                  />
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full py-6 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  data-testid="checkout-btn"
                >
                  Proceed to Checkout
                </Button>

                <Link href="/shop" className="block mt-4">
                  <Button
                    variant="outline"
                    className="w-full py-3 border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
