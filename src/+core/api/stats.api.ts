import axiosInstance from './api.instance';

export const statsApi = {
  getTotal: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/stats/total', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getOverview: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/stats/overview', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getDeliveryStatus: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/stats/delivery-status', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getTopSellingProducts: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/stats/top-selling-products', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getRecentOrders: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/stats/recent-orders', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default statsApi;
