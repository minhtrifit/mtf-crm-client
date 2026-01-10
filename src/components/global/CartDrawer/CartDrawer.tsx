import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { Drawer } from 'antd';

interface PropType {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = (props: PropType) => {
  const { open, onClose } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const carts = useSelector((state: RootState) => state.carts.items);

  console.log(carts);

  return (
    <Drawer
      title={t('cart')}
      closable={{ 'aria-label': 'Close Button' }}
      onClose={onClose}
      open={open}
    >
      Item
    </Drawer>
  );
};

export default CartDrawer;
