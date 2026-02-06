import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import storeApi from '@/+core/api/store.api';
import { Store } from '@/types/store';

export const useSearchList = (initialParams?: Record<string, any>) => {
  const { t } = useTranslation();

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<Store[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    try {
      setLoading(true);

      const response: any = await storeApi.getSearchList(fetchParams);

      setData(response?.data?.data?.data ?? []);
      setTotal(response?.data?.data?.total ?? 0);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    total,
    fetchData,
    loading,
    error,
    params,
    setData,
    setTotal,
    setParams,
  };
};
