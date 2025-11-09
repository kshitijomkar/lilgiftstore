import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import About from "@/pages/About";
import CustomGifts from "@/pages/CustomGifts";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/CheckoutEnhanced";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import CheckoutCancel from "@/pages/CheckoutCancel";
import Contact from "@/pages/Contact";
import Profile from "@/pages/ProfileEnhanced";
import Wishlist from "@/pages/Wishlist";
import OrderTracking from "@/pages/OrderTracking";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/ProductsEnhanced";
import AdminOrders from "@/pages/admin/Orders";
import AdminCustomGifts from "@/pages/admin/CustomGifts";
import AdminContacts from "@/pages/admin/Contacts";
import "@/App.css";

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/custom-gifts" element={<CustomGifts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/custom-gifts" element={<AdminCustomGifts />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" richColors />
      </div>
    </HelmetProvider>
  );
}

export default App;
