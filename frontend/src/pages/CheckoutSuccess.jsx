import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [orderId, setOrderId] = useState(null);
  const sessionId = searchParams.get("session_id");
  const isCOD = searchParams.get("cod") === "true";
  const codOrderId = searchParams.get("order_id");

  useEffect(() => {
    if (isCOD && codOrderId) {
      // COD order - show success immediately
      setStatus("success");
      setOrderId(codOrderId);
    } else if (sessionId) {
      // Stripe payment - poll for status
      pollPaymentStatus();
    }
  }, [sessionId, isCOD, codOrderId]);

  const pollPaymentStatus = async (attempts = 0) => {
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      setStatus("timeout");
      return;
    }

    try {
      const response = await axios.get(`${API}/checkout/status/${sessionId}`);
      
      if (response.data.payment_status === "paid") {
        setStatus("success");
        setOrderId(response.data.order_id);
        return;
      } else if (response.data.status === "expired") {
        setStatus("failed");
        return;
      }

      setTimeout(() => pollPaymentStatus(attempts + 1), 2000);
    } catch (error) {
      console.error("Error checking payment status:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-6 py-20 text-center" data-testid="checkout-success-page">
        {status === "checking" && (
          <div data-testid="checking-status">
            <Loader2 className="w-16 h-16 mx-auto text-[#b96a82] animate-spin mb-6" />
            <h1 className="text-3xl font-bold text-[#4b2e2b] mb-4">Processing Your Payment...</h1>
            <p className="text-lg text-[#4b2e2b]/70">Please wait while we confirm your order</p>
          </div>
        )}

        {status === "success" && (
          <div data-testid="success-status">
            <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
            <h1 className="text-4xl font-bold text-[#4b2e2b] mb-4">
              {isCOD ? "Order Placed Successfully!" : "Payment Successful!"}
            </h1>
            <p className="text-xl text-[#4b2e2b]/70 mb-4">
              Thank you for your order! Your gifts will be prepared with love.
            </p>
            {isCOD && (
              <p className="text-lg text-[#b96a82] font-semibold mb-4">
                Payment Method: Cash on Delivery
              </p>
            )}
            {orderId && (
              <p className="text-[#4b2e2b]/60 mb-8" data-testid="order-id">Order ID: {orderId.slice(0, 8)}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/profile")}
                variant="outline"
                className="px-8 py-6 border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full shadow-lg"
              >
                View Orders
              </Button>
              <Button 
                onClick={() => navigate("/shop")}
                className="px-8 py-6 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg"
                data-testid="continue-shopping-success-btn"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}

        {(status === "failed" || status === "timeout" || status === "error") && (
          <div data-testid="error-status">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-5xl">✕</span>
            </div>
            <h1 className="text-4xl font-bold text-[#4b2e2b] mb-4">Payment Issue</h1>
            <p className="text-xl text-[#4b2e2b]/70 mb-8">
              There was an issue processing your payment. Please try again.
            </p>
            <Button 
              onClick={() => navigate("/cart")}
              className="px-8 py-6 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg"
              data-testid="back-to-cart-btn"
            >
              Back to Cart
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutSuccess;