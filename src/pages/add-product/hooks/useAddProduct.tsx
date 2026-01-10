import { useState } from 'react';
import axiosInstance from '@/+core/api/api.instance';

type ProductPayload = {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

export const useAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const addProduct = async (data: ProductPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/products', data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addProduct,
    loading,
    error,
  };
};
