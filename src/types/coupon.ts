export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: DiscountType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  startsAt: string;
  expiresAt: string;
  usageLimit: number | null;
  perUserLimit: number;
  isActive: boolean;
  isPublic: boolean;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponPayload {
  code: string;
  description: string | null;
  type: DiscountType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  startsAt: string;
  expiresAt: string;
  usageLimit: number | null;
  perUserLimit: number;
  isActive: boolean;
  isPublic: boolean;
}

export type UpdateCouponPayload = Partial<CouponPayload>;

export type PublicCoupon = Pick<
  Coupon,
  | 'id'
  | 'code'
  | 'description'
  | 'type'
  | 'value'
  | 'minOrderAmount'
  | 'maxDiscountAmount'
  | 'startsAt'
  | 'expiresAt'
>;
