import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import websiteTemplateApi from '@/+core/api/website_template.api';
import { WebsiteTemplate } from '@/types/website_template';

export const useDetail = (id: string) => {
  const { t } = useTranslation();

  const [data, setData] = useState<WebsiteTemplate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);

      const response: any = await websiteTemplateApi.getDetail(id);

      setData(response?.data?.data ?? null);

      return response?.data?.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || t('error'));

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, []);

  return {
    data,
    fetchData,
    loading,
    error,
  };
};
