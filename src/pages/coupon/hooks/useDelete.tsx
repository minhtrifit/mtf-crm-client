import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import couponApi from '@/+core/api/coupon.api';

export const useDelete = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const mutate = async (id: string) => {
    try {
      setLoading(true);
      const response = await couponApi.delete(id);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || t('error'),
      };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading };
};
