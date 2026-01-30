import axiosInstance from './api.instance';
import { ProductReviewPayload } from '@/types/product';

export const reviewApi = {
  getReviews: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/product/reviews', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getReviewsByProduct: async (id: string, params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get(`/product/reviews/detail/${id}`, {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  checkIsReviewed: async (userId: string, productId: string) => {
    try {
      const response = await axiosInstance.get(`/product/reviews/check-is-reviewed/${productId}`, {
        params: {
          userId,
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  createReview: async (data: ProductReviewPayload) => {
    try {
      const response = await axiosInstance.post('/product/reviews/create', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/product/reviews/delete/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default reviewApi;
