import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMobile } from '@/hooks/useIsMobile';
import { RootState } from '@/store/store';
import { clearUser } from '@/store/actions/user.action';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { FiShoppingBag } from 'react-icons/fi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { LuUserRound } from 'react-icons/lu';
import LanguageToggle from '../LanguageToggle/LanguageToggle';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useIsMobile(1024);

  const user = useSelector((state: RootState) => state.users.user);

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: t('user_profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: t('auth.logout'),
    },
  ];

  const onChooseDropdown: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      dispatch(clearUser());
      window.location.reload;
    }
  };

  return (
    <header className='sticky top-0 w-full bg-[#fa5130] text-[#fff]'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[10px] flex items-center justify-between'>
        <div
          className='hover:cursor-pointer'
          onClick={() => {
            navigate(WEBSITE_ROUTE.HOME);
          }}
        >
          <FiShoppingBag size={30} />
        </div>

        {!isMobile && <form>search</form>}

        {isMobile ? (
          <div>
            <IoMdMenu size={30} />
          </div>
        ) : (
          <div className='flex items-center gap-8'>
            <AiOutlineShoppingCart size={30} />

            <LanguageToggle textColor='white' />

            {!user ? (
              <div
                className='flex items-center hover:cursor-pointer'
                onClick={() => {
                  navigate(WEBSITE_ROUTE.LOGIN);
                }}
              >
                <LuUserRound size={20} />
              </div>
            ) : (
              <Dropdown
                menu={{ items, onClick: onChooseDropdown }}
                trigger={['click']}
                placement='bottomRight'
              >
                <div className='flex items-center gap-2 hover:cursor-pointer'>
                  <span className='text-[0.8rem] font-semibold'>{get(user, 'fullName', '')}</span>
                  <FaChevronDown size={12} />
                </div>
              </Dropdown>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
