import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import notificationApi from '@/+core/api/notification.api';
import { UpdateNotificationPayload } from '@/types';

export const useEditNotification = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (id: string, payload: UpdateNotificationPayload) => {
    try {
      setLoading(true);

      const response: any = await notificationApi.update(id, payload);

      return {
        success: true,
        data: response?.data?.data,
        message: response?.data?.message,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        message: err.response.data.message || t('error'),
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
