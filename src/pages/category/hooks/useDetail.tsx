import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import categoryApi from '@/+core/api/category.api';
import { Category } from '@/types/category';

export const useDetail = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);

      const response: any = await categoryApi.getDetail(id);

      setData(response.data.data ?? null);

      return response.data.data;
    } catch (err: any) {
      setError(err.response.data.message || t('error'));

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    fetchData,
    loading,
    error,
  };
};
