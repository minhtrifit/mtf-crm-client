import { useEffect, useState } from 'react';
import productApi from '@/+core/api/product.api';

export const useGetProducts = (initialParams?: Record<string, any>) => {
  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async (fetchParams: Record<string, any>) => {
    try {
      setLoading(true);

      const response: any = await productApi.getProducts(fetchParams);

      console.log('Get products successfully:', response);

      setProducts(response?.data);
      setTotal(response?.data?.length);

      return true;
    } catch (err: any) {
      console.log('Get products failed:', err);

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
    data: products,
    fetchData,
    total,
    loading,
    error,
    params,
    setParams,
  };
};
