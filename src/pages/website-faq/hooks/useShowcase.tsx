import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import faqApi from '@/+core/api/faq.api';
import { Faq } from '@/types/faq';

export const useGetShowcaseFaq = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<Faq[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response: any = await faqApi.getShowcase();

      setData(response?.data?.data?.data ?? []);

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    fetchData,
    loading,
    error,
  };
};
