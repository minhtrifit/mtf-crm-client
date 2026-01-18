import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreate } from '../../hooks/useCreate';
import { CreateWebsiteTemplatePayload } from '@/types/website_template';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import WebsiteTemplateForm from '../../components/Form';

const CreateWebsiteTemplatePage = () => {
  const navigate = useNavigate();
  const { loading, mutate } = useCreate();

  const handleSubmit = async (data: CreateWebsiteTemplatePayload) => {
    const res = await mutate(data as CreateWebsiteTemplatePayload);

    if (res.success) {
      message.success(res.message);
      navigate(`/admin/${ADMIN_ROUTE.WEBSITE_TEMPLATE}`);
    }
  };

  return (
    <WebsiteTemplateForm
      defaultValues={null}
      mode='add'
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateWebsiteTemplatePage;
