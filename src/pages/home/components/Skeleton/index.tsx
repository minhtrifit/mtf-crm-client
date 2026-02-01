import { Skeleton } from 'antd';

export const SectionSkeleton = () => {
  return (
    <div className='flex flex-col gap-5'>
      <Skeleton.Node active style={{ height: 30, width: 200 }} />

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3'>
        <Skeleton.Node active style={{ height: 300, width: '100%' }} />
        <Skeleton.Node
          active
          style={{ height: 300, width: '100%' }}
          className='!hidden md:!block'
        />
        <Skeleton.Node
          active
          style={{ height: 300, width: '100%' }}
          className='!hidden xl:!block'
        />
        <Skeleton.Node
          active
          style={{ height: 300, width: '100%' }}
          className='!hidden xl:!block'
        />
      </div>
    </div>
  );
};

export const ReviewsSkeleton = () => {
  return (
    <div className='w-full flex flex-col gap-5'>
      <div className='mx-auto'>
        <Skeleton.Node active style={{ height: 30, width: 200 }} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <Skeleton.Node active style={{ height: 250, width: '100%' }} />
        <Skeleton.Node
          active
          style={{ height: 250, width: '100%' }}
          className='!hidden md:!block'
        />
        <Skeleton.Node
          active
          style={{ height: 250, width: '100%' }}
          className='!hidden md:!block'
        />
      </div>
    </div>
  );
};
