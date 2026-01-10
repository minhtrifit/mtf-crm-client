import { createBrowserRouter } from 'react-router-dom';
import {
  DEFAULT_ROUTE,
  DASHBOARD_ROUTE,
  MANAGEMENT_ROUTE,
  PRODUCT_ROUTE,
  ADD_PRODUCT_ROUTE,
  EDIT_PRODUCT_ROUTE,
  DETAIL_PRODUCT_ROUTE,
  CARTS_ROUTE,
  ADD_CART_ROUTE,
  BLOGS_ROUTE,
  ADD_BLOG_ROUTE,
  DETAIL_BLOG_ROUTE,
  ROLES_ROUTE,
  CUSTOMERS_ROUTE,
  STAFFS_ROUTE,
  SETTINGS_ROUTE,
} from './route.constant';

import Layout from '@/components/global/layout/Layout';
import DashboardLayout from '@/components/global/layout/DashboardLayout';

import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found-page/NotFoundPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProductPage from '@/pages/product/ProductPage';
import AddProductPage from '@/pages/add-product/AddProductPage';
import EditProductPage from '@/pages/edit-product/EditProductPage';
import BlogPage from '@/pages/blog/BlogPage';
import AddBlogPage from '@/pages/add-blog/AddBlogPage';
import DetailBlogPage from '@/pages/detail-blog/DetailBlogPage';
import CartPage from '@/pages/cart/CartPage';
import AddCartPage from '@/pages/add-cart/AddCartPage';

export const router = createBrowserRouter([
  {
    path: DEFAULT_ROUTE,
    element: <Layout />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: DASHBOARD_ROUTE,
    element: <DashboardLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
  {
    path: MANAGEMENT_ROUTE,
    element: <DashboardLayout />,
    children: [
      // Products
      { path: PRODUCT_ROUTE, element: <ProductPage /> },
      { path: ADD_PRODUCT_ROUTE, element: <AddProductPage /> },
      { path: EDIT_PRODUCT_ROUTE, element: <EditProductPage /> },
      { path: DETAIL_PRODUCT_ROUTE, element: <div>DetailProductPage</div> },
      // Carts
      { path: CARTS_ROUTE, element: <CartPage /> },
      { path: ADD_CART_ROUTE, element: <AddCartPage /> },
      // Blogs
      { path: BLOGS_ROUTE, element: <BlogPage /> },
      { path: ADD_BLOG_ROUTE, element: <AddBlogPage /> },
      { path: DETAIL_BLOG_ROUTE, element: <DetailBlogPage /> },
    ],
  },
  {
    path: ROLES_ROUTE,
    element: <DashboardLayout />,
    children: [
      { path: CUSTOMERS_ROUTE, element: <div>CustomersPage</div> },
      { path: STAFFS_ROUTE, element: <div>StaffsPage</div> },
    ],
  },
  {
    path: SETTINGS_ROUTE,
    element: <DashboardLayout />,
    children: [{ index: true, element: <div>SettingsPage</div> }],
  },
  { path: '/*', element: <NotFoundPage /> },
]);
