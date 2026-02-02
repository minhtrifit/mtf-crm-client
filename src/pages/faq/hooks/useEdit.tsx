import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import faqApi from '@/+core/api/faq.api';
import { UpdateFaqPayload } from '@/types/faq';

export const useEdit = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (id: string, payload: UpdateFaqPayload) => {
    try {
      setLoading(true);

      const response: any = await faqApi.update(id, payload);

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
