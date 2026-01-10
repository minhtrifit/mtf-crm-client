import AdminLayout from '@/components/global/layout/AdminLayout';
import { ADMIN_ROUTE } from './route.constant';
import DashboardPage from '@/pages/dashboard/DashboardPage';

export const adminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <DashboardPage />,
    },
    {
      path: ADMIN_ROUTE.USER,
      children: [
        { index: true, element: <div>User list page</div> },
        { path: ADMIN_ROUTE.USER_ADD, element: <div>User add page</div> },
        { path: ADMIN_ROUTE.USER_DETAIL, element: <div>User detail page</div> },
        { path: ADMIN_ROUTE.USER_EDIT, element: <div>User edit page</div> },
      ],
    },
  ],
};
