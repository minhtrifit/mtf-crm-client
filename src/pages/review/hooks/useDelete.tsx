import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import reviewApi from '@/+core/api/review.api';

export const useDelete = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (id: string) => {
    try {
      setLoading(true);

      const response: any = await reviewApi.delete(id);

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
