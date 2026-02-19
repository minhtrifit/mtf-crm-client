import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import PolicyForm from '../../components/form';

const DetailPolicyPage = () => {
  const params = useParams();

  const id = params?.id ?? '';

  const { data, loading, error } = useDetail(id);

  if (!loading && error) {
    return <Error />;
  }

  return (
    <>
      {loading ? (
        <DataLoading size='large' />
      ) : (
        <PolicyForm defaultValues={data} mode='detail' loading={false} onSubmit={() => {}} />
      )}
    </>
  );
};

export default DetailPolicyPage;
