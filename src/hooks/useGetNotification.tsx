import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import notificationApi from '@/+core/api/notification.api';
import { INotification } from '@/types';

export const useGetNotification = (initialParams?: Record<string, any>) => {
  const { t } = useTranslation();

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    try {
      setLoading(true);

      const response: any = await notificationApi.getList(fetchParams);

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
    setParams,
  };
};
