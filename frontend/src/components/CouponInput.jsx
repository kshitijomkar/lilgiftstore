import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CouponInput({ cartTotal, onApply, onRemove, appliedCoupon }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateCoupon = async () => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to use coupons');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/coupons/validate`,
        {
          code: code.toUpperCase(),
          order_value: cartTotal
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onApply(response.data);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setCode('');
    onRemove();
    toast.info('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4" data-testid="applied-coupon">
        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">
              {appliedCoupon.coupon.code}
            </p>
            <p className="text-sm text-green-600">
              Saved ₹{appliedCoupon.discount_amount}
            </p>
          </div>
        </div>
        <button
          onClick={removeCoupon}
          className="text-green-600 hover:text-green-800 transition-colors"
          data-testid="remove-coupon"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="coupon-input">
      <label className="block text-sm font-medium text-[#4b2e2b]">Have a coupon code?</label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 border-[#f7c7d3] bg-white uppercase"
          data-testid="coupon-code-input"
        />
        <Button
          onClick={validateCoupon}
          disabled={loading || !code.trim()}
          className="bg-[#b96a82] hover:bg-[#a05670] text-white px-8"
          data-testid="apply-coupon"
        >
          {loading ? 'Validating...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}
