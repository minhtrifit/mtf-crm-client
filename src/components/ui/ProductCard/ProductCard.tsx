import { get } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '@/store/store';
import { addToCart } from '@/store/actions/cart.action';
import { Button, Card, Image, message, Rate, Tooltip } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { formatCurrency } from '@/+core/helpers';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Product } from '@/types/product';
import styles from './styles.module.scss';
import { WEBSITE_ROUTE } from '@/routes/route.constant';

interface PropType {
  product: Product;
}

const ProductCard = (props: PropType) => {
  const { product } = props;

  const { config } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.users.user);

  const handleRedirectDetailProduct = (slug: string) => {
    navigate(`/san-pham/${slug}`);
  };

  const handleAddToCard = () => {
    if (!user) {
      navigate(`${WEBSITE_ROUTE.LOGIN}?website-redirect=${location.pathname}`);
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    message.success(t('add_to_cart_successfully'));
  };

  return (
    <Card
      className={styles.product__card}
      style={{
        ['--primary-color' as any]: config?.websitePrimaryColor,
      }}
      styles={{
        body: {
          padding: 12,
          borderTop: '1px solid #f5f5f5',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      }}
      cover={
        <Image
          preview={false}
          className='p-[1px] rounded-t-lg hover:cursor-pointer'
          src={get(product, 'imagesUrl[0]', '')}
          onClick={() => {
            handleRedirectDetailProduct(get(product, 'slug', ''));
          }}
        />
      }
    >
      <div className='flex flex-col gap-5'>
        <span
          className='text-[1rem] min-h-[50px] line-clamp-2 hover:cursor-pointer'
          onClick={() => {
            handleRedirectDetailProduct(get(product, 'slug', ''));
          }}
        >
          {get(product, 'name', '')}
        </span>

        <div className='flex flex-col gap-1'>
          <span
            style={{ color: config?.websitePrimaryColor }}
            className='text-[1.15rem] font-semibold'
          >
            {formatCurrency(get(product, 'price', ''))}
          </span>

          <Rate value={5} disabled />
        </div>

        <div className='w-full flex items-center justify-between gap-5'>
          <div className='opacity-0'>action</div>

          <Tooltip title={t('add_to_cart')}>
            <Button
              type='primary'
              onClick={(e) => {
                handleAddToCard();
              }}
            >
              <AiOutlineShoppingCart size={20} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
