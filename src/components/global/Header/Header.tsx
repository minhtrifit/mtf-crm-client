import { FormEvent, useEffect, useRef, useState } from 'react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { RootState } from '@/store/store';
import { clearUser } from '@/store/actions/user.action';
import { clearCart, toggleCartModal } from '@/store/actions/cart.action';
import type { MenuProps } from 'antd';
import { Badge, Button, Dropdown, Input, Spin } from 'antd';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { FiShoppingBag } from 'react-icons/fi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { LuUserRound } from 'react-icons/lu';
import { FaArrowTrendUp } from 'react-icons/fa6';
import LanguageToggle from '../LanguageToggle/LanguageToggle';

interface SearchResult {
  id: string;
  name: string;
}

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useIsMobile(1024);
  const { config } = useAppConfig();

  const user = useSelector((state: RootState) => state.users.user);
  const isOpenCartModal = useSelector((state: RootState) => state.carts.isOpenModal);
  const carts = useSelector((state: RootState) => state.carts.items);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [openSearch, setOpenSearch] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

  const searchRef = useRef<HTMLFormElement>(null);

  const items: MenuProps['items'] = [
    { key: 'profile', label: t('user_profile') },
    { type: 'divider' },
    { key: 'logout', label: t('auth.logout') },
  ];

  const onChooseDropdown: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      dispatch(clearUser());
      dispatch(clearCart());
      navigate('/');
    }

    if (key === 'profile') {
      navigate(WEBSITE_ROUTE.PROFILE);
    }
  };

  const handleToogleCartModal = () => {
    if (!user) {
      navigate(WEBSITE_ROUTE.LOGIN);
      return;
    }

    dispatch(toggleCartModal());
  };

  const isCheckoutPage = () => {
    return location.pathname === WEBSITE_ROUTE.CHECKOUT;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/tim-kiem?q=${search}`);
    setOpenSearch(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) {
        setOpenSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResult([]);
      return;
    }

    setLoadingSearch(true);

    // 🔥 Replace bằng API thật
    setTimeout(() => {
      setSearchResult([
        { id: '1', name: `product 1` },
        { id: '2', name: `product 2` },
        { id: '3', name: `product 3` },
      ]);
      setLoadingSearch(false);
    }, 400);
  }, [debouncedSearch]);

  const renderSearchBox = () => (
    <div
      className={`
                  absolute top-full left-0 mt-1 w-full
                  bg-[#FFF] shadow-lg transition-all duration-200 ease-out
                  ${
                    openSearch
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }
                `}
    >
      {loadingSearch ? (
        <div className='p-4 text-center'>
          <Spin />
        </div>
      ) : searchResult.length ? (
        searchResult.map((item) => (
          <div
            key={item.id}
            className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#000]'
            onClick={() => {
              navigate(`/product/${item.id}`);
              setOpenSearch(false);
            }}
          >
            {item.name}
          </div>
        ))
      ) : (
        <div className='p-4 text-[#000]'>
          <div className='text-zinc-700 flex items-center gap-3'>
            <FaArrowTrendUp size={15} />
            <span className='text-[0.8rem] font-semibold'>{t('recommend_search')}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header
      style={{ backgroundColor: config?.websitePrimaryColor }}
      className='sticky top-0 z-[100] w-full text-[#fff]'
    >
      <div className='max-w-[1200px] mx-auto px-[20px] py-[10px] flex items-center justify-between'>
        <div onClick={() => navigate(WEBSITE_ROUTE.HOME)} className='cursor-pointer'>
          {get(config, 'logo', '') === '' ? (
            <FiShoppingBag size={30} />
          ) : (
            <img src={get(config, 'logo', '')} className='h-[40px]' alt='brand-logo' />
          )}
        </div>

        {!isMobile && (
          <form ref={searchRef} onSubmit={handleSubmit} className='w-[500px] relative'>
            <Input
              placeholder={t('what_look_for')}
              className='pr-[80px]'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setOpenSearch(true)}
            />

            <Button
              className='absolute h-[30px] right-[10px] top-1/2 -translate-y-1/2'
              type='primary'
              htmlType='submit'
            >
              <FaSearch />
            </Button>

            {renderSearchBox()}
          </form>
        )}

        {isMobile ? (
          <div>
            <IoMdMenu size={30} />
          </div>
        ) : (
          <div className='flex items-center gap-8'>
            <LanguageToggle textColor='white' />

            {!isCheckoutPage() && (
              <Badge count={carts?.length} showZero={false}>
                <div
                  className='text-[#FFF] hover:cursor-pointer'
                  onClick={() => {
                    handleToogleCartModal();
                  }}
                >
                  <AiOutlineShoppingCart size={30} />
                </div>
              </Badge>
            )}

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
                align={{
                  offset: [0, 10], // [x, y]
                }}
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
