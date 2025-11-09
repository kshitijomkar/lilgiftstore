import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSessionId } from "@/utils/session";
import { formatINR } from "@/utils/currency";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const sessionId = getSessionId();
      const response = await axios.get(`${API}/cart/${sessionId}`);
      setCartItems(response.data.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API}/cart/${cartItemId}`);
      toast.success("Item removed from cart");
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-8" data-testid="cart-title">Your Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-cart">
            <ShoppingBag className="w-24 h-24 mx-auto text-[#f7c7d3] mb-6" />
            <p className="text-2xl text-[#4b2e2b]/70 mb-8">Your cart is empty</p>
            <Link to="/shop">
              <Button className="px-8 py-6 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg" data-testid="continue-shopping-btn">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all" data-testid={`cart-item-${item.product.id}`}>
                  <div className="flex gap-6">
                    <Link to={`/product/${item.product.id}`}>
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="text-xl font-semibold text-[#4b2e2b] mb-2 hover:text-[#b96a82] transition-colors cursor-pointer" data-testid={`item-name-${item.product.id}`}>{item.product.name}</h3>
                      </Link>
                      <p className="text-[#b96a82] font-semibold mb-2" data-testid={`item-price-${item.product.id}`}>{formatINR(item.product.price)}</p>
                      <p className="text-[#4b2e2b]/70" data-testid={`item-quantity-${item.product.id}`}>Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <p className="text-xl font-semibold text-[#4b2e2b]" data-testid={`item-total-${item.product.id}`}>{formatINR(item.product.price * item.quantity)}</p>
                      <Button 
                        variant="ghost"
                        onClick={() => removeFromCart(item.cart_item_id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        data-testid={`remove-item-${item.product.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg sticky top-24" data-testid="order-summary">
                <h2 className="text-2xl font-bold text-[#4b2e2b] mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#4b2e2b]/70">
                    <span>Subtotal</span>
                    <span data-testid="subtotal">{formatINR(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-[#4b2e2b]/70">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-[#f7c7d3] pt-4">
                    <div className="flex justify-between text-xl font-bold text-[#4b2e2b]">
                      <span>Total</span>
                      <span data-testid="total">{formatINR(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleCheckout}
                  className="w-full py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  data-testid="proceed-to-checkout-btn"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;