import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SearchBarEnhanced({ className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API}/products/suggestions?q=${query}`);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await axios.get(`${API}/products/trending-searches?limit=5`);
      setTrending(response.data.trending || []);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
      setQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
          onKeyPress={handleKeyPress}
          placeholder="Search for gifts..."
          className="pl-10 pr-10 py-6 border-[#f7c7d3] bg-white/80 backdrop-blur-sm rounded-full"
          data-testid="search-input"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4b2e2b]/50" />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b2e2b]/50 hover:text-[#4b2e2b]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showDropdown && (query.length >= 2 || trending.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#f7c7d3]/30 max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-[#4b2e2b]/60 uppercase">
                Suggestions
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-[#fce6ec] rounded-lg flex items-center gap-2 transition-colors"
                  data-testid={`suggestion-${index}`}
                >
                  <Search className="w-4 h-4 text-[#4b2e2b]/40" />
                  <span className="text-[#4b2e2b]">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending (show when no suggestions) */}
          {suggestions.length === 0 && trending.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-[#4b2e2b]/60 uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Searches
              </p>
              {trending.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.query)}
                  className="w-full text-left px-3 py-2 hover:bg-[#fce6ec] rounded-lg flex items-center justify-between transition-colors"
                  data-testid={`trending-${index}`}
                >
                  <span className="text-[#4b2e2b]">{item.query}</span>
                  <span className="text-xs text-[#4b2e2b]/40">{item.count} searches</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
