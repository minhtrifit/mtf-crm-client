import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { UserType } from '@/types/auth';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { useTranslation } from 'react-i18next';
import { useGetProfile } from '../../hooks/useGetProfile';
import Error from '@/components/ui/Error/Error';
import { FaUserLarge } from 'react-icons/fa6';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import './styles.scss';

export type ProfileLayoutContextType = {
  user: UserType;
  getProfile: (id: string) => Promise<any>;
};

const ProfileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.users.user);
  const userId = get(user, 'id', '');

  const { data, loading, error, fetchData } = useGetProfile(userId);

  const items: TabsProps['items'] = [
    {
      key: WEBSITE_ROUTE.PROFILE,
      label: t('user_profile'),
      icon: <FaUserLarge size={20} />,
    },
    {
      key: WEBSITE_ROUTE.ORDERS,
      label: t('order.default'),
      icon: <AiOutlineShoppingCart size={20} />,
    },
  ];

  const onChange = (key: string) => {
    navigate(key);
  };

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='w-full flex-1'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[50px]'>
        <div className='block__container flex flex-col gap-3 border-[1px] border-solid border-zinc-100'>
          <Tabs
            activeKey={location.pathname ?? WEBSITE_ROUTE.PROFILE}
            items={items}
            onChange={onChange}
          />
          <Outlet context={{ user: data, getProfile: fetchData }} />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
