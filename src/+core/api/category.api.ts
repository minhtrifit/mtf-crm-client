import axiosInstance from './api.instance';
import { CreateCategoryPayload, UpdateCategoryPayload } from '@/types/category';

export const categoryApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/category', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/category/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  create: async (data: CreateCategoryPayload) => {
    try {
      const response = await axiosInstance.post('/category', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdateCategoryPayload) => {
    try {
      const response = await axiosInstance.patch(`/category/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default categoryApi;
