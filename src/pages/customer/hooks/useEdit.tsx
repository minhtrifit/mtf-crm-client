import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import customerApi from '@/+core/api/customer.api';
import { UpdateCustomerPayload } from '@/types/customer';

export const useEdit = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (id: string, payload: UpdateCustomerPayload) => {
    try {
      setLoading(true);

      const response: any = await customerApi.update(id, payload);

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
