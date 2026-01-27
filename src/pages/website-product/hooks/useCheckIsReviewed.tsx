import { useEffect, useState } from 'react';
import productApi from '@/+core/api/product.api';

export const useCheckIsReviewed = (userId?: string, productId?: string) => {
  const [isReviewed, setIsReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!userId || !productId) return;

    const checkReviewed = async () => {
      try {
        setLoading(true);
        const res = await productApi.checkIsReviewed(userId, productId);

        setIsReviewed(res?.data?.data ?? false);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkReviewed();
  }, [userId, productId]);

  return {
    isReviewed,
    loading,
    error,
  };
};
