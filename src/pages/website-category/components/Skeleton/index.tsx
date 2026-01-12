import { Skeleton } from 'antd';

export const TitleSkelelon = () => {
  return (
    <div className='flex items-center gap-3'>
      <Skeleton.Avatar active size={80} />

      <Skeleton.Node active style={{ height: 30, width: 300 }} />
    </div>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5'>
      <Skeleton.Node active style={{ height: 300, width: '100%' }} />
      <Skeleton.Node active style={{ height: 300, width: '100%' }} />
      <Skeleton.Node active style={{ height: 300, width: '100%' }} />
      <Skeleton.Node active style={{ height: 300, width: '100%' }} />

      <div className='w-full flex items-center justify-center gap-5 col-span-full'>
        <Skeleton.Node active style={{ height: 40, width: 40 }} />
        <Skeleton.Node active style={{ height: 40, width: 40 }} />
        <Skeleton.Node active style={{ height: 40, width: 40 }} />
      </div>
    </div>
  );
};
