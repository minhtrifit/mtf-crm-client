import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import productApi from '@/+core/api/product.api';
import { Product } from '@/types/product';

type UseDetailOptions = {
  delayLoading?: boolean;
  delayTime?: number;
};

export const useDetail = (id: string, options?: UseDetailOptions) => {
  const { t } = useTranslation();

  const { delayLoading = true, delayTime = 1000 } = options || {};

  const requestIdRef = useRef(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchId: string) => {
    const requestId = ++requestIdRef.current;

    try {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      setLoading(true);

      const response: any = await productApi.getDetailBySlug(fetchId);

      if (requestId !== requestIdRef.current) {
        return false;
      }

      setData(response?.data?.data ?? null);
      return response?.data?.data ?? null;
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
    fetchData(id);
  }, [id]);

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
    loading,
    error,
  };
};
