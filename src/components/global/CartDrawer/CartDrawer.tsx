import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { Avatar, Button, Drawer, Empty, notification, Popconfirm } from 'antd';
import { CartItem } from '@/types';
import { formatCurrency } from '@/+core/helpers';
import {
  clearCart,
  removeFromCart,
  toggleCartModal,
  updateCartQuantity,
} from '@/store/actions/cart.action';
import QuantityInput from '@/components/ui/QuantityInput/QuantityInput';
import { FiShoppingBag } from 'react-icons/fi';
import { FaTrash, FaRegCreditCard } from 'react-icons/fa';

interface PropType {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = (props: PropType) => {
  const { open, onClose } = props;

  const { config } = useAppConfig();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const total = useSelector((state: RootState) => state.carts.total);
  const carts = useSelector((state: RootState) => state.carts.items);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateCartQuantity({ productId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(toggleCartModal());
    notification.success({
      message: t('notification'),
      description: t('clear_cart_successfully'),
      placement: 'bottomLeft',
    });
  };

  const handleCheckout = () => {
    dispatch(toggleCartModal());
    navigate(`/thanh-toan?step=1`);
  };

  const handleConfirmClearItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Drawer
      width={450}
      title={t('cart')}
      closable={{ 'aria-label': 'Close Button' }}
      onClose={onClose}
      open={open}
      footer={
        <div className='py-4 flex flex-col gap-5'>
          <span
            style={{ color: config?.websitePrimaryColor }}
            className='text-[1rem] font-semibold'
          >
            {t('grand_total')}: {formatCurrency(total)}
          </span>

          <div className='grid grid-cols-2 gap-3'>
            <Popconfirm
              title={t('confirm')}
              description={t('clear_cart_confirm')}
              onConfirm={handleClearCart}
              okText={t('yes')}
              cancelText={t('cancel')}
            >
              <Button disabled={carts?.length === 0} icon={<FaTrash />}>
                {t('clear_cart')}
              </Button>
            </Popconfirm>

            <Button
              disabled={carts?.length === 0}
              icon={<FaRegCreditCard />}
              type='primary'
              onClick={handleCheckout}
            >
              {t('checkout')}
            </Button>
          </div>
        </div>
      }
    >
      <div className='max-h-full overflow-y-auto flex flex-col gap-5'>
        {carts?.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

        {carts?.map((item: CartItem) => {
          const product = item.product;

          return (
            <div key={get(product, 'id', '')} className='flex items-center gap-5'>
              <Avatar
                shape='square'
                size={80}
                src={get(product, 'imagesUrl[0]', '')}
                icon={<FiShoppingBag />}
                className='shrink-0'
              />

              <div className='w-full flex flex-col gap-3'>
                <span className='text-[0.8rem] text-zinc-700'>{get(product, 'name', '')}</span>

                <span
                  style={{ color: config?.websitePrimaryColor }}
                  className='text-[0.85rem] font-semibold'
                >
                  {formatCurrency(get(product, 'price', 0))}
                </span>

                <div className='flex items-center justify-between gap-5'>
                  <QuantityInput
                    min={0}
                    max={get(product, 'stock', 0)}
                    value={get(item, 'quantity', 0)}
                    onChange={(value: number) =>
                      handleUpdateQuantity(get(product, 'id', ''), value)
                    }
                  />

                  <Popconfirm
                    title={t('confirm')}
                    description={t('clear_product_confirm')}
                    onConfirm={() => handleConfirmClearItem(get(product, 'id', ''))}
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
          );
        })}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
