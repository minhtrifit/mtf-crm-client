import { createBrowserRouter } from 'react-router-dom';
import { websiteRoutes } from './website.router';
import { authRoutes } from './auth.router';
import { adminRoutes } from './admin.router';
import WebsiteAntdProvider from '@/+core/provider/WebsiteAntdProvider';
import { NotFoundPage } from '@/pages/not-found';

export const router = createBrowserRouter([
  websiteRoutes,
  authRoutes,
  adminRoutes,
  {
    path: '/*',
    element: (
      <WebsiteAntdProvider>
        <NotFoundPage />
      </WebsiteAntdProvider>
    ),
  },
]);
