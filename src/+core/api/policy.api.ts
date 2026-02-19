import axiosInstance from './api.instance';
import { CreatePolicyPayload, UpdatePolicyPayload } from '@/types/policy';

export const policyApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/policy', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getShowcase: async () => {
    try {
      const response = await axiosInstance.get('/policy/showcase');

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/policy/detail/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDetailBySlug: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/policy/detail-by-slug/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
  create: async (data: CreatePolicyPayload) => {
    try {
      const response = await axiosInstance.post('/policy', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdatePolicyPayload) => {
    try {
      const response = await axiosInstance.patch(`/policy/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/policy/delete/${id}`);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default policyApi;
