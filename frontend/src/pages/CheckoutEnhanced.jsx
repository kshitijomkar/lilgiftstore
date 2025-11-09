import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getSessionId } from "@/utils/session";
import { getAuthHeaders, isAuthenticated } from "@/utils/auth";
import { formatINR } from "@/utils/currency";
import { MapPin, CreditCard, Banknote, Plus } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutEnhanced = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    is_default: false
  });

  useEffect(() => {
    fetchCart();
    if (isAuthenticated()) {
      fetchAddresses();
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API}/user/profile`, {
        headers: getAuthHeaders()
      });
      const userData = response.data;
      
      // Auto-fill new address form with user details
      if (userData.name && userData.phone) {
        setNewAddress(prev => ({
          ...prev,
          full_name: userData.name || "",
          phone: userData.phone || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

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

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${API}/user/addresses`, {
        headers: getAuthHeaders()
      });
      const userAddresses = response.data.addresses || [];
      setAddresses(userAddresses);
      
      // Auto-select default address
      const defaultAddr = userAddresses.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      } else if (userAddresses.length > 0) {
        setSelectedAddress(userAddresses[0].id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/user/addresses`, newAddress, {
        headers: getAuthHeaders()
      });
      
      toast.success("Address added successfully!");
      fetchAddresses();
      setShowAddAddressForm(false);
      setSelectedAddress(response.data.id);
      
      // Reset form
      setNewAddress({
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        is_default: false
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add address");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    // Validate address selection for authenticated users
    if (isAuthenticated() && !selectedAddress) {
      toast.error("Please add and select a delivery address");
      return;
    }

    try {
      setLoading(true);
      const sessionId = getSessionId();
      const total = calculateTotal();
      
      // Get selected address details
      const addressData = addresses.find(addr => addr.id === selectedAddress);

      if (paymentMethod === "cod") {
        // Create order directly for COD
        const orderItems = cartItems.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }));

        const orderData = {
          session_id: sessionId,
          items: orderItems,
          total_amount: total,
          payment_method: "cod",
          address: addressData || null,
          status: "pending"
        };

        const orderResponse = await axios.post(`${API}/orders`, orderData, {
          headers: isAuthenticated() ? getAuthHeaders() : {}
        });

        // Clear cart
        await axios.delete(`${API}/cart/session/${sessionId}`);

        toast.success("Order placed successfully!");
        navigate(`/checkout/success?order_id=${orderResponse.data.id}&cod=true`);
      } else {
        // Stripe payment
        const originUrl = window.location.origin;
        const response = await axios.post(`${API}/checkout/session`, {
          session_id: sessionId,
          origin_url: originUrl,
          address: addressData || null
        });

        if (response.data.url) {
          window.location.href = response.data.url;
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-8" data-testid="checkout-title">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Address and Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            {isAuthenticated() && (
              <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#4b2e2b] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#b96a82]" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-[#4b2e2b]/70 mb-4">No saved addresses</p>
                      <Button
                        onClick={() => setShowAddAddressForm(true)}
                        variant="outline"
                        className="border-[#b96a82] text-[#b96a82]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <>
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                        {addresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-3 p-3 border border-[#f7c7d3] rounded-lg hover:bg-[#fce6ec]/30">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <div>
                                <p className="font-semibold text-[#4b2e2b]">{address.full_name}</p>
                                <p className="text-sm text-[#4b2e2b]/70">{address.phone}</p>
                                <p className="text-sm text-[#4b2e2b]/70 mt-1">
                                  {address.address_line1}{address.address_line2 && `, ${address.address_line2}`}
                                </p>
                                <p className="text-sm text-[#4b2e2b]/70">
                                  {address.city}, {address.state} - {address.postal_code}
                                </p>
                                {address.is_default && (
                                  <span className="text-xs bg-[#b96a82] text-white px-2 py-1 rounded-full mt-2 inline-block">
                                    Default
                                  </span>
                                )}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button
                        onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                        variant="outline"
                        className="w-full border-[#b96a82] text-[#b96a82]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Address
                      </Button>
                    </>
                  )}

                  {/* Add Address Form */}
                  {showAddAddressForm && (
                    <form onSubmit={handleAddAddress} className="space-y-4 p-4 bg-[#fce6ec]/30 rounded-lg mt-4">
                      <h3 className="font-semibold text-[#4b2e2b]">New Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={newAddress.full_name}
                            onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Phone *</Label>
                          <Input
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Address Line 1 *</Label>
                        <Input
                          value={newAddress.address_line1}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Address Line 2</Label>
                        <Input
                          value={newAddress.address_line2}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>City *</Label>
                          <Input
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>State *</Label>
                          <Input
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Postal Code *</Label>
                          <Input
                            value={newAddress.postal_code}
                            onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button type="submit" className="bg-[#b96a82] hover:bg-[#a05670]">
                          Save Address
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddAddressForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#4b2e2b] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#b96a82]" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border border-[#f7c7d3] rounded-lg hover:bg-[#fce6ec]/30">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#b96a82]" />
                      <div>
                        <p className="font-semibold text-[#4b2e2b]">Credit/Debit Card</p>
                        <p className="text-sm text-[#4b2e2b]/70">Pay securely with Stripe</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-[#f7c7d3] rounded-lg hover:bg-[#fce6ec]/30">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-[#b96a82]" />
                      <div>
                        <p className="font-semibold text-[#4b2e2b]">Cash on Delivery</p>
                        <p className="text-sm text-[#4b2e2b]/70">Pay when you receive</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="text-[#4b2e2b]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.cart_item_id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="text-[#4b2e2b] font-medium">{item.product.name}</p>
                        <p className="text-[#4b2e2b]/70 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[#b96a82] font-semibold">{formatINR(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-[#f7c7d3] pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#4b2e2b]">Subtotal</span>
                    <span className="text-[#4b2e2b]">{formatINR(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#4b2e2b]">Delivery</span>
                    <span className="text-green-600 text-sm">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold text-[#4b2e2b] mt-4">
                    <span>Total</span>
                    <span data-testid="checkout-total">{formatINR(calculateTotal())}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  data-testid="place-order-btn"
                >
                  {loading ? "Processing..." : paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
                </Button>

                {paymentMethod === "cod" && (
                  <p className="text-xs text-[#4b2e2b]/60 text-center">
                    You will pay {formatINR(calculateTotal())} when you receive your order
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutEnhanced;