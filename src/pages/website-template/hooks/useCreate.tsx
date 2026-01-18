import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import websiteTemplateApi from '@/+core/api/website_template.api';
import { CreateWebsiteTemplatePayload } from '@/types/website_template';

export const useCreate = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (payload: CreateWebsiteTemplatePayload) => {
    try {
      setLoading(true);

      const response: any = await websiteTemplateApi.create(payload);

      return {
        success: true,
        data: response?.data?.data,
        message: response?.data?.message,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err?.response?.data?.message || t('error'),
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
  };
};
