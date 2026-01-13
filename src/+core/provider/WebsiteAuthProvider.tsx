import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearUser, setUser } from '@/store/actions/user.action';
import { clearCart } from '@/store/actions/cart.action';
import { persistor } from '@/store/store';
import { UserRole, UserType } from '@/types/auth';
import authApi from '../api/auth.api';
import { WEBSITE_ROUTE } from '@/routes/route.constant';

const APP_KEY = import.meta.env.VITE_APP_KEY;

interface PropType {
  children: React.ReactNode;
}

const WebsiteAuthProvider = ({ children }: PropType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
      const isAuthPage = pathname === WEBSITE_ROUTE.LOGIN || pathname === WEBSITE_ROUTE.REGISTER;

      /**
       * RULE:
       * admin + not /admin/* => redirect /admin
       */
      if (isAdmin && !isAdminRoute) {
        navigate('/admin', { replace: true });
        return;
      }

      /**
       * RULE:
       * user + /login | /register => redirect /
       */
      if (!isAdmin && isAuthPage) {
        navigate('/', { replace: true });
        return;
      }

      navigate(redirectPath || '/', { replace: true });
    } catch (error) {
      Cookies.remove(APP_KEY);
      console.error('Lỗi lấy thông tin người dùng', error);
    }
  };

  const handleClearStore = async () => {
    dispatch(clearUser());
    dispatch(clearCart());

    await persistor.purge();

    console.log('CLEAR STORE');
  };

  useEffect(() => {
    const session = Cookies.get(APP_KEY);

    if (!session) {
      handleClearStore();
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      const token = parsedSession?.token;

      if (!token) {
        Cookies.remove(APP_KEY);
        return;
      }

      handleGetUserProfile(token);
    } catch (error) {
      Cookies.remove(APP_KEY);
      console.error('Không thể parse session:', error);
    }
  }, []);

  return <>{children}</>;
};

export default WebsiteAuthProvider;
