import { get } from 'lodash';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { FiShoppingBag } from 'react-icons/fi';
import { FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

const WebsiteFooter = () => {
  const { config } = useAppConfig();
  const scrollToTop = useScrollToTop();

  return (
    <footer style={{ background: config?.websitePrimaryColor }} className='w-full text-[#FFF]'>
      <div className='max-w-[1200px] mx-auto px-[20px] pt-[50px] pb-[20px] flex flex-col gap-5'>
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
