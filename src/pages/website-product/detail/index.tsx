import { useParams } from 'react-router-dom';
import cn from 'classnames';
import { useDetail } from '../hooks/useDetail';
import { useIsMobile } from '@/hooks/useIsMobile';
import Error from '@/components/ui/Error/Error';
import { DetailProductSkeleton } from '../components/Skeleton';
import DetailForm from '../components/DetailForm';

const WebsiteDetailProductPage = () => {
  const params = useParams();
  const isMobile = useIsMobile();

  const slug = params?.slug ?? '';

  const { data, loading, error } = useDetail(slug);

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='w-full flex-1'>
      <div
        className={cn(
          'max-w-[1200px] mx-auto flex flex-col gap-8',
          isMobile ? 'px-[10px] py-[20px]' : 'px-[20px] py-[50px]',
        )}
      >
        {loading && <DetailProductSkeleton />}
        {!loading && data && <DetailForm product={data} />}
      </div>
    </div>
  );
};

export default WebsiteDetailProductPage;
