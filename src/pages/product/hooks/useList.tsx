import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import productApi from '@/+core/api/product.api';
import { Product } from '@/types/product';
import { PagingType } from '@/types';

type UseListOptions = {
  delayLoading?: boolean;
  delayTime?: number;
};

export const useList = (initialParams?: Record<string, any>, options?: UseListOptions) => {
  const { t } = useTranslation();

  const { delayLoading = false, delayTime = 1000 } = options || {};

  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<Product[]>([]);
  const [paging, setPaging] = useState<PagingType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    const requestId = ++requestIdRef.current;

    try {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      setLoading(true);

      const response: any = await productApi.getList(fetchParams);

      if (requestId !== requestIdRef.current) {
        return false;
      }

      setData(response?.data?.data?.data ?? []);
      setPaging(response?.data?.data?.paging ?? null);

      return true;
    } catch (err: any) {
      if (requestId === requestIdRef.current) {
        setError(err?.response?.data?.message || t('error'));
      }

      return false;
    } finally {
      if (requestId === requestIdRef.current) {
        if (delayLoading) {
          loadingTimeoutRef.current = setTimeout(() => {
            setLoading(false);
          }, delayTime);
        } else {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchData(params);
  }, [params]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

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
