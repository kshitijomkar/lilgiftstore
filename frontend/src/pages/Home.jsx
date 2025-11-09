import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShoppingBag, Heart, Star, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="The Lil Gift Corner - Handcrafted Gifts, Wedding Favors & Personalized Hampers"
        description="Discover beautiful handcrafted gifts, wedding favors, personalized hampers, and adorable gift wrapping. Perfect for every occasion. Shop now!"
        keywords="handcrafted gifts, wedding favors, gift hampers, personalized gifts, gift wrapping, cute gifts, boutique gifts, India, Hyderabad"
        type="website"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fffafc] via-[#fce6ec] to-[#f7c7d3] opacity-70"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606209918398-08c0ef28d2b8?w=1600')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
              <Gift className="w-5 h-5 text-[#b96a82]" />
              <span className="text-sm font-medium text-[#4b2e2b]">Your Happy Place for All Things Cute</span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#4b2e2b] mb-6 leading-tight">
            Where Every Small Gift<br />
            <span className="text-[#b96a82]">Brings a Big Smile</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#4b2e2b]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Beautiful, affordable gifts made with love. Perfect for every occasion,<br className="hidden sm:block" /> wrapped with joy and delivered with smiles.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop" data-testid="shop-now-btn">
              <Button className="px-8 py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Link to="/custom-gifts" data-testid="custom-gifts-btn">
              <Button variant="outline" className="px-8 py-6 text-lg border-2 border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Heart className="mr-2 h-5 w-5" />
                Custom Gifts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" data-testid="feature-handcrafted">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Handcrafted with Love</h3>
              <p className="text-[#4b2e2b]/70">Every gift is carefully curated and crafted with attention to detail</p>
            </div>
            
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" data-testid="feature-affordable">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Affordable & Beautiful</h3>
              <p className="text-[#4b2e2b]/70">Quality gifts that won't break the bank, perfect for any budget</p>
            </div>
            
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" data-testid="feature-personalized">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Personalized Touches</h3>
              <p className="text-[#4b2e2b]/70">Add your personal touch to make every gift uniquely special</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">Our Cutest Picks</h2>
            <p className="text-lg text-[#4b2e2b]/70">Handpicked gifts that spread joy and smiles</p>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="featured-products">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button className="px-8 py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-testid="view-all-products-btn">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">What Our Customers Say</h2>
            <p className="text-lg text-[#4b2e2b]/70">Real stories from happy customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="testimonials">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300" data-testid="testimonial-1">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#b96a82] text-[#b96a82]" />
                ))}
              </div>
              <p className="text-[#4b2e2b]/80 mb-4 italic">
                "The most beautiful gift hamper I've ever received! Every detail was perfect. The Lil Gift Corner truly understands what makes gifts special."
              </p>
              <p className="text-[#4b2e2b] font-semibold">- Priya Sharma</p>
              <p className="text-[#4b2e2b]/70 text-sm">Hyderabad</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300" data-testid="testimonial-2">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#b96a82] text-[#b96a82]" />
                ))}
              </div>
              <p className="text-[#4b2e2b]/80 mb-4 italic">
                "I ordered custom wedding favors and they were absolutely stunning! My guests couldn't stop complimenting them. Highly recommend!"
              </p>
              <p className="text-[#4b2e2b] font-semibold">- Anjali Reddy</p>
              <p className="text-[#4b2e2b]/70 text-sm">Bangalore</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300" data-testid="testimonial-3">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#b96a82] text-[#b96a82]" />
                ))}
              </div>
              <p className="text-[#4b2e2b]/80 mb-4 italic">
                "Such cute and thoughtful gift options! Perfect for birthdays and special occasions. The quality is excellent and prices are reasonable."
              </p>
              <p className="text-[#4b2e2b] font-semibold">- Meera Kapoor</p>
              <p className="text-[#4b2e2b]/70 text-sm">Mumbai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#b96a82] to-[#f7c7d3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div className="transform hover:scale-105 transition-all duration-300" data-testid="stat-orders">
              <div className="text-5xl font-bold mb-2">2000+</div>
              <p className="text-white/90 text-lg">Happy Customers</p>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300" data-testid="stat-products">
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-white/90 text-lg">Unique Products</p>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300" data-testid="stat-cities">
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-white/90 text-lg">Cities Delivered</p>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300" data-testid="stat-rating">
              <div className="text-5xl font-bold mb-2">4.9⭐</div>
              <p className="text-white/90 text-lg">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">How It Works</h2>
            <p className="text-lg text-[#4b2e2b]/70">Simple steps to get your perfect gift</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center text-3xl font-bold text-[#b96a82]">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Browse & Choose</h3>
              <p className="text-[#4b2e2b]/70">Explore our curated collection of handcrafted gifts</p>
            </div>
            
            <div className="text-center" data-testid="step-2">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center text-3xl font-bold text-[#b96a82]">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Personalize</h3>
              <p className="text-[#4b2e2b]/70">Add your special touch with custom messages</p>
            </div>
            
            <div className="text-center" data-testid="step-3">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center text-3xl font-bold text-[#b96a82]">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Secure Payment</h3>
              <p className="text-[#4b2e2b]/70">Pay safely with our encrypted checkout</p>
            </div>
            
            <div className="text-center" data-testid="step-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center text-3xl font-bold text-[#b96a82]">
                4
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Fast Delivery</h3>
              <p className="text-[#4b2e2b]/70">Receive your gift beautifully wrapped</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-[#4b2e2b]/70">Everything you need to know</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg" data-testid="faq-1">
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Do you offer custom gift options?</h3>
              <p className="text-[#4b2e2b]/70">Yes! We love creating personalized gifts. Visit our Custom Gifts page or contact us with your requirements.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg" data-testid="faq-2">
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">What is your delivery time?</h3>
              <p className="text-[#4b2e2b]/70">Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for select locations.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg" data-testid="faq-3">
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Can I return or exchange items?</h3>
              <p className="text-[#4b2e2b]/70">We accept returns within 7 days of delivery for unused items in original packaging. Custom items are non-returnable.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg" data-testid="faq-4">
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Do you ship internationally?</h3>
              <p className="text-[#4b2e2b]/70">Currently, we ship within India only. International shipping will be available soon!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">Stay in the Loop!</h2>
            <p className="text-lg text-[#4b2e2b]/80 mb-8">Get exclusive offers, gift ideas, and updates delivered to your inbox</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" data-testid="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border-2 border-white bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#b96a82]"
              />
              <Button className="px-8 py-4 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-[#4b2e2b]/60 mt-4">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-6">About The Lil Gift Corner</h2>
              <p className="text-lg text-[#4b2e2b]/80 mb-6 leading-relaxed">
                We're your new happy place for all things cute, creative, and full of love. Whether it's a wedding favor, birthday surprise, or a festive hamper, we craft each gift with care.
              </p>
              <p className="text-lg text-[#4b2e2b]/80 mb-8 leading-relaxed">
                Perfect gifts, pretty wraps, and lots of smiles — that's what we're all about. Join our community of gift lovers and discover daily doses of cuteness!
              </p>
              <Link to="/about">
                <Button className="px-8 py-4 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-testid="learn-more-btn">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1606210108866-4ca4eb806983?w=800" 
                  alt="Gift packaging"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;