import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import orderApi from '@/+core/api/order.api';
import { Order } from '@/types/order';

export const useDetailOrder = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);

      const response: any = await orderApi.getDetail(id);

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
