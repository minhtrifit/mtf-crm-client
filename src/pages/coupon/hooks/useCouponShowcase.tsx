import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import couponApi from '@/+core/api/coupon.api';
import { PublicCoupon } from '@/types/coupon';

export const useCouponShowcase = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<PublicCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await couponApi.getPublicList();
      setData(response.data?.data ?? []);
      return true;
    } catch (fetchError: any) {
      setError(fetchError?.response?.data?.message || t('error'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, fetchData };
};
