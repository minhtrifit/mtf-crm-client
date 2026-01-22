import { Avatar, Button, Drawer, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clearCart } from '@/store/actions/cart.action';
import { clearUser, toggleMenuDrawer } from '@/store/actions/user.action';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { MdHome } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FiShoppingBag } from 'react-icons/fi';
import { get } from 'lodash';

interface PropType {
  open: boolean;
  onClose: () => void;
}

const MenuDrawer = (props: PropType) => {
  const { open, onClose } = props;

  const { config } = useAppConfig();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.users.user);

  const items = [
    {
      id: 'home',
      title: t('home'),
      url: WEBSITE_ROUTE.HOME,
      isAuth: false,
      icon: <MdHome size={25} />,
    },
    {
      id: 'profile',
      title: t('user_profile'),
      url: WEBSITE_ROUTE.PROFILE,
      isAuth: true,
      icon: <FaUser size={20} />,
    },
    {
      id: 'order',
      title: t('order.default'),
      url: WEBSITE_ROUTE.ORDERS,
      isAuth: true,
      icon: <AiOutlineShoppingCart size={25} />,
    },
    {
      id: 'products',
      title: t('product.default'),
      url: WEBSITE_ROUTE.PRODUCTS,
      isAuth: false,
      icon: <FiShoppingBag size={20} />,
    },
  ];

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(toggleMenuDrawer());
    navigate('/');
  };

  const handleNavgiteItem = (url: string) => {
    navigate(url);
    dispatch(toggleMenuDrawer());
  };

  return (
    <Drawer
      onClose={onClose}
      open={open}
      style={{
        padding: 0,
      }}
      footer={
        !user ? (
          <div className='w-full flex gap-3 py-2'>
            <Button
              className='w-full'
              onClick={() => {
                navigate(WEBSITE_ROUTE.REGISTER);
              }}
            >
              {t('auth.register')}
            </Button>

            <Button
              className='w-full'
              type='primary'
              onClick={() => {
                navigate(WEBSITE_ROUTE.LOGIN);
              }}
            >
              {t('auth.login')}
            </Button>
          </div>
        ) : (
          <div className='w-full py-2'>
            <Popconfirm
              title={t('confirm')}
              description={t('auth.logout_confirm')}
              onConfirm={handleLogout}
              okText={t('yes')}
              cancelText={t('cancel')}
            >
              <Button className='w-full' type='primary'>
                {t('auth.logout')}
              </Button>
            </Popconfirm>
          </div>
        )
      }
    >
      <div className='max-h-full overflow-y-auto flex flex-col gap-5'>
        {user && (
          <div className='mb-3 flex flex-col items-center gap-3'>
            <Avatar
              size={80}
              src={get(user, 'avatar', '')}
              icon={<FaUser size={25} />}
              style={{
                background: `${!get(user, 'avatar', '') ? config?.websitePrimaryColor : ''}`,
              }}
            />

            <span className='text-center font-semibold text-zinc-700'>
              {get(user, 'fullName', '')}
            </span>
          </div>
        )}

        {items.map((i) => {
          if (i.isAuth && !user) return null;

          return (
            <div
              key={i.id}
              style={{ color: location.pathname === i.url ? config?.websitePrimaryColor : '' }}
              className='flex items-center gap-5 hover:cursor-pointer'
              onClick={() => {
                handleNavgiteItem(i.url);
              }}
            >
              <div className='w-8 h-8 flex items-center justify-center'>{i.icon}</div>

              <span className='font-semibold'>{i.title}</span>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

export default MenuDrawer;
