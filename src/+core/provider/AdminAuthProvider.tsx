import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setUser } from '@/store/actions/user.action';
import { UserRole, UserType } from '@/types/auth';
import authApi from '../api/auth.api';
import FullScreenLoading from '@/components/global/FullScreenLoading/FullScreenLoading';

const APP_KEY = import.meta.env.VITE_APP_KEY;

interface PropType {
  children: React.ReactNode;
}

const AdminAuthProvider = ({ children }: PropType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleGetUserProfile = async (token: string) => {
    try {
      const authRes = await authApi.getProfile(token);
      const userProfile = authRes?.data;

      if (!userProfile) {
        Cookies.remove(APP_KEY);
        return;
      }

      const authUser: UserType = {
        token,
        ...userProfile,
      };

      Cookies.set(APP_KEY, JSON.stringify(authUser), {
        expires: 7,
        path: '/',
      });

      dispatch(setUser(authUser));

      const { pathname, search } = location;
      const redirectPath = `${pathname}${search}`;

      const isAdmin = authUser.role === UserRole.ADMIN;
      const isAdminRoute = pathname.startsWith('/admin');

      /**
       * RULE:
       * admin + not /admin/* => redirect /admin
       */
      if (isAdmin && !isAdminRoute) {
        navigate('/admin', { replace: true });
        return;
      }

      navigate(redirectPath || '/', { replace: true });
    } catch (error) {
      Cookies.remove(APP_KEY);
      console.error('Lỗi lấy thông tin người dùng', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const session = Cookies.get(APP_KEY);

    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const token = parsedSession?.token;

        if (!token) {
          Cookies.remove(APP_KEY);
          setIsLoading(false);
          return;
        }

        handleGetUserProfile(token);
      } catch (error) {
        Cookies.remove(APP_KEY);
        console.error('Không thể parse session:', error);
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return <>{children}</>;
};

export default AdminAuthProvider;
