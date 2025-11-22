import Link from 'next/link';
import { ShoppingBag, Heart, Star, Gift } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import SEOHead from '@/components/SEOHead';
import NewsletterForm from '@/components/layout/NewsletterForm';
import { Button } from '@/components/ui/button';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:5000'}/api/products?limit=4`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 4) : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 text-center">
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/shop" data-testid="shop-now-btn">
              <Button className="px-6 sm:px-8 py-3 text-base bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Link href="/custom-gifts" data-testid="custom-gifts-btn">
              <Button variant="outline" className="px-6 sm:px-8 py-3 text-base border-2 border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Heart className="h-5 w-5" />
                Custom Gifts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" data-testid="feature-handcrafted">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Handcrafted with Love</h3>
              <p className="text-muted">Every gift is carefully curated and crafted with attention to detail</p>
            </div>
            
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" data-testid="feature-affordable">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Affordable & Beautiful</h3>
              <p className="text-muted">Quality gifts that won't break the bank, perfect for any budget</p>
            </div>
            
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" data-testid="feature-personalized">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Personalized Touches</h3>
              <p className="text-muted">Add your personal touch to make every gift uniquely special</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12 md:py-20" aria-label="Featured products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">Our Cutest Picks</h2>
            <p className="text-lg text-muted">Handpicked gifts that spread joy and smiles</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8" data-testid="featured-products">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No products available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted">Real stories from happy customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              {
                text: "The most beautiful gift hamper I've ever received! Every detail was perfect. The Lil Gift Corner truly understands what makes gifts special.",
                author: "Priya Sharma",
                location: "Hyderabad"
              },
              {
                text: "I ordered custom wedding favors and they were absolutely stunning! My guests couldn't stop complimenting them. Highly recommend!",
                author: "Anjali Reddy",
                location: "Bangalore"
              },
              {
                text: "Such cute and thoughtful gift options! Perfect for birthdays and special occasions. The quality is excellent and prices are reasonable.",
                author: "Meera Kapoor",
                location: "Mumbai"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <p className="text-muted italic mb-6">"{testimonial.text}"</p>
                <div className="text-sm">
                  <p className="font-semibold text-[#4b2e2b]">{testimonial.author}</p>
                  <p className="text-[#b96a82]">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {[
              { number: "2000+", label: "Happy Customers" },
              { number: "500+", label: "Unique Products" },
              { number: "50+", label: "Cities Delivered" },
              { number: "4.9⭐", label: "Average Rating" }
            ].map((stat, idx) => (
              <div key={idx}>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#b96a82]">{stat.number}</h3>
                <p className="text-muted text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">How It Works</h2>
            <p className="text-lg text-muted">Simple steps to get your perfect gift</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {[
              { step: "1", title: "Browse & Choose", desc: "Explore our curated collection of handcrafted gifts" },
              { step: "2", title: "Personalize", desc: "Add your special touch with custom messages" },
              { step: "3", title: "Secure Payment", desc: "Pay safely with our encrypted checkout" },
              { step: "4", title: "Fast Delivery", desc: "Receive your gift beautifully wrapped" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#b96a82] text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[#4b2e2b] mb-2">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted">Everything you need to know</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Do you offer custom gift options?",
                a: "Yes! We love creating personalized gifts. Visit our Custom Gifts page or contact us with your requirements."
              },
              {
                q: "What is your delivery time?",
                a: "Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for select locations."
              },
              {
                q: "Can I return or exchange items?",
                a: "We accept returns within 7 days of delivery for unused items in original packaging. Custom items are non-returnable."
              },
              {
                q: "Do you ship internationally?",
                a: "Currently, we ship within India only. International shipping will be available soon!"
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md">
                <h3 className="font-semibold text-[#4b2e2b] mb-2">{faq.q}</h3>
                <p className="text-muted text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-r from-[#b96a82] to-[#a05670]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Stay in the Loop!</h2>
          <p className="text-white/90 text-lg mb-8">
            Get exclusive offers, gift ideas, and updates delivered to your inbox
          </p>
          <NewsletterForm />
          <p className="text-white/70 text-sm mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-6">Ready to Spread Smiles?</h2>
          <p className="text-xl text-[#4b2e2b]/80 mb-8">
            Explore our collection of handcrafted gifts and find the perfect present for your loved ones.
          </p>
          <Link href="/shop">
            <Button className="px-8 py-6 text-lg bg-[#4b2e2b] hover:bg-[#3a1f1f] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
