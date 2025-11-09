import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-6 py-20 text-center" data-testid="checkout-cancel-page">
        <XCircle className="w-24 h-24 mx-auto text-orange-500 mb-6" />
        <h1 className="text-4xl font-bold text-[#4b2e2b] mb-4">Payment Cancelled</h1>
        <p className="text-xl text-[#4b2e2b]/70 mb-8">
          Your payment was cancelled. Your cart items are still waiting for you!
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/cart">
            <Button className="px-8 py-6 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg" data-testid="return-to-cart-btn">
              Return to Cart
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="px-8 py-6 border-2 border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full shadow-lg" data-testid="continue-shopping-cancel-btn">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutCancel;