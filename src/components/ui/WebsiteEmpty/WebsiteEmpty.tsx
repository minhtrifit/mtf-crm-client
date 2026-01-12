import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { HiMiniInbox } from 'react-icons/hi2';

const WebsiteEmpty = () => {
  const { config } = useAppConfig();
  const { t } = useTranslation();

  return (
    <div className='w-full flex items-center justify-center py-[50px]'>
      <div className='flex flex-col items-center gap-3'>
        <HiMiniInbox style={{ color: config?.websitePrimaryColor }} size={80} />
        <span className='text-[1rem] text-zinc-700 font-semibold'>{t('no_data')}</span>
      </div>
    </div>
  );
};

export default WebsiteEmpty;
