import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import { useCreate } from '../../hooks/useCreate';
import { CreatePolicyPayload, UpdatePolicyPayload } from '@/types/policy';
import PolicyForm from '../../components/form';

const CreatePolicyPage = () => {
  const navigate = useNavigate();
  const { loading, mutate } = useCreate();

  const handleSubmit = async (data: CreatePolicyPayload | UpdatePolicyPayload) => {
    const res = await mutate(data as CreatePolicyPayload);

    if (res.success) {
      message.success(res.message);
      navigate(`/admin/${ADMIN_ROUTE.POLICY}`);
    }
  };

  return <PolicyForm defaultValues={null} mode='add' loading={loading} onSubmit={handleSubmit} />;
};

export default CreatePolicyPage;
