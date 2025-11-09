import { useState } from 'react';
import { Package, Search } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatINR } from '@/utils/currency';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const trackOrder = async () => {
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(`${API}/track/${orderId}`);
      setOrderData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Order not found. Please check your order ID.');
      } else {
        toast.error('Failed to track order. Please try again.');
      }
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Track Your Order - The Lil Gift Corner"
        description="Track your order status and delivery progress"
      />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fce6ec] rounded-full mb-4">
            <Package className="w-8 h-8 text-[#b96a82]" />
          </div>
          <h1 className="text-4xl font-bold text-[#4b2e2b] mb-2">Track Your Order</h1>
          <p className="text-lg text-[#4b2e2b]/70">
            Enter your order ID to check delivery status
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#f7c7d3]/30 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4b2e2b]/50" />
              <Input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
                placeholder="Enter your order ID"
                className="pl-12 py-6 border-[#f7c7d3] bg-white text-lg"
                data-testid="order-id-input"
              />
            </div>
            <Button
              onClick={trackOrder}
              disabled={loading}
              className="bg-[#b96a82] hover:bg-[#a05670] text-white px-12 py-6 text-lg rounded-full shadow-lg"
              data-testid="track-button"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </div>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#f7c7d3]/30">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#4b2e2b] mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#4b2e2b]/60">Order ID</p>
                  <p className="font-mono font-medium text-[#4b2e2b]">{orderData.order_id}</p>
                </div>
                <div>
                  <p className="text-[#4b2e2b]/60">Order Date</p>
                  <p className="font-medium text-[#4b2e2b]">
                    {new Date(orderData.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[#4b2e2b]/60">Total Amount</p>
                  <p className="font-medium text-[#4b2e2b]">{formatINR(orderData.total_amount)}</p>
                </div>
                <div>
                  <p className="text-[#4b2e2b]/60">Status</p>
                  <p className="font-medium text-[#b96a82] capitalize">{orderData.status}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-6">Delivery Progress</h3>
              <OrderStatusTimeline 
                currentStatus={orderData.status} 
                timeline={orderData.timeline}
              />
            </div>
          </div>
        )}

        {/* Not Found Message */}
        {searched && !orderData && !loading && (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-[#f7c7d3]/30">
            <Package className="w-20 h-20 mx-auto text-[#4b2e2b]/20 mb-6" />
            <h2 className="text-2xl font-semibold text-[#4b2e2b] mb-4">Order Not Found</h2>
            <p className="text-[#4b2e2b]/60">
              Please check your order ID and try again.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
