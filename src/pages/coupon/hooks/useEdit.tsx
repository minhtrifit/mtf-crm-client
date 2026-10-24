import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import couponApi from '@/+core/api/coupon.api';
import { UpdateCouponPayload } from '@/types/coupon';

export const useEdit = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const mutate = async (id: string, payload: UpdateCouponPayload) => {
    try {
      setLoading(true);
      const response = await couponApi.update(id, payload);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error?.response?.data?.message || t('error'),
      };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading };
};
