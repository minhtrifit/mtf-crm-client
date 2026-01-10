import { useIsMobile } from '@/hooks/useIsMobile';
import { Skeleton } from 'antd';

const AuthSkeleton = () => {
  const isMobile = useIsMobile(768);

  return (
    <div className='w-full min-h-screen bg-[#fff] flex flex-col'>
      {/* Header */}
      <header className='w-full bg-[#efefef]'>
        <div className='max-w-[1200px] h-[60px] mx-auto px-[20px] flex items-center justify-between'>
          <Skeleton.Node active style={{ height: 32, width: 100 }} />

          <Skeleton.Avatar active size='default' />
        </div>
      </header>

      <div className='w-full flex-1 px-[20px] py-[20px] flex items-center justify-center'>
        <Skeleton.Node
          active
          style={{ height: isMobile ? 300 : 400, width: isMobile ? 300 : 400 }}
        />
      </div>
    </div>
  );
};

export default AuthSkeleton;
