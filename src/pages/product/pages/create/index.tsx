import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import { useCreate } from '../../hooks/useCreate';
import { CreateProductPayload } from '@/types/product';
import { UpdateCategoryPayload } from '@/types/category';
import ProductForm from '../../components/Form';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { loading, mutate } = useCreate();

  const handleSubmit = async (data: CreateProductPayload | UpdateCategoryPayload) => {
    const res = await mutate(data as CreateProductPayload);

    if (res.success) {
      message.success(res.message);
      navigate(`/admin/${ADMIN_ROUTE.PRODUCT}`);
    }
  };

  return <ProductForm defaultValues={null} mode='add' loading={loading} onSubmit={handleSubmit} />;
};

export default ProductCreatePage;
