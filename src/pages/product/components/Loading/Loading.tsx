import { Table, Skeleton } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const SKELETON_ROWS = 5;

const Loading = () => {
  const skeletonData = Array.from({ length: SKELETON_ROWS }).map((_, i) => ({
    key: i,
  }));

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 30,
      align: 'center',
      render: () => <Skeleton.Input style={{ width: 30 }} active size='small' />,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      width: 400,
      render: () => <Skeleton.Input style={{ width: '90%' }} active size='default' />,
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: () => <Skeleton.Input style={{ width: 120 }} active size='small' />,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: () => <Skeleton.Input style={{ width: 80 }} active size='small' />,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 150,
      render: () => (
        <div className='w-full flex items-center justify-center'>
          <Skeleton.Image style={{ width: 50, height: 50 }} active />
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: () => (
        <div className='flex items-center gap-2'>
          <Skeleton.Button active size='small' style={{ width: 50 }} />
          <Skeleton.Button active size='small' style={{ width: 50 }} />
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={skeletonData}
      columns={columns}
      pagination={false}
      bordered
      scroll={{ x: 'max-content' }}
    />
  );
};

export default Loading;
