import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import { useEdit } from '../../hooks/useEdit';
import { CreatePolicyPayload, UpdatePolicyPayload } from '@/types/policy';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import PolicyForm from '../../components/form';

const EditPolicyPage = () => {
  const params = useParams();

  const id = params?.id ?? '';

  const { data, loading, error, fetchData } = useDetail(id);
  const { loading: editLoading, mutate } = useEdit();

  const handleSubmit = async (data: CreatePolicyPayload | UpdatePolicyPayload) => {
    const res = await mutate(id, data as UpdatePolicyPayload);

    if (res.success) {
      message.success(res.message);
      fetchData(id);
    }
  };

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div>
      {loading ? (
        <div className='mt-10'>
          <DataLoading size='large' />
        </div>
      ) : (
        <PolicyForm
          defaultValues={data}
          mode='edit'
          loading={editLoading}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EditPolicyPage;
