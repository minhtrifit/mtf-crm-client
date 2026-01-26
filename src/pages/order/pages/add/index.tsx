import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreate } from '../../hooks/useCreate';
import { AdminOrderPayload } from '@/types/order';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import OrderCreateForm from '../../components/CreateForm';

const OrderCreatePage = () => {
  const { mutate, loading } = useCreate();

  const navigate = useNavigate();

  const handleSubmitForm = async (payload: AdminOrderPayload) => {
    const res = await mutate(payload);

    if (res.success) {
      message.success(res.message);
      navigate(`/admin/${ADMIN_ROUTE.ORDER}`);
    }
  };

  return <OrderCreateForm loading={loading} handleSubmitForm={handleSubmitForm} />;
};

export default OrderCreatePage;
