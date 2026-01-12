import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import categoryApi from '@/+core/api/category.api';
import { Category } from '@/types/category';

export const useDetailCategory = (slug: string) => {
  const { t } = useTranslation();

  const [data, setData] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (slug: string) => {
    try {
      setLoading(true);

      const response: any = await categoryApi.getDetailBySlug(slug);

      setData(response?.data?.data ?? null);

      return response?.data?.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(slug);
  }, []);

  return {
    data,
    fetchData,
    loading,
    error,
  };
};
