import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-5'>
      <div className='w-full flex flex-wrap items-center justify-between gap-3'>
        <div>action</div>

        <Button
          color='primary'
          variant='solid'
          icon={<PlusOutlined />}
          onClick={() => {
            navigate('/management/blogs/add');
          }}
        >
          Thêm mới
        </Button>
      </div>
    </div>
  );
};

export default BlogPage;
