import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import paymentApi from '@/+core/api/payment.api';
import { UpdatePaymentPayload } from '@/types/payment';

export const useEdit = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (id: string, payload: UpdatePaymentPayload) => {
    try {
      setLoading(true);

      const response: any = await paymentApi.update(id, payload);

      return {
        success: true,
        data: response?.data?.data,
        message: response?.data?.message,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err.response.data.message || t('error'),
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
