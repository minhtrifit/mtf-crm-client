import { useState } from 'react';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Card, notification, Rate, Tag } from 'antd';
import { Product } from '@/types/product';
import { formatCurrency } from '@/+core/helpers';
import ImageGallery from '@/components/ui/ImageGallery/ImageGallery';
import QuantityInput from '@/components/ui/QuantityInput/QuantityInput';
import { MdCategory } from 'react-icons/md';
import { addToCart } from '@/store/actions/cart.action';

interface PropType {
  product: Product;
}

const DetailForm = (props: PropType) => {
  const { product } = props;

  const { config } = useAppConfig();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.users.user);

  const [quantity, setQuantity] = useState<number>(1);

  const getStatus = (stock: number) => {
    if (stock === 0) return t('out_stock');

    return t('in_stock');
  };

  const handleRedirectDetailCategory = (slug: string) => {
    navigate(`/danh-muc/${slug}`);
  };

  const handleAddToCard = () => {
    if (!user) {
      navigate(`${WEBSITE_ROUTE.LOGIN}?website-redirect=${location.pathname}`);
      return;
    }

    dispatch(addToCart({ product, quantity }));
    setQuantity(1);
    notification.success({
      message: t('notification'),
      description: t('add_to_cart_successfully'),
      placement: 'bottomLeft',
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate(`${WEBSITE_ROUTE.LOGIN}?website-redirect=${location.pathname}`);
      return;
    }

    dispatch(addToCart({ product, quantity }));
    setQuantity(1);
    navigate(`/thanh-toan?step=1`);
  };

  return (
    <div className='flex flex-col gap-5'>
      <Card
        styles={{
          body: {
            padding: 15,
            borderTop: '1px solid #f5f5f5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <section className='w-full grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-[50px]'>
          <ImageGallery images={get(product, 'imagesUrl', [])} />

          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-5'>
              <h3 className='my-0 text-[1.5rem]'>{get(product, 'name', '')}</h3>

              <Rate value={5} disabled />

              <div className='w-full bg-[#fafafa] p-4 rounded-md'>
                <span
                  style={{ color: config?.websitePrimaryColor }}
                  className='text-[1.5rem] font-semibold'
                >
                  {formatCurrency(get(product, 'price', 0))}
                </span>
              </div>
            </div>

            <div>
              <QuantityInput value={quantity} onChange={(value: number) => setQuantity(value)} />
            </div>

            <div className='mt-5 w-full max-w-[400px] grid grid-cols-2 gap-3'>
              <Button onClick={handleAddToCard}>{t('add_to_cart')}</Button>
              <Button type='primary' onClick={handleBuyNow}>
                {t('buy_now')}
              </Button>
            </div>
          </div>
        </section>
      </Card>

      <Card
        styles={{
          body: {
            padding: 15,
            borderTop: '1px solid #f5f5f5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <section className='flex flex-col gap-5'>
          <div className='w-full bg-[#fafafa] p-4 rounded-md'>
            <h3 style={{ color: config?.websitePrimaryColor }} className='text-[1.2rem] uppercase'>
              {t('product.detail')}
            </h3>
          </div>

          <div className='flex flex-col gap-10 p-4'>
            <div className='grid grid-cols-[110px_1fr] md:grid-cols-[150px_1fr] gap-5'>
              <span className='text-zinc-700 font-semibold my-auto'>{t('category.default')}</span>

              <div className='flex items-center'>
                <div
                  className='flex items-center gap-3 hover:cursor-pointer group'
                  onClick={() => {
                    handleRedirectDetailCategory(get(product, 'category.slug', ''));
                  }}
                >
                  <Avatar
                    size={50}
                    src={get(product, 'category.imageUrl', '')}
                    icon={<MdCategory />}
                    className='shrink-0'
                  />
                  <span className='group-hover:text-blue-700'>
                    {get(product, 'category.name', '')}
                  </span>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-[110px_1fr] md:grid-cols-[150px_1fr] gap-5'>
              <span className='text-zinc-700 font-semibold my-auto'>{t('product.sku')}</span>
              <span className='font-bold'>{get(product, 'sku', '')}</span>
            </div>

            <div className='grid grid-cols-[110px_1fr] md:grid-cols-[150px_1fr] gap-5'>
              <span className='text-zinc-700 font-semibold my-auto'>{t('status')}</span>

              <div className='flex'>
                <Tag color='green'>{getStatus(get(product, 'stock', 0))}</Tag>
              </div>
            </div>
          </div>

          <div className='w-full bg-[#fafafa] p-4 rounded-md'>
            <h3 style={{ color: config?.websitePrimaryColor }} className='text-[1.2rem] uppercase'>
              {t('product.description')}
            </h3>
          </div>

          <div className='p-4 whitespace-pre-line'>{get(product, 'description', '')}</div>
        </section>
      </Card>
    </div>
  );
};

export default DetailForm;
