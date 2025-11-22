'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Shop({ initialProducts = [], initialCategories = [] }: any) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [categories] = useState<any[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/api/products?';
      
      if (selectedCategory !== 'all') {
        url += `category=${selectedCategory}&`;
      }
      
      if (searchQuery) {
        url += `search=${searchQuery}&`;
      }
      
      url += `sort_by=${sortBy}&order=desc`;
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Shop Handcrafted Gifts - The Lil Gift Corner"
        description="Browse our beautiful collection of handcrafted gifts, wedding favors, personalized hampers, and more. Find the perfect gift for every occasion."
        keywords="shop gifts, buy handcrafted gifts, wedding favors online, personalized hampers, gift shop India"
        type="website"
      />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">Shop Our Gifts</h1>
          <p className="text-lg text-muted">Discover unique gifts for every occasion</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4b2e2b]/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-white/80 backdrop-blur-sm border-[#f7c7d3] text-[#4b2e2b]"
                data-testid="search-input"
              />
            </div>
          </form>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-[#f7c7d3] text-[#4b2e2b]" data-testid="category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-[#f7c7d3] text-[#4b2e2b]" data-testid="sort-filter">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-[#4b2e2b]/70">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8" data-testid="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
