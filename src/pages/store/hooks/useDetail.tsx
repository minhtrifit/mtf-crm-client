import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import storeApi from '@/+core/api/store.api';
import { Store } from '@/types/store';

export const useDetail = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<Store | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);

      const response: any = await storeApi.getDetail(id);

      setData(response?.data?.data ?? null);

      return response?.data?.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));

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
