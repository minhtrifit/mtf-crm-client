import axiosInstance from './api.instance';
import { CouponPayload, PublicCoupon, UpdateCouponPayload } from '@/types/coupon';

export interface ApplyCouponPayload {
  code: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface AppliedCoupon {
  coupon: {
    id: string;
    code: string;
    description: string | null;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
  };
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
}

export const couponApi = {
  getPublicList: async () => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: PublicCoupon[];
      message: string;
    }>('/coupon/public');
    return response;
  },
  getList: async (params?: Record<string, string | number | boolean>) => {
    const response = await axiosInstance.get('/coupon', { params });
    return response;
  },
  getDetail: async (id: string) => {
    const response = await axiosInstance.get(`/coupon/detail/${id}`);
    return response;
  },
  create: async (payload: CouponPayload) => {
    const response = await axiosInstance.post('/coupon', payload);
    return response;
  },
  update: async (id: string, payload: UpdateCouponPayload) => {
    const response = await axiosInstance.patch(`/coupon/edit/${id}`, payload);
    return response;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/coupon/delete/${id}`);
    return response;
  },
  apply: async (payload: ApplyCouponPayload) => {
    try {
      const response = await axiosInstance.post('/coupon/apply', payload);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default couponApi;
