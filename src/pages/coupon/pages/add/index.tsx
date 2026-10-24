import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import { CouponPayload, UpdateCouponPayload } from '@/types/coupon';
import CouponForm from '../../components/form';
import { useCreate } from '../../hooks/useCreate';

const CreateCouponPage = () => {
  const navigate = useNavigate();
  const { loading, mutate } = useCreate();

  const handleSubmit = async (data: CouponPayload | UpdateCouponPayload) => {
    const result = await mutate(data as CouponPayload);
    if (result.success) {
      message.success(result.message);
      navigate(`/admin/${ADMIN_ROUTE.COUPON}`);
      return;
    }
    message.error(result.message);
  };

  return <CouponForm defaultValues={null} mode='add' loading={loading} onSubmit={handleSubmit} />;
};

export default CreateCouponPage;
