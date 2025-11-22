'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';

export default function About() {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="About The Lil Gift Corner - Our Story"
        description="Learn about our passion for handcrafted gifts, wedding favors, and personalized hampers."
        type="website"
      />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-6">About The Lil Gift Corner</h1>
        <p className="text-xl text-muted max-w-3xl">We're your new happy place for all things cute, creative, and full of love. Whether it's a wedding favor, birthday surprise, or a festive hamper, we craft each gift with care.</p>
      </div>
      <Footer />
    </div>
  );
}
