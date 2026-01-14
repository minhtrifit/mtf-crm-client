import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import Error from '@/components/ui/Error/Error';
import ProductDetailForm from '../../components/DetailForm';
import DataLoading from '@/components/ui/DataLoading/DataLoading';

const ProductDetailPage = () => {
  const params = useParams();

  const id = params?.id ?? '';

  const { data, loading, error } = useDetail(id);

  if (!loading && error) {
    return <Error />;
  }

  return <>{loading ? <DataLoading size='large' /> : <ProductDetailForm product={data} />}</>;
};

export default ProductDetailPage;
