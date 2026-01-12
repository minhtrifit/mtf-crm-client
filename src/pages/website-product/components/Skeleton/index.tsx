import { Card, Skeleton } from 'antd';

const DetailProductSkeleton = () => {
  return (
    <Card
      styles={{
        body: {
          padding: 15,
          borderTop: '1px solid #f5f5f5',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-[50px]'>
        <div className='flex flex-col gap-5'>
          <Skeleton.Node active style={{ height: 400, width: '100%' }} />

          <div className='grid grid-cols-4 gap-3'>
            <Skeleton.Node active style={{ height: 100, width: '100%' }} />
            <Skeleton.Node active style={{ height: 100, width: '100%' }} />
            <Skeleton.Node active style={{ height: 100, width: '100%' }} />
            <Skeleton.Node active style={{ height: 100, width: '100%' }} />
          </div>
        </div>

        <div className='flex flex-col gap-5'>
          <Skeleton.Node active style={{ height: 30, width: '80%' }} />
          <Skeleton.Node active style={{ height: 30, width: '200px' }} />
          <Skeleton.Node active style={{ height: 50, width: '50%' }} />

          <div className='mt-5 grid grid-cols-2 gap-5'>
            <Skeleton.Node active style={{ height: 50, width: '100%' }} />
            <Skeleton.Node active style={{ height: 50, width: '100%' }} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DetailProductSkeleton;
