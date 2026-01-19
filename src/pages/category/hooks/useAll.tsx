import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import categoryApi from '@/+core/api/category.api';
import { Category } from '@/types/category';

export const useGetAll = (initialParams?: Record<string, any>) => {
  const { t } = useTranslation();

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    try {
      setLoading(true);

      const response: any = await categoryApi.getAll(fetchParams);

      setData(response?.data?.data?.data ?? []);

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(params);
  }, [JSON.stringify(params)]);

  return {
    data,
    fetchData,
    loading,
    error,
    params,
    setParams,
  };
};
