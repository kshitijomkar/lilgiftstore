'use client';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';
import { formatINR } from '@/lib/currency';
import OrderStatusTimeline from '@/components/common/OrderStatusTimeline';
import { Button } from '@/components/ui/button';

export default function OrderTracking() {
  const orders = [
    {
      id: '#12345',
      status: 'In Transit',
      date: '2025-11-20',
      items: 3,
      total: 1499,
      steps: [
        { name: 'Order Placed', completed: true },
        { name: 'Processing', completed: true },
        { name: 'Shipped', completed: true },
        { name: 'In Transit', completed: true },
        { name: 'Delivered', completed: false }
      ]
    },
    {
      id: '#12344',
      status: 'Delivered',
      date: '2025-11-15',
      items: 2,
      total: 999,
      steps: [
        { name: 'Order Placed', completed: true },
        { name: 'Processing', completed: true },
        { name: 'Shipped', completed: true },
        { name: 'Delivered', completed: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Track Your Orders - The Lil Gift Corner"
        description="Track the status of your orders and deliveries in real-time."
        type="website"
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-2">Track Your Orders</h1>
          <p className="text-lg text-muted">Monitor the status of your deliveries</p>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-[#f7c7d3]/20">
                <div>
                  <p className="text-sm text-muted">Order ID</p>
                  <p className="text-base sm:text-lg font-semibold text-[#4b2e2b]">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {order.status === 'Delivered' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Truck className="w-5 h-5 text-[#b96a82]" />
                    )}
                    <span className="font-semibold text-[#4b2e2b]">{order.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted">Items</p>
                  <p className="text-base sm:text-lg font-semibold text-[#4b2e2b]">{order.items}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Total</p>
                  <p className="text-base sm:text-lg font-semibold text-[#b96a82]">{formatINR(order.total)}</p>
                </div>
              </div>

              <OrderStatusTimeline steps={order.steps} />
              
              <div className="mt-6 pt-6 border-t border-[#f7c7d3]/20 flex gap-4">
                <Button className="flex-1 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1 border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full">
                  Contact Support
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button className="bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full px-6 sm:px-8 py-2 sm:py-3">
              Back to Shopping
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
