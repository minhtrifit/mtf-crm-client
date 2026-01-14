import { useMemo, useState } from 'react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Divider, Table, Tooltip } from 'antd';
import { Order } from '@/types/order';
import { useNavigate, useParams } from 'react-router-dom';
import Label from '@/components/ui/Label/Label';
import { formatCurrency, formatDateTime, formatTimezone } from '@/+core/helpers';
import { FiShoppingBag } from 'react-icons/fi';
import { FaEye, FaPen } from 'react-icons/fa';

const { Column } = Table;

interface PropType {
  data: Order;
}

const DetailForm = (props: PropType) => {
  const { data } = props;

  const navigate = useNavigate();
  const params = useParams();

  const { t } = useTranslation();

  const id = params?.id ?? '';
  const payments = get(data, 'payments', []);
  const carts = get(data, 'items', []);

  const [paymentPagination, setPaymentPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [productPagination, setProductPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const handleRedirectEdit = (id: string) => {
    navigate(`/admin/order/edit/${id}`);
  };

  const PAYMENT_TABLE_DATA = useMemo(() => {
    if (!payments) return;

    return payments?.map((p) => {
      return { ...p, key: p?.id };
    });
  }, [payments]);

  const PRODUCT_TABLE_DATA = useMemo(() => {
    if (!carts) return;

    return carts?.map((c) => {
      return { ...c?.product, key: c?.product?.id, quantity: c?.quantity };
    });
  }, [carts]);

  return (
    <div className='w-full flex flex-col gap-5'>
      <section className='block__container flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <span className='text-xl text-primary font-bold'>
            {t('detail')} {t('breadcrumb.order')}
          </span>

          <div className='flex items-center justify-center gap-2'>
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
        </div>

        <Divider className='my-0' />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
          <div className='flex flex-col gap-3'>
            <Label title={t('order.code')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(data, 'orderCode', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('grand_total')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {formatCurrency(get(data, 'totalAmount', 0))}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('status')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {t(`order.${get(data, 'status', '').toLowerCase()}`)}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('delivery_status')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {t(`delivery.${get(data, 'deliveryStatus', '').toLowerCase()}`)}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('delivery_address')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(data, 'deliveryAddress', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('note')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(data, 'note', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('order_at')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {formatDateTime(get(data, 'createdAt', ''))}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('updatedAt')} />
            <span className='text-[0.85rem] text-zinc-700'>
              {formatDateTime(get(data, 'updatedAt', ''))}
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.fullName')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.fullName', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.email')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.email', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.phone')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.phone', '')}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('auth.address')} />
            <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.address', '')}</span>
          </div>
        </div>
      </section>

      <section className='block__container flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <span className='text-xl text-primary font-bold'>{t('order.payment_list')}</span>
        </div>

        <Divider className='my-0' />

        <Table
          bordered
          dataSource={PAYMENT_TABLE_DATA}
          pagination={{
            ...paymentPagination,
            total: payments?.length,
            showSizeChanger: false,
            onChange: (value) => setPaymentPagination({ ...paymentPagination, current: value }),
          }}
        >
          <Column
            title='#'
            key='index'
            width={60}
            align='center'
            render={(_, __, index) =>
              (paymentPagination.current - 1) * paymentPagination.pageSize + index + 1
            }
          />
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
            width={100}
            render={(_, record) => {
              return <span>{formatTimezone(get(record, 'paidAt', ''))}</span>;
            }}
          />
        </Table>
      </section>

      <section className='block__container flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <span className='text-xl text-primary font-bold'>{t('order.product_list')}</span>
        </div>

        <Divider className='my-0' />

        <Table
          bordered
          dataSource={PRODUCT_TABLE_DATA}
          pagination={{
            ...productPagination,
            total: carts?.length,
            showSizeChanger: false,
            onChange: (value) => setProductPagination({ ...productPagination, current: value }),
          }}
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
                <span>{formatCurrency(get(record, 'quantity', 0) * get(record, 'price', 0))}</span>
              );
            }}
          />
          <Column
            title={t('action')}
            key='action'
            width={100}
            fixed='right'
            render={(_, record) => {
              return (
                <div className='flex items-center gap-2'>
                  <Tooltip title={t('detail')}>
                    <Button
                      color='primary'
                      variant='solid'
                      icon={<FaEye />}
                      onClick={() => {
                        navigate(`/admin/product/detail/${record?.id}`);
                      }}
                    />
                  </Tooltip>

                  <Tooltip title={t('edit')}>
                    <Button
                      color='gold'
                      variant='solid'
                      icon={<FaPen />}
                      onClick={() => {
                        navigate(`/admin/product/edit/${record?.id}`);
                      }}
                    />
                  </Tooltip>
                </div>
              );
            }}
          />
        </Table>
      </section>
    </div>
  );
};

export default DetailForm;
