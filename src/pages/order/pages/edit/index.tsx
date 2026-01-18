import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import { useEdit } from '../../hooks/useEdit';
import { UpdateOrderPayload } from '@/types/order';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import OrderForm from '../../components/Form';

const OrderEditPage = () => {
  const params = useParams();

  const id = params?.id ?? '';

  const { data, loading, error, fetchData } = useDetail(id);
  const { loading: editLoading, mutate } = useEdit();

  const handleSubmit = async (data: UpdateOrderPayload) => {
    const res = await mutate(id, data as UpdateOrderPayload);

    if (res.success) {
      message.success(res.message);
      fetchData(id);
    }
  };

  if (!loading && error) {
    return <Error />;
  }

  if (!loading && error) {
    return <Error />;
  }

  return (
    <>
      {loading && <DataLoading size='large' />}
      {!loading && data && (
        <OrderForm mode='edit' defaultValues={data} loading={editLoading} onSubmit={handleSubmit} />
      )}
    </>
  );
};

export default OrderEditPage;
