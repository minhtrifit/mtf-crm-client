import { useMemo, useState } from 'react';
import { get } from 'lodash';
import { Avatar, Card, Divider, Modal, Pagination, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDateTime, formatTimezone } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE, DeliveryStatus } from '@/+core/constants/commons.constant';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { Order } from '@/types/order';
import Label from '@/components/ui/Label/Label';
import Step, { DELIVERY_STATUS_STEP } from '../Step';
import { FiShoppingBag } from 'react-icons/fi';

const { Column } = Table;

interface PropType {
  order: Order | null;
  loading: boolean;
  open: boolean;
  onClose: () => void;
}

const DetailModal = (props: PropType) => {
  const { order, loading, open, onClose } = props;

  const navigate = useNavigate();
  const isMobile = useIsMobile(1024);
  const { t } = useTranslation();

  const payments = get(order, 'payments', []);
  const carts = get(order, 'items', []);

  const [paymentPagination, setPaymentPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [productPagination, setProductPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // PAYMENT DATA
  const PAYMENT_TABLE_DATA = useMemo(() => {
    if (!payments) return;

    return payments?.map((p) => {
      return { ...p, key: p?.id };
    });
  }, [payments]);

  const PAGED_PAYMENT_TABLE_DATA = useMemo(() => {
    if (!PAYMENT_TABLE_DATA) return [];

    const start = (paymentPagination.current - 1) * paymentPagination.pageSize;
    const end = start + paymentPagination.pageSize;

    return PAYMENT_TABLE_DATA?.slice(start, end);
  }, [PAYMENT_TABLE_DATA, paymentPagination.current, paymentPagination.pageSize]);

  // PRODUCT DATA
  const PRODUCT_TABLE_DATA = useMemo(() => {
    if (!carts) return;

    return carts?.map((c) => {
      return { ...c?.product, key: c?.product?.id, quantity: c?.quantity };
    });
  }, [carts]);

  const PAGED_PRODUCT_TABLE_DATA = useMemo(() => {
    if (!PRODUCT_TABLE_DATA) return [];

    const start = (productPagination.current - 1) * productPagination.pageSize;
    const end = start + productPagination.pageSize;

    return PRODUCT_TABLE_DATA?.slice(start, end);
  }, [PRODUCT_TABLE_DATA, productPagination.current, productPagination.pageSize]);

  const handleClose = () => {
    onClose();

    setPaymentPagination({
      current: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });

    setProductPagination({
      current: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };

  const formatStep = (value: string) => {
    if (value === DeliveryStatus.ORDERED) return DELIVERY_STATUS_STEP.ORDERED;
    if (value === DeliveryStatus.CONFIRMED) return DELIVERY_STATUS_STEP.CONFIRMED;
    if (value === DeliveryStatus.PREPARING) return DELIVERY_STATUS_STEP.PREPARING;
    if (value === DeliveryStatus.SHIPPING) return DELIVERY_STATUS_STEP.SHIPPING;
    if (value === DeliveryStatus.DELIVERED) return DELIVERY_STATUS_STEP.DELIVERED;

    navigate(WEBSITE_ROUTE.HOME);
  };

  return (
    <Modal width={1200} open={open} onCancel={handleClose} loading={loading} centered footer={null}>
      <div className='w-full max-h-[80vh] overflow-y-auto mt-5 flex flex-col gap-5'>
        <span className='text-[1rem] font-bold text-zinc-700'>{t('delivery_status')}</span>

        <div className='px-2'>
          <Step
            current={
              formatStep(
                get(order, 'deliveryStatus', DeliveryStatus.ORDERED),
              ) as DELIVERY_STATUS_STEP
            }
          />
        </div>

        <span className='text-[1rem] font-bold text-zinc-700'>
          {t('detail')} {t('breadcrumb.order')}
        </span>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
          <div className='flex flex-col gap-3'>
            <Label title={t('order.code')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(order, 'orderCode', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('grand_total')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {formatCurrency(get(order, 'totalAmount', 0))}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('status')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {t(`order.${get(order, 'status', '').toLowerCase()}`)}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('delivery_status')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {t(`delivery.${get(order, 'deliveryStatus', '').toLowerCase()}`)}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('delivery_address')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {get(order, 'deliveryAddress', '')}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('note')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(order, 'note', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('order_at')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {formatDateTime(get(order, 'createdAt', ''))}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.fullName')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(order, 'user.fullName', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.email')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(order, 'user.email', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.phone')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(order, 'user.phone', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.address')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(order, 'user.address', '')}</span>
          </div>
        </div>

        <Divider className='my-0' />

        <span className='text-[1rem] font-bold text-zinc-700'>{t('order.payment_list')}</span>

        {isMobile ? (
          <div className='w-full flex flex-col gap-3'>
            {PAGED_PAYMENT_TABLE_DATA?.map((p) => {
              return (
                <Card key={get(p, 'id', '')}>
                  <div className='flex flex-col gap-5'>
                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='text-[0.8rem] font-semibold'>{t('payment.method')}</span>
                      <span className='text-[0.8rem] text-zinc-700'>
                        {t(`payment.${get(p, 'method', '').toLowerCase()}`)}
                      </span>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='text-[0.8rem] font-semibold'>{t('amount')}</span>
                      <span className='text-[0.8rem] text-zinc-700'>
                        {formatCurrency(get(p, 'amount', 0))}
                      </span>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='text-[0.8rem] font-semibold'>{t('paid_at')}</span>
                      <span className='text-[0.8rem] text-zinc-700'>
                        {formatTimezone(get(p, 'paidAt', ''))}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}

            {payments?.length > DEFAULT_PAGE_SIZE && (
              <div className='mt-3 mx-auto'>
                <Pagination
                  showSizeChanger={false}
                  current={paymentPagination.current}
                  pageSize={paymentPagination.pageSize}
                  total={carts?.length}
                  onChange={(value) => {
                    setPaymentPagination({ ...paymentPagination, current: value });
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <Table
            bordered
            dataSource={PAYMENT_TABLE_DATA}
            scroll={{ x: 'max-content' }}
            pagination={
              payments?.length <= DEFAULT_PAGE_SIZE
                ? false
                : {
                    ...paymentPagination,
                    total: payments?.length,
                    showSizeChanger: false,
                    onChange: (value) =>
                      setPaymentPagination({ ...paymentPagination, current: value }),
                  }
            }
          >
            <Column
              title={t('order.payment_method')}
              dataIndex='payment_method'
              key='payment_method'
              width={200}
              render={(_, record) => {
                return <span>{t(`payment.${get(record, 'method', '').toLowerCase()}`)}</span>;
              }}
            />
            <Column
              title={t('amount')}
              dataIndex='amount'
              key='amount'
              width={120}
              render={(_, record) => {
                return <span>{formatCurrency(get(record, 'amount', 0))}</span>;
              }}
            />
            <Column
              title={t('paid_at')}
              dataIndex='paidAt'
              key='paidAt'
              minWidth={150}
              width={150}
              render={(_, record) => {
                return <span>{formatTimezone(get(record, 'paidAt', ''))}</span>;
              }}
            />
          </Table>
        )}

        <Divider className='my-0' />

        <span className='text-[1rem] font-bold text-zinc-700'>{t('order.product_list')}</span>

        {isMobile ? (
          <div className='w-full flex flex-col gap-3'>
            {PAGED_PRODUCT_TABLE_DATA?.map((product, index) => {
              return (
                <Card key={get(product, 'id', '')}>
                  <div className='flex flex-col gap-5'>
                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='text-[0.8rem] font-semibold'>#</span>
                      <span className='text-[0.8rem] text-zinc-700'>
                        {(productPagination.current - 1) * productPagination.pageSize + index + 1}
                      </span>
                    </div>

                    <div
                      className='grid grid-cols-[120px_1fr] gap-3 hover:cursor-pointer'
                      onClick={() => {
                        navigate(`/san-pham/${get(product, 'slug', '')}`);
                      }}
                    >
                      <Avatar
                        shape='square'
                        size={50}
                        src={get(product, 'imagesUrl[0]', '')}
                        icon={<FiShoppingBag />}
                      />
                      <span>{get(product, 'name', '')}</span>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='text-[0.8rem] font-semibold'>{t('price')}</span>
                      <span className='text-[0.8rem] text-zinc-700'>
                        {formatCurrency(get(product, 'price', 0))}
                      </span>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='text-[0.8rem] font-semibold'>{t('quantity')}</span>
                      <span className='text-[0.8rem] text-zinc-700'>
                        {formatCurrency(get(product, 'quantity', 0))}
                      </span>
                    </div>

                    <div className='grid grid-cols-[120px_1fr] gap-3'>
                      <span className='text-[0.8rem] font-semibold'>{t('total')}</span>
                      <span className='text-[0.8rem] text-zinc-700'>
                        {formatCurrency(get(product, 'quantity', 0) * get(product, 'price', 0))}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}

            {carts?.length > DEFAULT_PAGE_SIZE && (
              <div className='mt-3 mx-auto'>
                <Pagination
                  showSizeChanger={false}
                  current={productPagination.current}
                  pageSize={productPagination.pageSize}
                  total={carts?.length}
                  onChange={(value) => {
                    setProductPagination({ ...productPagination, current: value });
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <Table
            bordered
            dataSource={PRODUCT_TABLE_DATA}
            scroll={{ x: 'max-content' }}
            pagination={
              carts?.length <= DEFAULT_PAGE_SIZE
                ? false
                : {
                    ...productPagination,
                    total: carts?.length,
                    showSizeChanger: false,
                    onChange: (value) =>
                      setProductPagination({ ...productPagination, current: value }),
                  }
            }
          >
            <Column
              title='#'
              key='index'
              width={60}
              align='center'
              render={(_, __, index) =>
                (productPagination.current - 1) * productPagination.pageSize + index + 1
              }
            />
            <Column
              title={t('product.name')}
              dataIndex='name'
              key='name'
              width={300}
              minWidth={300}
              render={(_, record) => {
                return (
                  <div
                    className='flex items-center gap-3 hover:cursor-pointer'
                    onClick={() => {
                      navigate(`/san-pham/${get(record, 'slug', '')}`);
                    }}
                  >
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
                return <span>{formatCurrency(get(record, 'quantity', 0))}</span>;
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
      </div>
    </Modal>
  );
};

export default DetailModal;
