'use client';
import Link from 'next/link';
import { Heart, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-[#f7c7d3] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <h3 className="text-xl font-bold text-[#4b2e2b]">The Lil Gift Corner</h3>
            </div>
            <p className="text-[#4b2e2b]/70 text-sm">Your happy place for all things cute, creative, and full of love.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#4b2e2b] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-[#4b2e2b]/70 hover:text-[#b96a82]">Shop</Link></li>
              <li><Link href="/about" className="text-[#4b2e2b]/70 hover:text-[#b96a82]">About Us</Link></li>
              <li><Link href="/custom-gifts" className="text-[#4b2e2b]/70 hover:text-[#b96a82]">Custom Gifts</Link></li>
              <li><Link href="/contact" className="text-[#4b2e2b]/70 hover:text-[#b96a82]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#4b2e2b] mb-4">Categories</h4>
            <ul className="space-y-2 text-[#4b2e2b]/70 text-sm">
              <li>Gift Boxes</li>
              <li>Wedding Gifts</li>
              <li>Personalized Gifts</li>
              <li>Hampers</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#4b2e2b] mb-4">Get In Touch</h4>
            <ul className="space-y-2 text-[#4b2e2b]/70 text-sm">
              <li>📧 hello@thelilgiftcorner.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Hyderabad, India</li>
              <li className="pt-2">
                <a href="https://instagram.com/_thelilgiftcorner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#b96a82] hover:text-[#a05670]">
                  <Instagram className="w-5 h-5" />Follow us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#f7c7d3] mt-8 pt-8 text-center">
          <p className="text-[#4b2e2b]/70 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-[#b96a82] fill-[#b96a82]" /> by The Lil Gift Corner © 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
