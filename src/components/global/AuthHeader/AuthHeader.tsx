import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { FiShoppingBag } from 'react-icons/fi';
import LanguageToggle from '../LanguageToggle/LanguageToggle';

const AuthHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useIsMobile(1024);
  const { config } = useAppConfig();

  return (
    <header
      style={{ backgroundColor: config?.websitePrimaryColor }}
      className='sticky top-0 z-[100] w-full h-[60px] text-[#fff]'
    >
      <div className='max-w-[1200px] h-full mx-auto px-[20px] py-[10px] flex items-center justify-between'>
        <div
          className='hover:cursor-pointer'
          onClick={() => {
            navigate(WEBSITE_ROUTE.HOME);
          }}
        >
          <FiShoppingBag size={30} />
        </div>

        <LanguageToggle textColor='white' />
      </div>
    </header>
  );
};

export default AuthHeader;
