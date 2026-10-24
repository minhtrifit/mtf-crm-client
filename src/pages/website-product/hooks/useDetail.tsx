import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import productApi from '@/+core/api/product.api';
import { Product } from '@/types/product';
import { sleep } from '@/+core/helpers';

export const useDetail = (id: string) => {
  const { t } = useTranslation();

  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchId: string) => {
    try {
      setLoading(true);
      await sleep(500);
      const response: any = await productApi.getDetailBySlug(fetchId);
      setData(response?.data?.data ?? null);
      return response?.data?.data ?? null;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return {
    data,
    fetchData,
    loading,
    error,
  };
};
