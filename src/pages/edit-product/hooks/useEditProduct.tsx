import { useState } from 'react';
import axiosInstance from '@/+core/api/api.instance';

type ProductPayload = {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

type UpdateProductPayload = Partial<ProductPayload>;

export const useEditProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateProduct = async (id: string, data: UpdateProductPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/products/${id}`, data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProduct,
    loading,
    error,
  };
};
