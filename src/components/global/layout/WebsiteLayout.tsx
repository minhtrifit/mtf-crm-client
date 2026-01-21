import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Layout as LayoutAntDesign } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useScrollToTopOnRouteChange } from '@/hooks/useScrollToTopOnRouteChange';
import { toggleCartModal } from '@/store/actions/cart.action';
import WebsiteAntdProvider from '@/+core/provider/WebsiteAntdProvider';
import WebsiteAuthProvider from '@/+core/provider/WebsiteAuthProvider';
import Header from '../Header/Header';
import CartDrawer from '../CartDrawer/CartDrawer';
import WebsiteSkeleton from '../WebsiteSkeleton/WebsiteSkeleton';
import WebsiteFooter from '../WebsiteFooter/WebsiteFooter';

const { Content } = LayoutAntDesign;

export default function WebsiteLayout() {
  const { loading } = useAppConfig();
  const dispatch = useDispatch();
  useScrollToTopOnRouteChange();

  const isOpenCartModal = useSelector((state: RootState) => state.carts.isOpenModal);

  const handleCloseCartModal = () => {
    dispatch(toggleCartModal());
  };

  if (loading) {
    return <WebsiteSkeleton />;
  }

  return (
    <WebsiteAntdProvider>
      <WebsiteAuthProvider>
        <CartDrawer open={isOpenCartModal} onClose={handleCloseCartModal} />

        <Content className='bg-[#FFF] transition duration-500 ease-in-out w-full min-h-screen flex flex-col'>
          <Header />
          <Outlet />
          <WebsiteFooter />
        </Content>
      </WebsiteAuthProvider>
    </WebsiteAntdProvider>
  );
}
