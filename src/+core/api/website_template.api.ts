import axiosInstance from './api.instance';
import { CreateWebsiteTemplatePayload } from '@/types/website_template';

export const websiteTemplateApi = {
  getList: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/website-template', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getShowcase: async () => {
    try {
      const response = await axiosInstance.get('/website-template/showcase');

      return response;
    } catch (error) {
      throw error;
    }
  },
  create: async (data: CreateWebsiteTemplatePayload) => {
    try {
      const response = await axiosInstance.post('/website-template', data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default websiteTemplateApi;
