'use client';
import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';

export default function AvailableCoupons({ onSelect }: any) {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`/api/coupons`);
      const data = await res.json();
      setCoupons(data || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || coupons.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6 border border-[#f7c7d3]/30">
      <h3 className="font-semibold text-[#4b2e2b] mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-[#b96a82]" />
        Available Offers
      </h3>
      <div className="space-y-3">
        {coupons.map((coupon: any) => (
          <div
            key={coupon.code}
            className="bg-white rounded-xl p-4 border border-pink-200 cursor-pointer hover:border-[#b96a82] hover:shadow-md transition-all"
            onClick={() => onSelect(coupon.code)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-mono font-bold text-[#b96a82] text-lg">{coupon.code}</p>
                <p className="text-sm text-[#4b2e2b]/70">
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  {coupon.min_order_value > 0 && ` on orders above ₹${coupon.min_order_value}`}
                </p>
              </div>
              <button className="text-[#b96a82] font-medium text-sm hover:text-[#a05670]">APPLY</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
