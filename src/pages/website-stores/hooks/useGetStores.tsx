import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import storeApi from '@/+core/api/store.api';
import { Store } from '@/types/store';
import { sleep } from '@/+core/helpers';

export const useGetStores = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      await sleep(500);

      const response: any = await storeApi.getWebsiteList();

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
    fetchData();
  }, []);

  return {
    data,
    fetchData,
    loading,
    error,
  };
};
