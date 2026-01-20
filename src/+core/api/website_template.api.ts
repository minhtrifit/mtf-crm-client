import axiosInstance from './api.instance';
import {
  CreateWebsiteTemplatePayload,
  UpdateWebsiteTemplatePayload,
} from '@/types/website_template';

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
  getDetail: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/website-template/detail/${id}`);

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
  getSections: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/website-template/sections/${id}`);

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
  update: async (id: string, data: UpdateWebsiteTemplatePayload) => {
    try {
      const response = await axiosInstance.patch(`/website-template/edit/${id}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default websiteTemplateApi;
