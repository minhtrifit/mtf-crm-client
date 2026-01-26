import axiosInstance from './api.instance';
import { UpdatePayload } from '@/types/auth';

export const userApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/users', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getSearchList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/users/search', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/users/profile/${id}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProfile: async (id: string, data: UpdatePayload) => {
    try {
      const response = await axiosInstance.patch(`/users/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;
