import { FloatButton } from 'antd';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { FaArrowUp } from 'react-icons/fa';

const FloatBar = () => {
  const isMobile = useIsMobile();
  const { scrollToTop, isVisible } = useScrollToTop();
  const { config } = useAppConfig();

  const handleScrollToTop = () => scrollToTop();

  if (isMobile) return null;

  return (
    <>
      <FloatButton
        icon={<FaArrowUp style={{ color: config?.websitePrimaryColor }} />}
        shape='square'
        type='default'
        style={{ insetInlineEnd: 20, display: isVisible ? 'flex' : 'none' }}
        onClick={handleScrollToTop}
      />
    </>
  );
};

export default FloatBar;
