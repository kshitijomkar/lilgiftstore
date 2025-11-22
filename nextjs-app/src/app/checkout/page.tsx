'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';
import { formatINR } from '@/lib/currency';
import { getSessionId } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
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
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item?.product?.price || 0;
      const quantity = item?.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = calculateTotal();
      // Stripe integration would go here
      // For now, simulate success
      setTimeout(() => {
        router.push('/checkout-success');
      }, 1000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Checkout - The Lil Gift Corner"
        description="Complete your purchase securely. Review your order and proceed to payment."
        type="website"
      />
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  md:gap-4 sm:gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold text-[#4b2e2b] mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                    required
                  />
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b] md:col-span-2"
                    required
                  />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b] md:col-span-2"
                    required
                  />
                  <Input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b] md:col-span-2"
                    required
                  />
                  <Input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                    required
                  />
                  <Input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                    required
                  />
                  <Input
                    type="text"
                    name="zipcode"
                    placeholder="ZIP Code"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                    required
                  />
                </div>
              </div>

              {/* Order Summary in Form */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold text-[#4b2e2b] mb-6">Order Review</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between border-b border-[#f7c7d3] pb-4">
                      <div>
                        <p className="font-semibold text-[#4b2e2b]">{item.product.name}</p>
                        <p className="text-muted text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#b96a82]">{formatINR(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#4b2e2b] mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-[#4b2e2b]">{item.quantity}x {item.product.name}</span>
                    <span className="text-[#b96a82] font-semibold">{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-[#f7c7d3] pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-semibold text-[#4b2e2b]">{formatINR(calculateTotal())}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t border-[#f7c7d3] pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#4b2e2b]">
                    <span>Total</span>
                    <span className="text-[#b96a82]">{formatINR(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
