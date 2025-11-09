import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";
import axios from "axios";
import { getSessionId } from "@/utils/session";
import { isAuthenticated, getAuthHeaders } from "@/utils/auth";
import WishlistButton from "@/components/WishlistButton";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAdding(true);
    try {
      const sessionId = getSessionId();
      await axios.post(`${API}/cart`, {
        product_id: product.id,
        quantity: 1,
        session_id: sessionId
      });
      toast.success("Added to cart!");
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative" data-testid={`product-card-${product.id}`}>
      {/* Wishlist Button - Top Right */}
      <div className="absolute top-4 right-4 z-20 opacity-90 hover:opacity-100 transition-opacity">
        <WishlistButton productId={product.id} />
      </div>

      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-[#fce6ec] text-[#b96a82] rounded-full text-xs font-medium mb-3" data-testid={`product-category-${product.id}`}>
          {product.category}
        </span>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-[#4b2e2b] mb-2 hover:text-[#b96a82] transition-colors" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[#4b2e2b]/70 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl font-bold text-[#b96a82]" data-testid={`product-price-${product.id}`}>{formatINR(product.price)}</span>
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-md hover:shadow-lg transition-all"
              data-testid={`add-to-cart-${product.id}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Link to={`/product/${product.id}`}>
              <Button 
                size="sm"
                variant="outline"
                className="border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full shadow-md hover:shadow-lg transition-all"
                data-testid={`view-product-${product.id}`}
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
