import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import userApi from '@/+core/api/user.api';
import { UserType } from '@/types/auth';
import { PagingType } from '@/types';

export const useList = (initialParams?: Record<string, any>) => {
  const { t } = useTranslation();

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<UserType[]>([]);
  const [paging, setPaging] = useState<PagingType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    try {
      setLoading(true);

      const response: any = await userApi.getList(fetchParams);

      setData(response?.data?.data?.data ?? []);
      setPaging(response?.data?.data?.paging ?? null);

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
    paging,
    loading,
    error,
    params,
    setParams,
  };
};
