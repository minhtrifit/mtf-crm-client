import { get } from 'lodash';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { PaymentMethod } from '@/+core/constants/commons.constant';
import { FiShoppingBag } from 'react-icons/fi';
import { FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { WEBSITE_ROUTE } from '@/routes/route.constant';

const WebsiteFooter = () => {
  const { config } = useAppConfig();
  const { t } = useTranslation();
  const scrollToTop = useScrollToTop();

  const PAYMENTS = [
    {
      value: PaymentMethod.COD,
      label: t('payment.cod'),
      icon: <FaTruck size={30} />,
    },
    {
      value: PaymentMethod.VNPAY,
      label: t('payment.vnpay'),
      icon: <img className='w-[30px]' src='/assets/icons/icon-vnpay.png' alt='vnpay-icon' />,
    },
  ];

  return (
    <footer style={{ background: config?.websitePrimaryColor }} className='w-full text-[#FFF]'>
      <div className='max-w-[1200px] mx-auto px-[20px] pt-[50px] pb-[20px] flex flex-col gap-5'>
        <div className='grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5'>
          <div className='flex flex-col items-start gap-8'>
            {get(config, 'logo', '') === '' ? (
              <div
                className='hover:cursor-pointer'
                onClick={() => {
                  scrollToTop();
                }}
              >
                <FiShoppingBag size={30} />
              </div>
            ) : (
              <div
                className='hover:cursor-pointer'
                onClick={() => {
                  scrollToTop();
                }}
              >
                <img src={get(config, 'logo', '')} className='h-[40px]' alt='brand-logo' />
              </div>
            )}

            <div className='flex flex-col gap-3'>
              {get(config, 'phone', '') && (
                <div className='flex items-center gap-2'>
                  <FaPhone size={20} />
                  <span className='text-[0.9rem] font-semibold'>{get(config, 'phone', '')}</span>
                </div>
              )}

              {get(config, 'email', '') && (
                <div className='flex items-center gap-2'>
                  <MdEmail size={20} />
                  <span className='text-[0.9rem] font-semibold'>
                    <a
                      href={`mailto:${get(config, 'email', '')}`}
                      className='text-[#FFF] hover:text-[#FFF] hover:underline'
                    >
                      {get(config, 'email', '')}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col items-start gap-5'>
            <h4 className='font-medium'>{t('customer_support')}</h4>
            <div className='flex flex-col gap-5'>
              <Link
                to={WEBSITE_ROUTE.FAQ}
                className='text-[#FFF] hover:text-[#FFF] underline-offset-1 hover:underline'
              >
                <span className='text-[0.9rem]'>{t('faq.default')}</span>
              </Link>
            </div>
          </div>

          <div className='flex flex-col items-start gap-5'>
            <h4 className='font-medium'>{t('payment.method')}</h4>
            <div className='grid grid-cols-4 items-center gap-5'>
              {PAYMENTS.map((p) => (
                <span key={p.value}>{p.icon}</span>
              ))}
            </div>
          </div>
        </div>

        {get(config, 'footerDescription', '') && (
          <p className='text-[0.9rem] text-center font-[500]'>
            {get(config, 'footerDescription', '')}
          </p>
        )}
      </div>
    </footer>
  );
};

export default WebsiteFooter;
