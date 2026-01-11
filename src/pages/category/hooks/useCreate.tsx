import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import categoryApi from '@/+core/api/category.api';
import { CreateCategoryPayload } from '@/types/category';

export const useCreate = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (payload: CreateCategoryPayload) => {
    try {
      setLoading(true);

      const response: any = await categoryApi.create(payload);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
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
