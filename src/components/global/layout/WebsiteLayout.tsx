import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FloatButton, Layout as LayoutAntDesign } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollToTopOnRouteChange } from '@/hooks/useScrollToTopOnRouteChange';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { toggleMenuDrawer } from '@/store/actions/user.action';
import { toggleCartModal } from '@/store/actions/cart.action';
import WebsiteAntdProvider from '@/+core/provider/WebsiteAntdProvider';
import WebsiteAuthProvider from '@/+core/provider/WebsiteAuthProvider';
import Header from '../Header/Header';
import CartDrawer from '../CartDrawer/CartDrawer';
import WebsiteSkeleton from '../WebsiteSkeleton/WebsiteSkeleton';
import WebsiteFooter from '../WebsiteFooter/WebsiteFooter';
import MenuDrawer from '../MenuDrawer/MenuDrawer';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const { Content } = LayoutAntDesign;

export default function WebsiteLayout() {
  const { loading } = useAppConfig();
  const navigate = useNavigate();
  const isMobile = useIsMobile(1024);
  const dispatch = useDispatch();
  useScrollToTopOnRouteChange();

  const user = useSelector((state: RootState) => state.users.user);
  const isOpenMenuDrawer = useSelector((state: RootState) => state.users.isOpenMenuDrawer);
  const carts = useSelector((state: RootState) => state.carts.items);
  const isOpenCartModal = useSelector((state: RootState) => state.carts.isOpenModal);

  const handleCloseMenuDrawer = () => {
    dispatch(toggleMenuDrawer());
  };

  const handleCloseCartModal = () => {
    dispatch(toggleCartModal());
  };

  const handleToggleCartModal = () => {
    if (!user) {
      navigate(WEBSITE_ROUTE.LOGIN);
      return;
    }

    dispatch(toggleCartModal());
  };

  if (loading) {
    return <WebsiteSkeleton />;
  }

  return (
    <WebsiteAntdProvider>
      <WebsiteAuthProvider>
        <MenuDrawer open={isOpenMenuDrawer} onClose={handleCloseMenuDrawer} />
        <CartDrawer open={isOpenCartModal} onClose={handleCloseCartModal} />

        <Content className='bg-[#f5f5fa] transition duration-500 ease-in-out w-full min-h-screen flex flex-col'>
          <Header />
          <Outlet />
          {isMobile && (
            <FloatButton
              shape='circle'
              type='primary'
              style={{ insetInlineEnd: 20 }}
              icon={<AiOutlineShoppingCart />}
              badge={{ count: carts?.length }}
              onClick={handleToggleCartModal}
            />
          )}
          <WebsiteFooter />
        </Content>
      </WebsiteAuthProvider>
    </WebsiteAntdProvider>
  );
}
