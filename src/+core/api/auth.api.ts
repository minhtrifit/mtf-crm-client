import axiosInstance from './api.instance';
import { LoginPayload } from '@/types/auth';

export const authApi = {
  login: async (data: LoginPayload) => {
    try {
      const response = await axiosInstance.post('/auth/login', data);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async (token: string) => {
    try {
      const response = await axiosInstance.get(`/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;
