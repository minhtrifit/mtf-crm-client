import { OrderPayload } from '@/types/order';
import axiosInstance from './api.instance';

export const orderApi = {
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/order/detail/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  createCod: async (data: OrderPayload) => {
    try {
      const response = await axiosInstance.post('/order/create-cod-order', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  createVnPay: async (data: OrderPayload) => {
    try {
      const response = await axiosInstance.post('/order/create-vnpay-order', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default orderApi;
