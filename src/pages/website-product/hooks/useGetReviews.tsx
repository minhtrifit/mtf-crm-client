import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import reviewApi from '@/+core/api/review.api';
import { ProductReview } from '@/types/product';
import { sleep } from '@/+core/helpers';

export const useGetReviews = (productId: string, initialParams?: Record<string, any>) => {
  const { t } = useTranslation();

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<ProductReview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchProductId: string, fetchParams: Record<string, any>) => {
    try {
      setLoading(true);
      await sleep(500);
      const response: any = await reviewApi.getReviewsByProduct(fetchProductId, fetchParams);
      setData(response?.data?.data ?? null);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(productId, params);
  }, [productId, params]);

  return {
    data,
    fetchData,
    loading,
    error,
    params,
    setParams,
  };
};
