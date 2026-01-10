import WebsiteAntdProvider from '@/+core/provider/WebsiteAntdProvider';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import WebsiteSkeleton from '../WebsiteSkeleton/WebsiteSkeleton';

interface PropType {
  children: React.ReactNode;
}

const NotFoundLayout = (props: PropType) => {
  const { children } = props;

  const { loading } = useAppConfig();

  if (loading) {
    return <WebsiteSkeleton />;
  }

  return <WebsiteAntdProvider>{children}</WebsiteAntdProvider>;
};

export default NotFoundLayout;
