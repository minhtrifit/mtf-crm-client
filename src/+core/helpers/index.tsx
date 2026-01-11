import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { persistor } from '@/store/store';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { RcFile, UploadFile } from 'antd/es/upload';

const APP_KEY = import.meta.env.VITE_APP_KEY;

export const formatDateTime = (value?: string): string => {
  if (!value) return '';

  const date = dayjs(value);

  if (!date.isValid()) return '';

  return date.format('DD/MM/YYYY HH:mm:ss');
};

export const forceLogout = async () => {
  Cookies.remove(APP_KEY);
  await persistor.purge();
  window.location.href = WEBSITE_ROUTE.HOME;
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
