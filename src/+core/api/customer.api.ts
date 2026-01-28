import axiosInstance from './api.instance';
import { UpdateCustomerPayload } from '@/types/customer';

export const customerApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/customer', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/customer/${id}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdateCustomerPayload) => {
    try {
      const response = await axiosInstance.patch(`/customer/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default customerApi;
