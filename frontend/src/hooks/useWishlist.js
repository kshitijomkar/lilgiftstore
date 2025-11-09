import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data.items || []);
      setWishlistCount(response.data.count || 0);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Failed to fetch wishlist:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      return false;
    }

    try {
      await axios.post(
        `${API}/wishlist?product_id=${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Added to wishlist');
      fetchWishlist();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      await axios.delete(`${API}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Removed from wishlist');
      fetchWishlist();
      return true;
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return {
    wishlist,
    loading,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist
  };
}
