import { useState } from 'react';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addToCart } from '@/store/actions/cart.action';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useGetReviews } from '../../hooks/useGetReviews';
import { useCreateReview } from '../../hooks/useCreateReview';
import { useCheckIsReviewed } from '../../hooks/useCheckIsReviewed';
import { Avatar, Button, Card, Divider, Empty, notification, Rate, Tag } from 'antd';
import { Product, ProductReviewPayload } from '@/types/product';
import { formatCurrency, formatNumber } from '@/+core/helpers';
import ImageGallery from '@/components/ui/ImageGallery/ImageGallery';
import QuantityInput from '@/components/ui/QuantityInput/QuantityInput';
import { CommentSkeleton } from '../Skeleton';
import CommentBox from '../CommentBox';
import CommentFilterBar from '../CommentFilterBar';
import CommentList from '../CommentList';
import { MdCategory } from 'react-icons/md';

interface PropType {
  product: Product;
}

const DetailForm = (props: PropType) => {
  const { product } = props;

  const { config } = useAppConfig();
  const { searchParams, updateParams } = useQueryParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rate = searchParams.get('rate') ?? '';

  const user = useSelector((state: RootState) => state.users.user);

  const {
    data: review,
    loading: loading,
    params,
    setParams,
    fetchData,
  } = useGetReviews(
    product?.id,
    {
      rate: rate,
    },
    {
      delayLoading: true,
    },
  );
  const {
    isReviewed,
    loading: isReviewedLoading,
    checkReviewed,
  } = useCheckIsReviewed(user?.id, product?.id);
  const { mutate: reviewMutate, loading: reviewLoading } = useCreateReview();

  const comments = get(review, 'comments', []);

  const [filter, setFilter] = useState<{ rate: string }>({
    rate: rate,
  });
  const [quantity, setQuantity] = useState<number>(1);

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

  const handleRate = (value: string) => {
    setFilter({ ...filter, rate: value });
    setParams({ ...params, rate: value ? Number(value) : '' });
    updateParams({ rate: value });
  };

  const handleSubmitReview = async (payload: ProductReviewPayload) => {
    const res = await reviewMutate(payload);

    if (res.success) {
      notification.success({
        message: t('notification'),
        description: t(res.message),
        placement: 'bottomLeft',
      });

      checkReviewed(user?.id ?? '', product?.id);
      fetchData(product?.id, params); // Refetch review
    }
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

              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  <Rate count={1} value={1} disabled />
                  <span className='text-[0.9rem]'>{get(product, 'ratingAvg', 0)}</span>
                </div>

                <div className='w-[1px] h-[20px] bg-zinc-200' />

                <span className='text-[0.9rem]'>
                  <span className='text-zinc-500'>{t('product.sold')}</span>{' '}
                  {formatNumber(get(product, 'soldCount', 0))}
                </span>

                <div className='w-[1px] h-[20px] bg-zinc-200' />

                <span className='text-[0.9rem]'>
                  <span className='text-zinc-500'>{t('reviews')}</span>{' '}
                  {formatNumber(get(product, 'reviews', [])?.length)}
                </span>
              </div>

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
              <QuantityInput
                disabled={get(product, 'stock', 0) === 0}
                value={quantity}
                max={get(product, 'stock', 0)}
                onChange={(value: number) => setQuantity(value)}
              />
            </div>

            <div className='mt-5 w-full max-w-[400px] grid grid-cols-2 gap-3'>
              <Button disabled={get(product, 'stock', 0) === 0} onClick={handleAddToCard}>
                {t('add_to_cart')}
              </Button>
              <Button
                disabled={get(product, 'stock', 0) === 0}
                type='primary'
                onClick={handleBuyNow}
              >
                {t(`${get(product, 'stock', 0) === 0 ? 'out_stock' : 'buy_now'}`)}
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
              <span className='text-zinc-700 font-semibold my-auto'>{t('stock')}</span>

              <div className='flex'>
                {get(product, 'stock') === 0 ? (
                  <Tag color='red'>{t('out_stock')}</Tag>
                ) : (
                  <span className='font-bold'>{get(product, 'stock', 0)}</span>
                )}
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
              {t('product.review')}
            </h3>
          </div>

          {loading || isReviewedLoading ? (
            <CommentSkeleton />
          ) : (
            <div className='w-full flex flex-col gap-5'>
              <CommentFilterBar review={review} rate={filter.rate} handleRate={handleRate} />

              {!isReviewed && (
                <CommentBox
                  productId={product?.id}
                  loading={reviewLoading}
                  handleSubmitReview={handleSubmitReview}
                />
              )}

              {!isReviewed && <Divider className='my-0' />}

              {comments?.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <CommentList comments={comments} />
              )}
            </div>
          )}
        </section>
      </Card>
    </div>
  );
};

export default DetailForm;
