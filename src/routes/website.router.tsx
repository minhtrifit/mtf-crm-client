import WebsiteLayout from '@/components/global/layout/WebsiteLayout';
import { WEBSITE_ROUTE } from './route.constant';
import HomePage from '@/pages/home';
import WebsiteCategoryPage from '@/pages/website-category';

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
      path: WEBSITE_ROUTE.CATEGORY,
      element: <WebsiteCategoryPage />,
    },
    {
      path: WEBSITE_ROUTE.PRODUCT,
      element: <div>Chi tiết sản phẩm</div>,
    },
  ],
};
