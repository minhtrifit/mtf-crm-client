import { Spin } from 'antd';

interface PropType {
  size?: 'default' | 'small' | 'large';
}

const DataLoading = (props: PropType) => {
  const { size = 'default' } = props;

  return (
    <div className='flex items-center justify-center'>
      <Spin size={size} />
    </div>
  );
};

export default DataLoading;
