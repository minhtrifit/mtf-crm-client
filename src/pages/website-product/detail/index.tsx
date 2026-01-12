import { useParams } from 'react-router-dom';
import { useDetail } from '../hooks/useDetail';
import Error from '@/components/ui/Error/Error';
import DetailProductSkeleton from '../components/Skeleton';
import DetailForm from '../components/DetailForm';

const WebsiteDetailProductPage = () => {
  const params = useParams();

  const slug = params?.slug ?? '';

  const { data, loading, error } = useDetail(slug);

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='w-full flex-1'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[50px] flex flex-col gap-8'>
        {loading && <DetailProductSkeleton />}
        {!loading && data && <DetailForm product={data} />}
      </div>
    </div>
  );
};

export default WebsiteDetailProductPage;
