import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { Avatar, Button, Card, Divider, notification, Pagination, Popconfirm, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { removeFromCart, updateCartQuantity } from '@/store/actions/cart.action';
import { formatCurrency } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollToId } from '@/hooks/useScrollToId';
import { isPaymentStep, PAYMENT_STEP } from '../Step';
import QuantityInput from '@/components/ui/QuantityInput/QuantityInput';
import CartEmpty from '../CartEmpty';
import { FiShoppingBag } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

const { Column } = Table;

const CartForm = () => {
  const { updateParams } = useQueryParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useIsMobile(1024);
  const scrollToId = useScrollToId();

  const carts = useSelector((state: RootState) => state.carts.items);
  const total = useSelector((state: RootState) => state.carts.total);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handleUpdateStep = (value: PAYMENT_STEP) => {
    if (!isPaymentStep(value)) {
      notification.error({
        message: t('notification'),
        description: t('invalid_data'),
        placement: 'bottomLeft',
      });
    }

    updateParams({ step: value });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateCartQuantity({ productId, quantity }));
  };

  const handleConfirmClearItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleChangePage = (value: number) => {
    setPagination({ ...pagination, current: value });
    scrollToId('mobile-cart-table', { offset: 150 });
  };

  const TABLE_DATA = useMemo(() => {
    if (!carts) return;

    return carts?.map((c) => {
      return { ...c?.product, key: c?.product?.id, quantity: c?.quantity };
    });
  }, [carts]);

  const PAGED_TABLE_DATA = useMemo(() => {
    if (!TABLE_DATA) return [];

    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;

    return TABLE_DATA?.slice(start, end);
  }, [TABLE_DATA, pagination.current, pagination.pageSize]);

  if (carts?.length === 0) return <CartEmpty />;

  return (
    <Card
      styles={{
        body: {
          padding: 15,
          borderTop: '1px solid #f5f5f5',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <div className='w-full flex flex-col'>
        {isMobile ? (
          <div id='mobile-cart-table' className='w-full flex flex-col gap-10 mb-5'>
            <div className='flex flex-col gap-5'>
              {PAGED_TABLE_DATA?.map((record, index) => {
                return (
                  <div key={get(record, 'key', '')} className='flex flex-col gap-5 shadow-md p-2'>
                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='font-semibold'>#</span>
                      <span className='text-zinc-700'>
                        {(pagination.current - 1) * pagination.pageSize + index + 1}
                      </span>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='font-semibold'>{t('product.name')}</span>
                      <div className='flex items-center gap-3'>
                        <Avatar
                          shape='square'
                          size={50}
                          src={get(record, 'imagesUrl[0]', '')}
                          icon={<FiShoppingBag />}
                        />
                        <span>{get(record, 'name', '')}</span>
                      </div>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='font-semibold'>{t('price')}</span>
                      <span className='text-zinc-700'>
                        {formatCurrency(get(record, 'price', 0))}
                      </span>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='font-semibold'>{t('quantity')}</span>
                      <div className='flex items-center gap-5'>
                        <QuantityInput
                          min={1}
                          max={get(record, 'stock', 0)}
                          value={get(record, 'quantity', 0)}
                          onChange={(value: number) =>
                            handleUpdateQuantity(get(record, 'id', ''), value)
                          }
                        />

                        <Popconfirm
                          title={t('confirm')}
                          description={t('clear_product_confirm')}
                          onConfirm={() => handleConfirmClearItem(get(record, 'id', ''))}
                          okText={t('yes')}
                          cancelText={t('cancel')}
                        >
                          <Button type='primary' danger>
                            <FaTrash />
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='font-semibold'>{t('total')}</span>
                      <span className='text-zinc-700'>
                        {formatCurrency(get(record, 'quantity', 0) * get(record, 'price', 0))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {carts?.length > DEFAULT_PAGE_SIZE && (
              <Pagination
                className='mx-auto'
                showSizeChanger={false}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={carts?.length}
                onChange={(value) => handleChangePage(value)}
              />
            )}
          </div>
        ) : (
          <Table
            dataSource={TABLE_DATA}
            pagination={
              carts?.length <= DEFAULT_PAGE_SIZE
                ? false
                : {
                    ...pagination,
                    total: carts?.length,
                    showSizeChanger: false,
                    onChange: (value) => setPagination({ ...pagination, current: value }),
                  }
            }
          >
            <Column
              title='#'
              key='index'
              width={60}
              align='center'
              render={(_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1}
            />
            <Column
              title={t('product.name')}
              dataIndex='name'
              key='name'
              width={200}
              render={(_, record) => {
                return (
                  <div className='flex items-center gap-3'>
                    <Avatar
                      shape='square'
                      size={50}
                      src={get(record, 'imagesUrl[0]', '')}
                      icon={<FiShoppingBag />}
                    />
                    <span>{get(record, 'name', '')}</span>
                  </div>
                );
              }}
            />
            <Column
              title={t('price')}
              dataIndex='price'
              key='price'
              width={120}
              render={(_, record) => {
                return <span>{formatCurrency(get(record, 'price', 0))}</span>;
              }}
            />
            <Column
              title={t('quantity')}
              dataIndex='quantity'
              key='quantity'
              width={100}
              render={(_, record) => {
                return (
                  <div className='flex items-center gap-5'>
                    <QuantityInput
                      min={1}
                      max={get(record, 'stock', 0)}
                      value={get(record, 'quantity', 0)}
                      onChange={(value: number) =>
                        handleUpdateQuantity(get(record, 'id', ''), value)
                      }
                    />

                    <Popconfirm
                      title={t('confirm')}
                      description={t('clear_product_confirm')}
                      onConfirm={() => handleConfirmClearItem(get(record, 'id', ''))}
                      okText={t('yes')}
                      cancelText={t('cancel')}
                    >
                      <Button type='primary' danger>
                        <FaTrash />
                      </Button>
                    </Popconfirm>
                  </div>
                );
              }}
            />
            <Column
              title={t('total')}
              dataIndex='total'
              key='total'
              width={100}
              render={(_, record) => {
                return (
                  <span>
                    {formatCurrency(get(record, 'quantity', 0) * get(record, 'price', 0))}
                  </span>
                );
              }}
            />
          </Table>
        )}

        <Divider className='mt-0' />

        <section className='w-full flex justify-end'>
          <div className='w-[350px] flex flex-col gap-5'>
            <div className='flex flex-col gap-5'>
              <div className='grid grid-cols-2 gap-5'>
                <span className='text-[1.05rem] font-bold'>{t('grand_total')}</span>
                <span className='text-[1.05rem] text-zinc-700'>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              type='primary'
              disabled={carts?.length === 0}
              onClick={() => {
                handleUpdateStep(PAYMENT_STEP.CHECKOUT);
              }}
            >
              {t('continue')}
            </Button>
          </div>
        </section>
      </div>
    </Card>
  );
};

export default CartForm;
