import WebsiteLayout from '@/components/global/layout/WebsiteLayout';
import { WEBSITE_ROUTE } from './route.constant';
import HomePage from '@/pages/home';

export const websiteRoutes = {
  path: '/',
  element: <WebsiteLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: WEBSITE_ROUTE.PRODUCTS,
      element: <div>Danh sách sản phẩm</div>,
    },
    {
      path: WEBSITE_ROUTE.PRODUCT,
      element: <div>Chi tiết sản phẩm</div>,
    },
    {
      path: WEBSITE_ROUTE.CATEGORY,
      element: <div>Sản phẩm thuộc danh mục</div>,
    },
  ],
};
