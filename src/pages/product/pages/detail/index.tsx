import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import Error from '@/components/ui/Error/Error';

const ProductDetailPage = () => {
  const params = useParams();

  const id = params?.id ?? '';

  const { data, loading, error, fetchData } = useDetail(id);

  if (!loading && error) {
    return <Error />;
  }

  return <div>ProductDetailPage</div>;
};

export default ProductDetailPage;
