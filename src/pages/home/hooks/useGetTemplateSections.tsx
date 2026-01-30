import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import websiteTemplateApi from '@/+core/api/website_template.api';
import { SectionType } from '@/types/website_template';

export const useGetTemplateSections = (id: string) => {
  const { t } = useTranslation();

  const [data, setData] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async (id: string) => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response: any = await websiteTemplateApi.getSections(id);

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
