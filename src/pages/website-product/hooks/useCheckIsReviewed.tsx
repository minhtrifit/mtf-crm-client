import { useEffect, useState } from 'react';
import reviewApi from '@/+core/api/review.api';

export const useCheckIsReviewed = (userId?: string, productId?: string) => {
  const [isReviewed, setIsReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const checkReviewed = async (userId: string, productId: string) => {
    try {
      setLoading(true);
      const res = await reviewApi.checkIsReviewed(userId, productId);

      setIsReviewed(res?.data?.data ?? false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !productId) return;

    checkReviewed(userId, productId);
  }, [userId, productId]);

  return {
    isReviewed,
    loading,
    error,
    checkReviewed,
  };
};
