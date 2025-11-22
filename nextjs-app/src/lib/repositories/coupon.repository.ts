import { BaseRepository } from './base.repository';

interface Coupon {
  id?: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  max_uses?: number;
  current_uses?: number;
  expiry_date?: Date;
  active: boolean;
  created_at?: Date;
}

export class CouponRepository extends BaseRepository<Coupon> {
  constructor() {
    super('coupons');
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.findOne({ code: code.toUpperCase() });
  }

  async getActiveCoupons(): Promise<Coupon[]> {
    return this.findAll({
      active: true,
      expiry_date: { $gt: new Date() },
    });
  }
}
