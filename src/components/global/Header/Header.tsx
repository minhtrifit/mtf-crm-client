import { FormEvent, useEffect, useRef, useState } from 'react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/pages/website-product/hooks/useSearch';
import { RootState } from '@/store/store';
import { clearUser, toggleMenuDrawer } from '@/store/actions/user.action';
import { clearCart, toggleCartModal } from '@/store/actions/cart.action';
import type { MenuProps } from 'antd';
import { Avatar, Badge, Button, Dropdown, Empty, Input, Skeleton, Spin } from 'antd';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { FiShoppingBag } from 'react-icons/fi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { LuUserRound } from 'react-icons/lu';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
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

  const {
    data: products,
    total: totalProducts,
    setData: setProducts,
    loading: productLoading,
    error: productError,
    fetchData: fetchProductData,
  } = useSearch();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 700);
  const [openSearch, setOpenSearch] = useState(false);

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

  const handleToggleCartModal = () => {
    if (!user) {
      navigate(WEBSITE_ROUTE.LOGIN);
      return;
    }

    dispatch(toggleCartModal());
  };

  const handleToggleMenuDrawer = () => {
    dispatch(toggleMenuDrawer());
  };

  const isCheckoutPage = () => {
    return location.pathname === WEBSITE_ROUTE.CHECKOUT;
  };

  const handleNavigateDetailProduct = (slug: string) => {
    navigate(`/san-pham/${slug}`);
    setOpenSearch(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search) return;

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
      setProducts([]);
      return;
    }

    fetchProductData({
      q: debouncedSearch,
    });
  }, [debouncedSearch]);

  const renderSearchBox = () => (
    <div
      className={`
                  absolute top-full left-0 mt-1 w-full max-h-[400px] overflow-y-auto
                  bg-[#FFF] shadow-lg transition-all duration-200 ease-out
                  ${
                    openSearch
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }
                `}
    >
      <div className='flex flex-col'>
        <h3 className='ml-4 my-3 text-[0.8rem] text-zinc-500 uppercase'>{t('popular_keywords')}</h3>

        <div className='flex flex-col'>
          <div className='p-3 text-zinc-700 flex items-center gap-3 hover:bg-blue-100 hover:cursor-pointer group'>
            <FaArrowTrendUp size={18} className='group-hover:text-blue-700' />
            <span className='text-[0.9rem] font-semibold group-hover:text-blue-700'>
              {t('recommend_search')}
            </span>
          </div>

          <div className='p-3 text-zinc-700 flex items-center gap-3 hover:bg-blue-100 hover:cursor-pointer group'>
            <FaArrowTrendUp size={18} className='group-hover:text-blue-700' />
            <span className='text-[0.9rem] font-semibold group-hover:text-blue-700'>
              {t('recommend_search')}
            </span>
          </div>
        </div>
      </div>

      {productLoading ? (
        <div className='p-4 flex flex-col gap-5'>
          <div className='flex items-start gap-5'>
            <Skeleton.Avatar active size={60} />

            <div className='w-full flex flex-col gap-1'>
              <Skeleton.Node active style={{ height: 20, width: '100%' }} />
              <Skeleton.Node active style={{ height: 20, width: '80%' }} />
            </div>
          </div>

          <div className='flex items-start gap-5'>
            <Skeleton.Avatar active size={60} />

            <div className='w-full flex flex-col gap-1'>
              <Skeleton.Node active style={{ height: 20, width: '100%' }} />
              <Skeleton.Node active style={{ height: 20, width: '80%' }} />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-5'>
          {products?.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t(`${!search ? 'what_find' : 'no_search_result'}`)}
            />
          ) : (
            <div className='flex flex-col'>
              <h3 className='ml-4 my-3 text-[0.8rem] text-zinc-500 uppercase'>
                {t('total_search_result', {
                  total: totalProducts,
                })}
              </h3>

              {products?.map((product) => {
                return (
                  <div
                    key={get(product, 'id', '')}
                    className='p-3 flex items-start gap-5 hover:bg-blue-100 hover:cursor-pointer group'
                    onClick={() => handleNavigateDetailProduct(get(product, 'slug', ''))}
                  >
                    <Avatar
                      shape='circle'
                      size={60}
                      src={get(product, 'imagesUrl[0]', '')}
                      icon={<FiShoppingBag />}
                      className='shrink-0'
                    />

                    <div>
                      <span className='text-[0.8rem] text-zinc-700 group-hover:text-blue-700'>
                        {get(product, 'name', '')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              className='pr-[110px]'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setOpenSearch(true)}
            />

            {search && (
              <Button
                shape='circle'
                className='absolute right-[70px] top-1/2 -translate-y-1/2'
                size='small'
                icon={<IoClose />}
                htmlType='button'
                onClick={() => setSearch('')}
              />
            )}

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
          <div className='flex items-center gap-5'>
            <LanguageToggle textColor='white' />
            <IoMdMenu size={30} onClick={handleToggleMenuDrawer} />
          </div>
        ) : (
          <div className='flex items-center gap-8'>
            <LanguageToggle textColor='white' />

            {!isCheckoutPage() && (
              <Badge count={carts?.length} showZero={false}>
                <div
                  className='text-[#FFF] hover:cursor-pointer'
                  onClick={() => {
                    handleToggleCartModal();
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
