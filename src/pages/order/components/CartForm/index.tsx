import { Avatar, Button, Card, Empty, Popconfirm, Typography } from 'antd';
import { Product } from '@/types/product';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FiShoppingBag } from 'react-icons/fi';
import { formatCurrency } from '@/+core/helpers';
import QuantityInput from '@/components/ui/QuantityInput/QuantityInput';
import { FaTrash } from 'react-icons/fa';

const { Text } = Typography;

interface PropType {
  data: {
    product: Product;
    quantity: number;
  }[];
  error?: boolean;
  errorMessage?: string;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartForm = (props: PropType) => {
  const { data, error, errorMessage, updateQuantity, removeFromCart, clearCart } = props;

  const { t } = useTranslation();

  return (
    <div className='w-full flex flex-col gap-5'>
      <div className='w-full flex flex-wrap items-end justify-between gap-5'>
        <h3 className='my-0 text-primary'>
          {t('cart')} ({data?.length})
        </h3>

        <Popconfirm
          title={t('confirm')}
          description={t('clear_cart_confirm')}
          onConfirm={clearCart}
          okText={t('yes')}
          cancelText={t('cancel')}
        >
          <Button disabled={data?.length === 0} icon={<FaTrash />}>
            {t('clear_cart')}
          </Button>
        </Popconfirm>
      </div>

      {data?.length === 0 ? (
        <div className='flex flex-col gap-3'>
          <div className={`rounded-md ${error && 'border border-dashed border-red-500'}`}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>

          {error && (
            <Typography.Text type='danger' style={{ fontSize: 12 }}>
              {errorMessage}
            </Typography.Text>
          )}
        </div>
      ) : (
        <div className='w-full max-h-[calc(100vh-450px)] overflow-y-auto flex flex-col gap-5'>
          {data?.map((item) => {
            const product = get(item, 'product', null);

            return (
              <Card key={get(product, 'id', '')}>
                <div className='flex items-center gap-5'>
                  <Avatar
                    shape='square'
                    size={80}
                    src={get(product, 'imagesUrl[0]', '')}
                    icon={<FiShoppingBag />}
                    className='shrink-0'
                  />

                  <div className='w-full flex flex-col gap-3'>
                    <span className='text-[0.8rem] text-zinc-700'>{get(product, 'name', '')}</span>

                    <span className='text-[0.85rem] font-semibold'>
                      {formatCurrency(get(product, 'price', 0))}
                    </span>

                    <div className='flex flex-wrap items-center justify-between gap-5'>
                      <QuantityInput
                        min={0}
                        max={get(product, 'stock', 0)}
                        value={get(item, 'quantity', 0)}
                        onChange={(value: number) => updateQuantity(get(product, 'id', ''), value)}
                      />

                      <Popconfirm
                        title={t('confirm')}
                        description={t('clear_product_confirm')}
                        onConfirm={() => removeFromCart(get(product, 'id', ''))}
                        okText={t('yes')}
                        cancelText={t('cancel')}
                      >
                        <Button type='primary' danger>
                          <FaTrash />
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CartForm;
