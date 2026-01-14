import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import DetailForm from '../../components/DetailForm';

const OrderDetailPage = () => {
  const params = useParams();

  const id = params?.id ?? '';

  const { data, loading, error } = useDetail(id);

  if (!loading && error) {
    return <Error />;
  }

  return (
    <>
      {loading && <DataLoading size='large' />}
      {!loading && data && <DetailForm data={data} />}
    </>
  );
};

export default OrderDetailPage;
