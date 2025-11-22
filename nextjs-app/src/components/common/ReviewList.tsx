'use client';
import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReviewList({ productId }: any) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?product_id=${productId}&sort_by=${sortBy}&limit=20`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-[#4b2e2b]">Customer Reviews ({total})</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 border-[#f7c7d3] bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="rating_high">Highest Rating</SelectItem>
            <SelectItem value="rating_low">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#f7c7d3]/30">
          <p className="text-[#4b2e2b]/60">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white/60 backdrop-blur-sm border border-[#f7c7d3]/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-[#4b2e2b]">{review.title}</span>
                </div>
                <span className="text-sm text-[#4b2e2b]/60">{review.user_name}</span>
              </div>
              <p className="text-[#4b2e2b]/80 mb-3">{review.review_text}</p>
              <div className="flex items-center gap-4 text-sm text-[#4b2e2b]/60">
                <button className="flex items-center gap-1 hover:text-[#b96a82] transition">
                  <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful_count || 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
