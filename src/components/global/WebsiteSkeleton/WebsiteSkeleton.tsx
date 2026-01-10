import { useIsMobile } from '@/hooks/useIsMobile';
import { Skeleton } from 'antd';

const WebsiteSkeleton = () => {
  const isMobile = useIsMobile(1024);

  return (
    <div className='w-full min-h-screen bg-[#fff]'>
      {/* Header */}
      <header className='w-full bg-[#efefef]'>
        <div className='max-w-[1200px] h-[60px] mx-auto px-[20px] flex items-center justify-between'>
          <Skeleton.Node active style={{ height: 32, width: 100 }} />

          {!isMobile && <Skeleton.Input active size='default' style={{ width: 500 }} />}

          <div className='flex gap-5'>
            <Skeleton.Node active style={{ height: 32, width: 32 }} />
            {!isMobile && <Skeleton.Avatar active size='default' />}
            {!isMobile && <Skeleton.Node active style={{ height: 32, width: 100 }} />}
          </div>
        </div>
      </header>

      <div className='max-w-[1200px] mx-auto px-[20px] py-[20px] flex flex-col gap-10'>
        <section className='w-full grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8'>
          {!isMobile && <Skeleton.Node active style={{ height: 400, width: '100%' }} />}
          <Skeleton.Node active style={{ height: isMobile ? 200 : 400, width: '100%' }} />
        </section>

        {/* <section className='w-full flex flex-col gap-5'>
          <Skeleton.Node active style={{ height: 30, width: 200 }} />
          <div className='grid grid-cols-2 2xl:grid-cols-4 gap-5'>
            <Skeleton.Node active style={{ height: 300, width: '100%' }} />
            <Skeleton.Node active style={{ height: 300, width: '100%' }} />
            {!isMobile && <Skeleton.Node active style={{ height: 300, width: '100%' }} />}
            {!isMobile && <Skeleton.Node active style={{ height: 300, width: '100%' }} />}
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default WebsiteSkeleton;
