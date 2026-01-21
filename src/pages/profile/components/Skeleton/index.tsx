import { Skeleton } from 'antd';

export const FormSkeleton = () => {
  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5'>
      <div className='w-full flex items-center justify-center'>
        <Skeleton.Node active style={{ height: 150, width: 150 }} />
      </div>

      <div className='w-full flex flex-col gap-3'>
        <Skeleton.Node active style={{ height: 30, width: '100%' }} />
        <Skeleton.Node active style={{ height: 30, width: '80%' }} />
        <Skeleton.Node active style={{ height: 30, width: '50%' }} />
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className='w-full flex flex-col gap-5'>
      <Skeleton.Node active style={{ height: 32, width: 200 }} />
      <Skeleton.Node active style={{ height: 200, width: '100%' }} />
    </div>
  );
};
