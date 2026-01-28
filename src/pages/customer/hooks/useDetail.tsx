import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import customerApi from '@/+core/api/customer.api';
import { Customer } from '@/types/customer';

export const useDetail = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);

      const response: any = await customerApi.getDetail(id);

      setData(response?.data ?? null);

      return response?.data;
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
