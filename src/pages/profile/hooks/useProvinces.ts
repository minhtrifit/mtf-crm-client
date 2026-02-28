import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import provinceApi from '@/+core/api/province.api';
import { Province } from '@/types/province.types';

export const useProvinces = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Province[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await provinceApi.getAllProvinces();
      setData(response);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || t('error');
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return {
    provinces: data,
    loading,
    error,
    refetch: fetchProvinces,
  };
};

export default useProvinces;
