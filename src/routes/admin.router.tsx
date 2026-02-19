import AdminLayout from '@/components/global/layout/AdminLayout';
import { ADMIN_ROUTE } from './route.constant';
import DashboardPage from '@/pages/dashboard/pages/DashboardPage';
import CategoryListPage from '@/pages/category/pages/list';
import ProductListPage from '@/pages/product/pages/list';
import ProductCreatePage from '@/pages/product/pages/create';
import ProductDetailPage from '@/pages/product/pages/detail';
import ProductEditPage from '@/pages/product/pages/edit';
import OrderListPage from '@/pages/order/pages/list';
import OrderCreatePage from '@/pages/order/pages/add';
import OrderDetailPage from '@/pages/order/pages/detail';
import OrderEditPage from '@/pages/order/pages/edit';
import WebsiteTemplatePage from '@/pages/website-template/pages/list';
import CreateWebsiteTemplatePage from '@/pages/website-template/pages/create';
import EditWebsiteTemplatePage from '@/pages/website-template/pages/edit';
import DetailWebsiteTemplatePage from '@/pages/website-template/pages/detail';
import UserListPage from '@/pages/user/pages/list';
import PaymentListPage from '@/pages/payment/pages/list';
import ReviewListPage from '@/pages/review/page/list';
import FaqListPage from '@/pages/faq/pages/list';
import StoreListPage from '@/pages/store/pages/list';
import PolicyListPage from '@/pages/policy/pages/list';
import CreatePolicyPage from '@/pages/policy/pages/add';
import DetailPolicyPage from '@/pages/policy/pages/detail';
import EditPolicyPage from '@/pages/policy/pages/edit';

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
        { index: true, element: <CategoryListPage /> },
        { path: ADMIN_ROUTE.CATEGORY_ADD, element: <div>Category add page</div> },
        { path: ADMIN_ROUTE.CATEGORY_DETAIL, element: <div>Category detail page</div> },
        { path: ADMIN_ROUTE.CATEGORY_EDIT, element: <div>Category edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.PRODUCT,
      children: [
        { index: true, element: <ProductListPage /> },
        { path: ADMIN_ROUTE.PRODUCT_ADD, element: <ProductCreatePage /> },
        { path: ADMIN_ROUTE.PRODUCT_DETAIL, element: <ProductDetailPage /> },
        { path: ADMIN_ROUTE.PRODUCT_EDIT, element: <ProductEditPage /> },
      ],
    },
    {
      path: ADMIN_ROUTE.STORE,
      children: [
        { index: true, element: <StoreListPage /> },
        { path: ADMIN_ROUTE.STORE_ADD, element: <div>Store add page</div> },
        { path: ADMIN_ROUTE.STORE_DETAIL, element: <div>Store detail page</div> },
        { path: ADMIN_ROUTE.STORE_EDIT, element: <div>Store edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.ORDER,
      children: [
        { index: true, element: <OrderListPage /> },
        { path: ADMIN_ROUTE.ORDER_ADD, element: <OrderCreatePage /> },
        { path: ADMIN_ROUTE.ORDER_DETAIL, element: <OrderDetailPage /> },
        { path: ADMIN_ROUTE.ORDER_EDIT, element: <OrderEditPage /> },
      ],
    },
    {
      path: ADMIN_ROUTE.PAYMENT,
      children: [
        { index: true, element: <PaymentListPage /> },
        { path: ADMIN_ROUTE.PAYMENT_ADD, element: <div>Payment add page</div> },
        { path: ADMIN_ROUTE.PAYMENT_DETAIL, element: <div>Payment detail page</div> },
        { path: ADMIN_ROUTE.PAYMENT_EDIT, element: <div>Payment edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.REVIEW,
      children: [
        { index: true, element: <ReviewListPage /> },
        { path: ADMIN_ROUTE.REVIEW_ADD, element: <div>Review add page</div> },
        { path: ADMIN_ROUTE.REVIEW_DETAIL, element: <div>Review detail page</div> },
        { path: ADMIN_ROUTE.REVIEW_EDIT, element: <div>Review edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.USER,
      children: [
        { index: true, element: <UserListPage /> },
        { path: ADMIN_ROUTE.USER_ADD, element: <div>User add page</div> },
        { path: ADMIN_ROUTE.USER_DETAIL, element: <div>User detail page</div> },
        { path: ADMIN_ROUTE.USER_EDIT, element: <div>User edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.WEBSITE_TEMPLATE,
      children: [
        { index: true, element: <WebsiteTemplatePage /> },
        { path: ADMIN_ROUTE.WEBSITE_TEMPLATE_ADD, element: <CreateWebsiteTemplatePage /> },
        { path: ADMIN_ROUTE.WEBSITE_TEMPLATE_DETAIL, element: <DetailWebsiteTemplatePage /> },
        { path: ADMIN_ROUTE.WEBSITE_TEMPLATE_EDIT, element: <EditWebsiteTemplatePage /> },
      ],
    },
    {
      path: ADMIN_ROUTE.FAQ,
      children: [
        { index: true, element: <FaqListPage /> },
        { path: ADMIN_ROUTE.FAQ_ADD, element: <div>Faq add page</div> },
        { path: ADMIN_ROUTE.FAQ_DETAIL, element: <div>Faq detail page</div> },
        { path: ADMIN_ROUTE.FAQ_EDIT, element: <div>Faq edit page</div> },
      ],
    },
    {
      path: ADMIN_ROUTE.POLICY,
      children: [
        { index: true, element: <PolicyListPage /> },
        { path: ADMIN_ROUTE.POLICY_ADD, element: <CreatePolicyPage /> },
        { path: ADMIN_ROUTE.POLICY_DETAIL, element: <DetailPolicyPage /> },
        { path: ADMIN_ROUTE.POLICY_EDIT, element: <EditPolicyPage /> },
      ],
    },
  ],
};
