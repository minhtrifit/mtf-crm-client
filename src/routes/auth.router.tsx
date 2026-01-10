import AuthLayout from '@/components/global/layout/AuthLayout';
import { WEBSITE_ROUTE } from './route.constant';
import LoginPage from '@/pages/login';
import { ForbiddenPage } from '@/pages/forbidden';

export const authRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: WEBSITE_ROUTE.LOGIN,
      element: <LoginPage />,
    },
    {
      path: WEBSITE_ROUTE.FORBIDDEN,
      element: <ForbiddenPage />,
    },
  ],
};
