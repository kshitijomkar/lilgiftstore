import { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to write a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API}/products/${productId}/reviews`,
        { 
          product_id: productId,
          rating, 
          title, 
          review_text: reviewText 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setTitle('');
      setReviewText('');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#f7c7d3]/30" data-testid="review-form">
      <h3 className="text-xl font-semibold text-[#4b2e2b] mb-4">Write a Review</h3>
      
      <div>
        <label className="block text-sm font-medium text-[#4b2e2b] mb-2">Your Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition-all ${
                star <= (hover || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              data-testid={`star-${star}`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4b2e2b] mb-2">Review Title *</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-[#f7c7d3] bg-white"
          placeholder="Summarize your experience"
          required
          data-testid="review-title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4b2e2b] mb-2">Your Review *</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full px-3 py-2 border border-[#f7c7d3] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#b96a82]"
          rows="4"
          placeholder="Share your thoughts about this product"
          required
          data-testid="review-text"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#b96a82] hover:bg-[#a05670] text-white py-6 rounded-full shadow-lg transition-all"
        data-testid="submit-review"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
