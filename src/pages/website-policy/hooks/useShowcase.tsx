import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import policyApi from '@/+core/api/policy.api';
import { Policy } from '@/types/policy';

export const useGetShowcasePolicy = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response: any = await policyApi.getShowcase();

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
