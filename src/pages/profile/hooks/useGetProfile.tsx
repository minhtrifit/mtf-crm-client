import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import userApi from '@/+core/api/user.api';
import { UserType } from '@/types/auth';

export const useGetProfile = (id: string) => {
  const { t } = useTranslation();

  const [data, setData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);

      const response: any = await userApi.getDetail(id);

      setData(response?.data ?? null);

      return response?.data?.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  return {
    data,
    fetchData,
    loading,
    error,
  };
};
