import { PaymentPayload, UpdatePaymentPayload } from '@/types/payment';
import axiosInstance from './api.instance';

export const paymentApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/payment', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/payment/detail/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  create: async (data: PaymentPayload) => {
    try {
      const response = await axiosInstance.post('/payment', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdatePaymentPayload) => {
    try {
      const response = await axiosInstance.patch(`/payment/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentApi;
