import { Divider } from 'antd';
import cn from 'classnames';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGetStores } from './hooks/useGetStores';
import { useTranslation } from 'react-i18next';
import StoreSkeleton from './components/Skeleton';
import Card from './components/Card';

const WebsiteStoresPage = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const { data, loading } = useGetStores();

  return (
    <div className='w-full flex-1'>
      <div
        className={cn(
          'max-w-[1200px] mx-auto flex flex-col gap-8',
          isMobile ? 'px-[10px] py-[20px]' : 'px-[20px] py-[50px]',
        )}
      >
        <h2 className='my-0 text-[1.5rem]'>{t('store.name')}</h2>
        {loading ? (
          <StoreSkeleton />
        ) : (
          <div className={cn('w-full flex flex-col', isMobile ? 'gap-[10px]' : 'gap-[30px]')}>
            {data.map((store, index) => {
              const isLast = index === data.length - 1;
              return (
                <div
                  key={store.id}
                  className={cn('w-full flex flex-col', isMobile ? 'gap-[10px]' : 'gap-[30px]')}
                >
                  <Card data={store} />
                  {!isLast && <Divider />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteStoresPage;
