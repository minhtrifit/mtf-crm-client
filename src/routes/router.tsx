import { createBrowserRouter } from 'react-router-dom';
import { websiteRoutes } from './website.router';
import { authRoutes } from './auth.router';
import { adminRoutes } from './admin.router';
import NotFoundLayout from '@/components/global/layout/NotFoundLayout';
import { NotFoundPage } from '@/pages/not-found';

export const router = createBrowserRouter([
  websiteRoutes,
  authRoutes,
  adminRoutes,
  {
    path: '/*',
    element: (
      <NotFoundLayout>
        <NotFoundPage />
      </NotFoundLayout>
    ),
  },
]);
