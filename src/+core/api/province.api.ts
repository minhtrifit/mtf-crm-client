import axiosInstance from './api.instance';
import { Province, District } from '@/types/province.types';

export const provinceApi = {
  // Lấy tất cả tỉnh/thành phố
  getAllProvinces: async (): Promise<Province[]> => {
    try {
      const response = await axiosInstance.get('/provinces');
      return response.data?.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách quận/huyện theo mã tỉnh
  getDistrictsByProvince: async (provinceCode: string): Promise<District[]> => {
    try {
      const response = await axiosInstance.get(`/provinces/${provinceCode}/districts`);
      return response.data?.data || [];
    } catch (error) {
      throw error;
    }
  },
};

export default provinceApi;
