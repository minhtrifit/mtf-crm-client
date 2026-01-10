import { Outlet } from 'react-router-dom';
import { Layout as LayoutAntDesign } from 'antd';
import WebsiteAntdProvider from '@/+core/provider/WebsiteAntdProvider';
import WebsiteAuthProvider from '@/+core/provider/WebsiteAuthProvider';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import AuthHeader from '../AuthHeader/AuthHeader';
import AuthSkeleton from '../AuthSkeleton/AuthSkeleton';

const { Content } = LayoutAntDesign;

export default function AuthLayout() {
  const { loading } = useAppConfig();

  if (loading) {
    return <AuthSkeleton />;
  }

  return (
    <WebsiteAntdProvider>
      <WebsiteAuthProvider>
        <Content className='bg-[#FFF] transition duration-500 ease-in-out w-full min-h-screen flex flex-col'>
          <AuthHeader />
          <Outlet />
        </Content>
      </WebsiteAuthProvider>
    </WebsiteAntdProvider>
  );
}
