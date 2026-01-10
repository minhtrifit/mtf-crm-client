import { useEffect, useState } from 'react';
import productApi from '@/+core/api/product.api';

export const useGetDetailProduct = (id: string, initialParams?: Record<string, any>) => {
  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    try {
      setLoading(true);

      const response: any = await productApi.getProductById(id, fetchParams);

      console.log('Get detail product successfully:', response);

      setProduct(response?.data);

      return true;
    } catch (err: any) {
      console.log('Get detail product failed:', err);

      setError(err.message || 'Lỗi không xác định');

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(params);
  }, [JSON.stringify(params)]);

  return {
    data: product,
    fetchData,
    loading,
    error,
    params,
    setParams,
  };
};
