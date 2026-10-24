import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import couponApi from '@/+core/api/coupon.api';
import { PagingType } from '@/types';
import { Coupon } from '@/types/coupon';

export const useList = (initialParams?: Record<string, string | number | boolean>) => {
  const { t } = useTranslation();
  const [params, setParams] = useState(initialParams ?? {});
  const [data, setData] = useState<Coupon[]>([]);
  const [paging, setPaging] = useState<PagingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchData = async (fetchParams: Record<string, string | number | boolean>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await couponApi.getList(fetchParams);
      setData(response.data?.data?.data ?? []);
      setPaging(response.data?.data?.paging ?? null);
      return true;
    } catch (fetchError: any) {
      setError(fetchError?.response?.data?.message || t('error'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData(params);
  }, [JSON.stringify(params)]);

  return { data, paging, loading, error, params, setParams, fetchData };
};
