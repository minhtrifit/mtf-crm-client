import { Outlet } from 'react-router-dom';
import { Layout as LayoutAntDesign } from 'antd';
import WebsiteAntdProvider from '@/+core/provider/WebsiteAntdProvider';
import WebsiteAuthProvider from '@/+core/provider/WebsiteAuthProvider';
import Header from '../Header/Header';

const { Content } = LayoutAntDesign;

export default function WebsiteLayout() {
  return (
    <WebsiteAntdProvider>
      <WebsiteAuthProvider>
        <Content className='bg-[#FFF] transition duration-500 ease-in-out w-full min-h-screen'>
          <Header />
          <Outlet />
        </Content>
      </WebsiteAuthProvider>
    </WebsiteAntdProvider>
  );
}
