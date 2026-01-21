import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdatePayload } from '@/types/auth';
import userApi from '@/+core/api/user.api';

export const useUpdateProfile = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (id: string, payload: UpdatePayload) => {
    try {
      setLoading(true);

      const response: any = await userApi.updateProfile(id, payload);

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
