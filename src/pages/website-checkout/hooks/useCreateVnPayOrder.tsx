import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import orderApi from '@/+core/api/order.api';
import { OrderPayload } from '@/types/order';

export const useCreateVnPayOrder = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (payload: OrderPayload) => {
    try {
      setLoading(true);

      const response: any = await orderApi.createVnPay(payload);

      return {
        success: true,
        data: response?.data?.data,
        message: response?.data?.message,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err?.response?.data?.message || t('error'),
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
  };
};
