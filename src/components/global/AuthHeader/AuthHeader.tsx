import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useIsMobile } from '@/hooks/useIsMobile';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { FiShoppingBag } from 'react-icons/fi';
import LanguageToggle from '../LanguageToggle/LanguageToggle';

const AuthHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useIsMobile(1024);

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

        <LanguageToggle textColor='white' />
      </div>
    </header>
  );
};

export default AuthHeader;
