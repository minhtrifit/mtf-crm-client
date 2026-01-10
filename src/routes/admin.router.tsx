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
      path: ADMIN_ROUTE.CATEGORY,
      children: [
        { index: true, element: <div>Category list page</div> },
        { path: ADMIN_ROUTE.CATEGORY_ADD, element: <div>Category add page</div> },
        { path: ADMIN_ROUTE.CATEGORY_DETAIL, element: <div>Category detail page</div> },
        { path: ADMIN_ROUTE.CATEGORY_EDIT, element: <div>Category edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.PRODUCT,
      children: [
        { index: true, element: <div>Product list page</div> },
        { path: ADMIN_ROUTE.PRODUCT_ADD, element: <div>Product add page</div> },
        { path: ADMIN_ROUTE.PRODUCT_DETAIL, element: <div>Product detail page</div> },
        { path: ADMIN_ROUTE.PRODUCT_EDIT, element: <div>Product edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.ORDER,
      children: [
        { index: true, element: <div>Order list page</div> },
        { path: ADMIN_ROUTE.ORDER_ADD, element: <div>Order add page</div> },
        { path: ADMIN_ROUTE.ORDER_DETAIL, element: <div>Order detail page</div> },
        { path: ADMIN_ROUTE.ORDER_EDIT, element: <div>Order edit page</div> },
      ],
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
    {
      path: ADMIN_ROUTE.CUSTOMER,
      children: [
        { index: true, element: <div>Customer list page</div> },
        { path: ADMIN_ROUTE.CUSTOMER_ADD, element: <div>Customer add page</div> },
        { path: ADMIN_ROUTE.CUSTOMER_DETAIL, element: <div>Customer detail page</div> },
        { path: ADMIN_ROUTE.CUSTOMER_EDIT, element: <div>Customer edit page</div> },
      ],
    },
  ],
};
