import axiosInstance from './api.instance';
import { OrderPayload, UpdateOrderPayload } from '@/types/order';

export const orderApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/order', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/order/detail/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  getListByUserId: async (id: string, params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get(`/order/list-by-user-id/${id}`, {
        params,
      });

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
  update: async (id: string, data: UpdateOrderPayload) => {
    try {
      const response = await axiosInstance.patch(`/order/update-order/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default orderApi;
