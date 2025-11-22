'use client';
import Link from 'next/link';
import { CheckCircle2, Package } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Order Confirmed - The Lil Gift Corner"
        description="Your order has been successfully placed! Track your delivery now."
        type="website"
      />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-[#b96a82] mx-auto mb-6 animate-bounce" />
          
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4b2e2b] mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted mb-8">
            Thank you for your purchase. Your order has been successfully placed and will be delivered soon.
          </p>
          
          <div className="bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3] rounded-2xl p-6 mb-8">
            <Package className="w-12 h-12 text-[#b96a82] mx-auto mb-4" />
            <p className="text-[#4b2e2b] font-semibold mb-2">Order ID: #12345</p>
            <p className="text-sm text-muted">You'll receive an email confirmation shortly</p>
          </div>
          
          <div className="space-y-4">
            <Link href="/order-tracking">
              <Button className="w-full bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full py-6">
                Track Your Order
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
