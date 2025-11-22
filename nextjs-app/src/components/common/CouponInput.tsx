'use client';
import { useState, useEffect } from 'react';
import { Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CouponInput({ cartTotal, onApply, onRemove, appliedCoupon }: any) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
  }, []);

  const validateCoupon = async () => {
    if (!code.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    if (!token) {
      alert('Please login to use coupons');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code.toUpperCase(), order_value: cartTotal }),
      });
      const data = await res.json();
      if (res.ok) {
        onApply(data);
        alert('Coupon applied successfully!');
      } else {
        alert(data.error || 'Invalid coupon');
      }
    } catch (error) {
      alert('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setCode('');
    onRemove();
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">{appliedCoupon.code}</p>
            <p className="text-sm text-green-600">Saved ₹{appliedCoupon.discount}</p>
          </div>
        </div>
        <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#4b2e2b]">Have a coupon code?</label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 border-[#f7c7d3] bg-white uppercase"
        />
        <Button
          onClick={validateCoupon}
          disabled={loading || !code.trim()}
          className="bg-[#b96a82] hover:bg-[#a05670] text-white px-8"
        >
          {loading ? 'Validating...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}
