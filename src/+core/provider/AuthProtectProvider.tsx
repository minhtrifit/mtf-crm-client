import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { UserRole } from '@/types/auth';

interface PropType {
  children: React.ReactNode;
}

const protectedRoutes: Record<string, UserRole[]> = {
  '/admin': [UserRole.ADMIN],
};

const AuthProtectProvider = ({ children }: PropType) => {
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.users.user);

  const matchedRoute = Object.keys(protectedRoutes).find((route) => pathname.startsWith(route));

  // Không phải route cần protect
  if (!matchedRoute) {
    return <>{children}</>;
  }

  // Chưa đăng nhập
  if (!user) {
    return <Navigate to={WEBSITE_ROUTE.LOGIN} replace />;
  }

  const allowedRoles = protectedRoutes[matchedRoute];

  // Không đủ quyền
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={WEBSITE_ROUTE.FORBIDDEN} replace />;
  }

  return <>{children}</>;
};

export default AuthProtectProvider;
