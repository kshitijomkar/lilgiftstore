import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSessionId } from "@/utils/session";
import { formatINR } from "@/utils/currency";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const sessionId = getSessionId();
      const response = await axios.get(`${API}/cart/${sessionId}`);
      if (response.data.items.length === 0) {
        toast.error("Your cart is empty");
        navigate("/cart");
      }
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const originUrl = window.location.origin;
      
      const response = await axios.post(`${API}/checkout/session`, {
        session_id: sessionId,
        origin_url: originUrl
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-8" data-testid="checkout-title">Checkout</h1>

        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg" data-testid="checkout-items">
            <h2 className="text-2xl font-bold text-[#4b2e2b] mb-4">Order Items</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="flex justify-between items-center border-b border-[#f7c7d3] pb-4">
                  <div className="flex gap-4">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-semibold text-[#4b2e2b]">{item.product.name}</p>
                      <p className="text-[#4b2e2b]/70 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-[#b96a82]">{formatINR(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#f7c7d3]">
              <div className="flex justify-between text-2xl font-bold text-[#4b2e2b]">
                <span>Total</span>
                <span data-testid="checkout-total">{formatINR(calculateTotal())}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-[#4b2e2b] mb-4">Payment</h2>
            <p className="text-[#4b2e2b]/70 mb-6">Click below to proceed to secure payment</p>
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              data-testid="pay-now-btn"
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;