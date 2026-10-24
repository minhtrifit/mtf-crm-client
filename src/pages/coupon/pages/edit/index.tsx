import { message } from 'antd';
import { useParams } from 'react-router-dom';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import { UpdateCouponPayload } from '@/types/coupon';
import CouponForm from '../../components/form';
import { useDetail } from '../../hooks/useDetail';
import { useEdit } from '../../hooks/useEdit';

const EditCouponPage = () => {
  const { id = '' } = useParams();
  const { data, loading, error, fetchData } = useDetail(id);
  const { loading: editLoading, mutate } = useEdit();

  const handleSubmit = async (payload: UpdateCouponPayload) => {
    const result = await mutate(id, payload);
    if (result.success) {
      message.success(result.message);
      await fetchData(id);
      return;
    }
    message.error(result.message);
  };

  if (!loading && error) return <Error />;
  if (loading) return <DataLoading size='large' />;
  if (!data) return <Error />;

  return (
    <CouponForm defaultValues={data} mode='edit' loading={editLoading} onSubmit={handleSubmit} />
  );
};

export default EditCouponPage;
