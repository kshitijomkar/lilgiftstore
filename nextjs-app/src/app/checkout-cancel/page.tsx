'use client';
import Link from 'next/link';
import { XCircle, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Payment Cancelled - The Lil Gift Corner"
        description="Your payment was cancelled. Your cart is saved and ready for checkout."
        type="website"
      />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4b2e2b] mb-4">Payment Cancelled</h1>
          <p className="text-lg text-muted mb-8">
            Your payment has been cancelled. Your items are still in your cart and ready for checkout whenever you're ready.
          </p>
          
          <div className="bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3] rounded-2xl p-6 mb-8">
            <ShoppingCart className="w-12 h-12 text-[#b96a82] mx-auto mb-4" />
            <p className="text-sm text-muted">Your cart has been saved</p>
          </div>
          
          <div className="space-y-4">
            <Link href="/cart">
              <Button className="w-full bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full py-6">
                Back to Cart
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="w-full border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full py-6">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
