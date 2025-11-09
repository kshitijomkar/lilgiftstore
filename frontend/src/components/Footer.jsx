import { Link } from "react-router-dom";
import { Heart, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-[#f7c7d3] mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="The Lil Gift Corner" className="h-10 w-10 object-contain" />
              <h3 className="text-xl font-bold text-[#4b2e2b]">The Lil Gift Corner</h3>
            </div>
            <p className="text-[#4b2e2b]/70 text-sm leading-relaxed">
              Your happy place for all things cute, creative, and full of love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[#4b2e2b] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-[#4b2e2b]/70 hover:text-[#b96a82] transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="text-[#4b2e2b]/70 hover:text-[#b96a82] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/custom-gifts" className="text-[#4b2e2b]/70 hover:text-[#b96a82] transition-colors">Custom Gifts</Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#4b2e2b]/70 hover:text-[#b96a82] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-[#4b2e2b] mb-4">Categories</h4>
            <ul className="space-y-2 text-[#4b2e2b]/70">
              <li>Gift Boxes</li>
              <li>Wedding Gifts</li>
              <li>Personalized Gifts</li>
              <li>Hampers</li>
              <li>Gift Wrapping</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-[#4b2e2b] mb-4">Get In Touch</h4>
            <ul className="space-y-2 text-[#4b2e2b]/70 text-sm">
              <li>📧 hello@thelilgiftcorner.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Hyderabad, Telangana, India</li>
              <li className="pt-2">
                <a 
                  href="https://www.instagram.com/_thelilgiftcorner/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-[#b96a82] hover:text-[#a05670] transition-colors"
                  data-testid="instagram-link"
                >
                  <Instagram className="w-5 h-5" />
                  Follow us on Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#f7c7d3] mt-8 pt-8 text-center">
          <p className="text-[#4b2e2b]/70 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-[#b96a82] fill-[#b96a82]" /> by The Lil Gift Corner © 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;