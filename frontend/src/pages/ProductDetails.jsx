import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSessionId } from "@/utils/session";
import { formatINR } from "@/utils/currency";
import WishlistButton from "@/components/WishlistButton";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import InventoryBadge from "@/components/InventoryBadge";
import SEOHead from "@/components/SEOHead";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const sessionId = getSessionId();
      await axios.post(`${API}/cart`, {
        product_id: product.id,
        quantity,
        session_id: sessionId
      });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#4b2e2b]/70">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEOHead 
        title={`${product?.name || 'Product'} - The Lil Gift Corner`}
        description={product?.description || 'View product details'}
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/shop" className="inline-flex items-center text-[#b96a82] hover:text-[#a05670] mb-8 transition-colors" data-testid="back-to-shop">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm p-4" data-testid="product-image">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-[#4b2e2b] mb-4" data-testid="product-name">{product.name}</h1>
            <p className="text-3xl text-[#b96a82] font-semibold mb-6" data-testid="product-price">{formatINR(product.price)}</p>
            
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-block px-4 py-2 bg-[#fce6ec] text-[#b96a82] rounded-full text-sm font-medium" data-testid="product-category">
                {product.category}
              </span>
              <InventoryBadge 
                stockQuantity={product.stock_quantity || 100} 
                lowStockThreshold={product.low_stock_threshold || 10} 
              />
            </div>

            <p className="text-lg text-[#4b2e2b]/80 mb-8 leading-relaxed" data-testid="product-description">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8" data-testid="product-tags">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/60 backdrop-blur-sm text-[#4b2e2b]/70 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-[#4b2e2b] font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full border-[#f7c7d3] text-[#b96a82] hover:bg-[#fce6ec]"
                  data-testid="decrease-quantity"
                >
                  -
                </Button>
                <span className="text-2xl font-semibold text-[#4b2e2b] w-16 text-center" data-testid="quantity-display">{quantity}</span>
                <Button 
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full border-[#f7c7d3] text-[#b96a82] hover:bg-[#fce6ec]"
                  data-testid="increase-quantity"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={addToCart}
                disabled={!product.in_stock || product.stock_quantity === 0}
                className="flex-1 py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <WishlistButton productId={product.id} size="lg" className="py-6 px-6" />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ReviewForm productId={product.id} onSuccess={fetchProduct} />
            </div>
            <div>
              <ReviewList productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;