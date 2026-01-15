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
};

export default paymentApi;
