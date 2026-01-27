import WebsiteLayout from '@/components/global/layout/WebsiteLayout';
import { WEBSITE_ROUTE } from './route.constant';
import HomePage from '@/pages/home';
import WebsiteProductPage from '@/pages/website-product/list';
import WebsiteCategoryPage from '@/pages/website-category/list';
import WebsiteDetailProductPage from '@/pages/website-product/detail';
import WebsiteCheckoutPage from '@/pages/website-checkout';
import ProfileLayout from '@/pages/profile/pages/layout';
import UserProfilePage from '@/pages/profile/pages/profile';
import UserOrderPage from '@/pages/profile/pages/orders';
import WebsiteSearchPage from '@/pages/website-search/list';

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
      element: <WebsiteProductPage />,
    },
    {
      path: WEBSITE_ROUTE.CATEGORY,
      element: <WebsiteCategoryPage />,
    },
    {
      path: WEBSITE_ROUTE.PRODUCT,
      element: <WebsiteDetailProductPage />,
    },
    {
      path: WEBSITE_ROUTE.CHECKOUT,
      element: <WebsiteCheckoutPage />,
    },
    {
      path: WEBSITE_ROUTE.SEARCH,
      element: <WebsiteSearchPage />,
    },
    {
      path: WEBSITE_ROUTE.PROFILE,
      element: <ProfileLayout />,
      children: [
        { index: true, element: <UserProfilePage /> },
        { path: WEBSITE_ROUTE.ORDERS, element: <UserOrderPage /> },
      ],
    },
  ],
};
