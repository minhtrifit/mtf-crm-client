import axiosInstance from './api.instance';
import { CreateProductPayload, ProductReviewPayload, UpdateProductPayload } from '@/types/product';

export const productApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/product', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getWebsiteSearchList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/product/website-search', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getAll: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/product/all', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/product/detail/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  create: async (data: CreateProductPayload) => {
    try {
      const response = await axiosInstance.post('/product', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdateProductPayload) => {
    try {
      const response = await axiosInstance.patch(`/product/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  getShowcaseByCategorySlug: async (slug: string, params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get(`/product/showcase-by-category-slug/${slug}`, {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetailBySlug: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/product/detail-by-slug/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  getReviews: async (id: string, params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get(`/product/reviews/${id}`, {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  createReview: async (data: ProductReviewPayload) => {
    try {
      const response = await axiosInstance.post('/product/create-review', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default productApi;
