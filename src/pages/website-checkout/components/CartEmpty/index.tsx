import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { FaBoxOpen } from 'react-icons/fa';

const CartEmpty = () => {
  const { config } = useAppConfig();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className='mt-5 mx-auto flex flex-col items-center gap-5'>
      <FaBoxOpen size={60} style={{ color: config?.websitePrimaryColor }} />
      <h3 className='text-center text-[0.9rem] md:text-[1rem] text-zinc-700'>{t('cart_empty')}</h3>
      <Button onClick={() => navigate('/san-pham')}>{t('go_to_shop')}</Button>
    </div>
  );
};

export default CartEmpty;
