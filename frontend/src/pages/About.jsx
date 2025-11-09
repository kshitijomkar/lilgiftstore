import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Gift, Star, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-6" data-testid="about-title">About The Lil Gift Corner</h1>
          <p className="text-xl text-[#4b2e2b]/70 max-w-3xl mx-auto leading-relaxed">
            We're your new happy place for all things cute, creative, and full of love.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1606209918398-08c0ef28d2b8?w=800" 
              alt="The Lil Gift Corner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-[#4b2e2b] mb-6">Our Story</h2>
            <p className="text-lg text-[#4b2e2b]/80 mb-4 leading-relaxed">
              The Lil Gift Corner was born from a simple belief: every small gift brings a big smile. We started with a passion for creating beautiful, meaningful gifts that make people feel special.
            </p>
            <p className="text-lg text-[#4b2e2b]/80 mb-4 leading-relaxed">
              Whether it's a wedding favor, a birthday surprise, or a festive hamper, we pour our hearts into every creation. Each item is carefully curated, thoughtfully designed, and crafted with attention to detail.
            </p>
            <p className="text-lg text-[#4b2e2b]/80 leading-relaxed">
              We believe gifts should be affordable without compromising on beauty or quality. That's why we work hard to bring you the cutest picks at prices that won't break the bank.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[#4b2e2b] text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Made with Love</h3>
              <p className="text-[#4b2e2b]/70">Every product is crafted with care and attention to detail</p>
            </div>
            
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Unique & Creative</h3>
              <p className="text-[#4b2e2b]/70">Stand out with gifts that are truly one-of-a-kind</p>
            </div>
            
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Quality Assured</h3>
              <p className="text-[#4b2e2b]/70">Beautiful products that don't compromise on quality</p>
            </div>
            
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-[#b96a82]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4b2e2b] mb-3">Customer First</h3>
              <p className="text-[#4b2e2b]/70">Your happiness is our top priority</p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3] rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-[#4b2e2b] mb-6">Our Mission</h2>
          <p className="text-xl text-[#4b2e2b]/80 max-w-3xl mx-auto leading-relaxed">
            To spread joy through thoughtful, beautiful gifts that celebrate life's special moments. We're here to help you make every occasion memorable with perfect gifts, pretty wraps, and lots of smiles.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;