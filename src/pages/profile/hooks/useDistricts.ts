import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import provinceApi from '@/+core/api/province.api';
import { District } from '@/types/province.types';

export const useDistricts = (provinceCode: string | null) => {
  const { t } = useTranslation();
  const [data, setData] = useState<District[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistricts = useCallback(async () => {
    if (!provinceCode) {
      setData([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const response = await provinceApi.getDistrictsByProvince(provinceCode);
      setData(response);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || t('error');
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [provinceCode, t]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  return {
    districts: data,
    loading,
    error,
    refetch: fetchDistricts,
  };
};

export default useDistricts;
