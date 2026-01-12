import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import Error from '@/components/ui/Error/Error';
import ProductDetailForm from '../../components/DetailForm';

const ProductDetailPage = () => {
  const params = useParams();

  const id = params?.id ?? '';

  const { data, loading, error } = useDetail(id);

  if (!loading && error) {
    return <Error />;
  }

  return <ProductDetailForm product={data} />;
};

export default ProductDetailPage;
