import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { persistor } from '@/store/store';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { PaymentMethod } from '../constants/commons.constant';

const APP_KEY = import.meta.env.VITE_APP_KEY;

dayjs.extend(utc);
dayjs.extend(timezone);

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

export const generateSlug = (text: string): string => {
  if (!text) return '';

  return (
    text
      .toLowerCase()
      .trim()
      // bỏ dấu tiếng Việt
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // đ -> d
      .replace(/đ/g, 'd')
      // ký tự đặc biệt -> -
      .replace(/[^a-z0-9\s-]/g, '')
      // khoảng trắng & nhiều dấu - -> 1 dấu -
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      // bỏ - ở đầu & cuối
      .replace(/^-+|-+$/g, '')
  );
};

export const isValidPaymentMethod = (value: any): value is PaymentMethod => {
  return Object.values(PaymentMethod).includes(value);
};

export const formatTimezone = (value?: string) => {
  if (!value || !dayjs(value).isValid()) return '';

  return dayjs.utc(value).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
};
