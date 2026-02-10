import React, { useEffect } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined, MenuOutlined } from '@ant-design/icons';
import AdminAntdProvider from '@/+core/provider/AdminAntdProvider';
import AdminAuthProvider from '@/+core/provider/AdminAuthProvider';
import AuthProtectProvider from '@/+core/provider/AuthProtectProvider';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useIsMobile } from '@/hooks/useIsMobile';
import { setSidebar, toggleSidebar } from '@/store/actions/user.action';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Sidebar from '../Sidebar/Sidebar';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import UserDropdown from '@/components/ui/UserDropdown/UserDropdown';
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';
import Footer from '../Footer/Footer';
import Breadcrumb from '../Breadcrumb/Breadcrumb';

const { Header, Content } = Layout;

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  useDocumentTitle('page.admin');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const isOpenSidebar: boolean = useSelector((state: RootState) => state.users.isOpenSidebar);

  const getHeaderLeftPosition = (isMobile: boolean) => {
    if (isMobile) return 0;

    if (isOpenSidebar) return 250;

    return 80;
  };

  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebar(false));
    } else {
      dispatch(setSidebar(true));
    }
  }, [isMobile]);

  return (
    <AdminAntdProvider>
      <AdminAuthProvider>
        <AuthProtectProvider>
          {isMobile ? (
            <div className='w-full h-screen flex items-center justify-center'>
              <h3 className='text-[0.9rem]'>{t('app_not_support_device')}</h3>
            </div>
          ) : (
            <Layout style={{ minHeight: '100vh' }}>
              <Sidebar showToggle={false} />

              <Layout>
                <Header
                  className='flex items-center justify-between px-[15px] transition-all duration-300'
                  style={{
                    background: colorBgContainer,
                    position: 'sticky',
                    top: 0,
                    left: getHeaderLeftPosition(isMobile),
                    right: 0,
                    height: 64,
                    zIndex: 1000,
                  }}
                >
                  <div className='flex items-center justify-between gap-5'>
                    {isMobile ? (
                      <div
                        className='hover:cursor-pointer'
                        onClick={() => dispatch(toggleSidebar())}
                      >
                        <MenuOutlined style={{ color: 'black', fontSize: '1rem' }} />
                      </div>
                    ) : (
                      <div
                        className='hover:cursor-pointer'
                        onClick={() => dispatch(toggleSidebar())}
                      >
                        {isOpenSidebar ? (
                          <MenuFoldOutlined style={{ color: 'black', fontSize: '1rem' }} />
                        ) : (
                          <MenuUnfoldOutlined style={{ color: 'black', fontSize: '1rem' }} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className='flex items-center gap-8'>
                    <LanguageToggle />
                    <NotificationDropdown />
                    <UserDropdown />
                  </div>
                </Header>

                <Content style={{ margin: '12px', marginTop: '14px', marginBottom: '20px' }}>
                  <div
                    className='min-h-full'
                    // style={{
                    //   background: colorBgContainer,
                    // }}
                  >
                    <div className='mb-5'>
                      <Breadcrumb />
                    </div>
                    <Outlet />
                  </div>
                </Content>

                <Footer />
              </Layout>
            </Layout>
          )}
        </AuthProtectProvider>
      </AdminAuthProvider>
    </AdminAntdProvider>
  );
};

export default AdminLayout;
