import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AvailableCoupons({ onSelect }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API}/coupons/active`);
      setCoupons(response.data || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || coupons.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6 border border-[#f7c7d3]/30" data-testid="available-coupons">
      <h3 className="font-semibold text-[#4b2e2b] mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-[#b96a82]" />
        Available Offers
      </h3>
      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-xl p-4 border border-pink-200 cursor-pointer hover:border-[#b96a82] hover:shadow-md transition-all"
            onClick={() => onSelect(coupon.code)}
            data-testid={`coupon-${coupon.code}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-mono font-bold text-[#b96a82] text-lg">
                  {coupon.code}
                </p>
                <p className="text-sm text-[#4b2e2b]/70">
                  {coupon.type === 'percentage'
                    ? `${coupon.value}% OFF`
                    : coupon.type === 'fixed'
                    ? `₹${coupon.value} OFF`
                    : 'FREE SHIPPING'}
                  {coupon.min_order_value > 0 &&
                    ` on orders above ₹${coupon.min_order_value}`}
                </p>
              </div>
              <button className="text-[#b96a82] font-medium text-sm hover:text-[#a05670] transition-colors">
                APPLY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
