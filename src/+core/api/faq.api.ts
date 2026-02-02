import axiosInstance from './api.instance';
import { CreateFaqPayload, UpdateFaqPayload } from '@/types/faq';

export const faqApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/faq', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getShowcase: async () => {
    try {
      const response = await axiosInstance.get('/faq/showcase');

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/faq/detail/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  create: async (data: CreateFaqPayload) => {
    try {
      const response = await axiosInstance.post('/faq', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdateFaqPayload) => {
    try {
      const response = await axiosInstance.patch(`/faq/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/faq/delete/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default faqApi;
