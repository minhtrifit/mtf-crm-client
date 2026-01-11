import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { persistor } from '@/store/store';
import { WEBSITE_ROUTE } from '@/routes/route.constant';

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

export const formatCurrency = (
  value?: number | string,
  locale: string = 'vi-VN',
  currency: string = 'VND',
): string => {
  const number = Number(value);

  if (!Number.isFinite(number)) return '';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(number);
};
