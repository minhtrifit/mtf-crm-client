import { get } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Divider } from 'antd';
import { Product } from '@/types/product';
import { formatCurrency } from '@/+core/helpers';
import colors from '@/+core/themes/colors';
import Label from '@/components/ui/Label/Label';
import { MdCategory } from 'react-icons/md';
import ImageGallery from '@/components/ui/ImageGallery/ImageGallery';

interface PropType {
  product: Product | null;
}

const ProductDetailForm = (props: PropType) => {
  const { product } = props;

  const navigate = useNavigate();
  const params = useParams();

  const id = params?.id ?? '';

  const { t } = useTranslation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectEdit = (id: string) => {
    navigate(`/admin/product/edit/${id}`);
  };

  return (
    <div className='block__container flex flex-col gap-5'>
      <section className='flex items-center justify-between'>
        <span className='text-xl text-primary font-bold'>
          {t('detail')} {t('breadcrumb.product')}
        </span>

        <div className='flex items-center justify-center gap-2'>
          <Button type='default' htmlType='button' onClick={handleBack}>
            {t('back')}
          </Button>

          <Button
            type='primary'
            htmlType='button'
            onClick={() => {
              handleRedirectEdit(id);
            }}
          >
            {t('edit')}
          </Button>
        </div>
      </section>
      <Divider className='my-0' />

      <section className='grid grid-cols-1 md:grid-cols-[1fr_350px] gap-5'>
        <section className='grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5'>
          <div className='flex flex-col gap-3'>
            <Label title={t('product.name')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(product, 'name', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={'SKU'} />
            <span className='text-[0.85rem] text-zinc-700'>{get(product, 'sku', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={'Slug'} />
            <span className='text-[0.85rem] text-zinc-700'>{get(product, 'slug', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('category.default')} />
            <div className='flex items-center gap-3'>
              <Avatar size={50} src={get(product, 'category.imageUrl', '')} icon={<MdCategory />} />
              <span className='text-[0.85rem] text-zinc-700'>
                {get(product, 'category.name', '')}
              </span>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('price')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {formatCurrency(get(product, 'price', 0))}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('stock')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(product, 'stock', 0)}</span>
          </div>

          <div className='flex flex-col gap-3 whitespace-pre-line col-span-full'>
            <Label title={t('description')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(product, 'description', '')}</span>
          </div>
        </section>

        <ImageGallery color={colors.primary} images={get(product, 'imagesUrl', [])} />
      </section>
    </div>
  );
};

export default ProductDetailForm;
