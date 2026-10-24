import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import couponApi from '@/+core/api/coupon.api';
import { Coupon } from '@/types/coupon';

export const useDetail = (id: string) => {
  const { t } = useTranslation();
  const [data, setData] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (couponId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await couponApi.getDetail(couponId);
      setData(response.data.data ?? null);
      return response.data.data;
    } catch (fetchError: any) {
      setError(fetchError?.response?.data?.message || t('error'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData(id);
  }, [id]);

  return { data, fetchData, loading, error };
};
