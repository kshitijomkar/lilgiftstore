'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function SearchBarEnhanced({ className = '' }: any) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`/api/products?search=${query}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await fetch(`/api/products?limit=5`);
      const data = await res.json();
      setTrending(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
      setQuery('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for gifts..."
          className="pl-10 pr-10 py-6 border-[#f7c7d3] bg-white/80 backdrop-blur-sm rounded-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4b2e2b]/50" />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b2e2b]/50">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showDropdown && (query.length >= 2 || trending.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#f7c7d3]/30 max-h-96 overflow-y-auto">
          {suggestions.length > 0 && (
            <div className="p-2 border-b border-[#f7c7d3]/20">
              <p className="text-xs font-medium text-[#4b2e2b]/50 px-3 py-2">Suggestions</p>
              {suggestions.map((product: any) => (
                <div key={product.id} className="px-3 py-2 hover:bg-[#fce6ec] cursor-pointer rounded-full">
                  <p className="text-[#4b2e2b]">{product.name}</p>
                </div>
              ))}
            </div>
          )}
          {trending.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-[#4b2e2b]/50 px-3 py-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Trending
              </p>
              {trending.map((product: any) => (
                <div key={product.id} className="px-3 py-2 hover:bg-[#fce6ec] cursor-pointer rounded-full">
                  <p className="text-[#4b2e2b]">{product.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
