import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import reviewApi from '@/+core/api/review.api';
import { ProductReview } from '@/types/product';

type UseGetReviewsOptions = {
  delayLoading?: boolean;
  delayTime?: number;
};

export const useGetReviews = (
  productId: string,
  initialParams?: Record<string, any>,
  options?: UseGetReviewsOptions,
) => {
  const { t } = useTranslation();

  const { delayLoading = true, delayTime = 1000 } = options || {};

  const requestIdRef = useRef(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [data, setData] = useState<ProductReview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchProductId: string, fetchParams: Record<string, any>) => {
    const requestId = ++requestIdRef.current;

    try {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      setLoading(true);

      const response: any = await reviewApi.getReviewsByProduct(fetchProductId, fetchParams);

      if (requestId !== requestIdRef.current) {
        return false;
      }

      setData(response?.data?.data ?? null);

      return true;
    } catch (err: any) {
      if (requestId === requestIdRef.current) {
        setError(err?.response?.data?.message || t('error'));
      }
      return false;
    } finally {
      if (requestId === requestIdRef.current) {
        if (delayLoading) {
          loadingTimeoutRef.current = setTimeout(() => {
            setLoading(false);
          }, delayTime);
        } else {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchData(productId, params);
  }, [productId, params]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    fetchData,
    loading,
    error,
    params,
    setParams,
  };
};
