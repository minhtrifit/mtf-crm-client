import { Outlet } from 'react-router-dom';
import { Layout as LayoutAntDesign } from 'antd';
import WebsiteAntdProvider from '@/+core/provider/WebsiteAntdProvider';
import WebsiteAuthProvider from '@/+core/provider/WebsiteAuthProvider';
import AuthHeader from '../AuthHeader/AuthHeader';

const { Content } = LayoutAntDesign;

export default function AuthLayout() {
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
