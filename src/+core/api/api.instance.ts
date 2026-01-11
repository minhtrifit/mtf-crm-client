import axios from 'axios';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { forceLogout } from '../helpers';

const APP_KEY = import.meta.env.VITE_APP_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const session = Cookies.get(APP_KEY);
    const language = localStorage.getItem('i18nextLng') || 'vi';

    config.headers['Accept-Language'] = language;

    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const token = parsedSession?.token;

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Không thể parse session:', error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const resMessage = error.response.data.message;

    let content = 'Something wrong';

    if (Array.isArray(resMessage)) {
      // Nếu là mảng object { field, message }
      if (resMessage.every((item) => typeof item === 'object' && 'message' in item)) {
        content = resMessage.map((item) => item.message).join(', ');
      } else {
        // Nếu là mảng string
        content = resMessage.join(', ');
      }
    } else if (typeof resMessage === 'string') {
      content = resMessage;
    }

    message.error({
      content: content,
      duration: 1.5,
      onClose: () => {
        if (error.response.status === 401) {
          forceLogout();
        }
      },
    });

    console.log(error.response);

    // Xử lý lỗi chung
    return Promise.reject(error);
  },
);

export default axiosInstance;
