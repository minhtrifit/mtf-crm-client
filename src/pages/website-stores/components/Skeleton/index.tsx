import { Divider, Skeleton } from 'antd';
import cn from 'classnames';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';

const StoreSkeleton = () => {
  const isMobile = useIsMobile();
  const { config } = useAppConfig();

  const CardSkeleton = () => {
    return (
      <div className='w-full flex flex-col gap-5'>
        <h3
          className='px-4 py-2 my-0'
          style={{ borderLeft: `5px solid ${config?.websitePrimaryColor}` }}
        >
          <Skeleton.Node active style={{ height: 40, width: isMobile ? 300 : 400 }} />
        </h3>
        <ul className='w-full px-10 flex flex-col gap-3'>
          <li>
            <Skeleton.Node active style={{ height: 20, width: isMobile ? 200 : 300 }} />
          </li>
          <li>
            <Skeleton.Node active style={{ height: 20, width: isMobile ? 200 : 300 }} />
          </li>
        </ul>
        <Skeleton.Node active style={{ height: 300, width: '100%' }} />
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col', isMobile ? 'gap-[10px]' : 'gap-[30px]')}>
      <CardSkeleton />
      <Divider className='my-0' />
      <CardSkeleton />
    </div>
  );
};

export default StoreSkeleton;
