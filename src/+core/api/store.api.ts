import axiosInstance from './api.instance';
import { CreateStorePayload, UpdateStorePayload } from '@/types/store';

export const storeApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/store', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/store/detail/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  create: async (data: CreateStorePayload) => {
    try {
      const response = await axiosInstance.post('/store', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdateStorePayload) => {
    try {
      const response = await axiosInstance.patch(`/store/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default storeApi;
