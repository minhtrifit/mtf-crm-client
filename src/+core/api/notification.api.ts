import axiosInstance from './api.instance';
import { UpdateNotificationPayload } from '@/types';

export const notificationApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/notification', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  update: async (id: string, data: UpdateNotificationPayload) => {
    try {
      const response = await axiosInstance.patch(`/notification/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default notificationApi;
