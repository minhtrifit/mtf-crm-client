import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import productApi from '@/+core/api/product.api';
import { SearchKeyword } from '@/types/product';

export const useGetKeywords = (initialParams?: Record<string, any>) => {
  const { t } = useTranslation();

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<SearchKeyword[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    try {
      setLoading(true);

      const response: any = await productApi.getSearchKeywords(fetchParams);

      setData(response?.data?.data ?? []);
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
    setData,
    setParams,
  };
};
