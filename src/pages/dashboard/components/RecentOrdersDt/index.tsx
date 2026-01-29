import { useMemo } from 'react';
import { get } from 'lodash';
import { Order } from '@/types/order';
import { formatCurrency, formatDateTime } from '@/+core/helpers';
import { DeliveryStatus, OrderStatus } from '@/+core/constants/commons.constant';
import { Avatar, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdOutlineBookmarkAdded, MdPaid, MdPending, MdCancel } from 'react-icons/md';
import { FaUser, FaRegCheckCircle, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';

const { Column } = Table;

interface PropType {
  data: Order[];
}

const RecentOrdersDataTable = (props: PropType) => {
  const { data } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const STATUS_OPTIONS = [
    {
      value: OrderStatus.PAID,
      label: t('order.paid'),
      icon: <MdPaid size={20} className='text-green-500' />,
    },
    {
      value: OrderStatus.PENDING,
      label: t('order.pending'),
      icon: <MdPending size={20} className='text-yellow-500' />,
    },
    {
      value: OrderStatus.CANCELLED,
      label: t('order.cancelled'),
      icon: <MdCancel size={20} className='text-red-500' />,
    },
  ];

  const DELIVERY_STATUS_OPTIONS = [
    {
      value: DeliveryStatus.ORDERED,
      label: t('delivery.ordered'),
      icon: <FaRegCreditCard size={20} />,
    },
    {
      value: DeliveryStatus.CONFIRMED,
      label: t('delivery.confirmed'),
      icon: <MdOutlineBookmarkAdded size={20} />,
    },
    {
      value: DeliveryStatus.PREPARING,
      label: t('delivery.preparing'),
      icon: <PiPackageBold size={20} />,
    },
    {
      value: DeliveryStatus.SHIPPING,
      label: t('delivery.shipping'),
      icon: <FaTruck size={20} />,
    },
    {
      value: DeliveryStatus.DELIVERED,
      label: t('delivery.delivered'),
      icon: <FaRegCheckCircle size={20} />,
    },
  ];

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => {
      return { ...item, key: item?.id };
    });
  }, [data]);

  return (
    <div className='block__container flex flex-col gap-3'>
      <div className='h-[40px] flex items-center justify-between'>
        <h3 className='text-[16px] text-[#495057] whitespace-nowrap'>{t('recent_orders')}</h3>
      </div>

      <div className='w-full max-w-full'>
        <Table
          dataSource={TABLE_DATA}
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(`/admin/order/detail/${get(record, 'id', '')}`);
              },
            };
          }}
        >
          <Column
            title={t('user.default')}
            dataIndex='user'
            key='user'
            minWidth={300}
            render={(_, record) => {
              return (
                <div className='flex items-center gap-3'>
                  <Avatar
                    size={50}
                    src={get(record, 'user.avatar', '')}
                    icon={<FaUser size={18} />}
                    className={`${!get(record, 'user.avatar', '') && 'bg-primary'}`}
                  />

                  <div className='flex flex-col gap-1'>
                    <span className='font-semibold'>{get(record, 'user.fullName', '')}</span>
                    <span className='text-[0.8rem] text-zinc-700'>
                      {get(record, 'user.email', '')}
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <Column
            title={t('grand_total')}
            dataIndex='totalAmount'
            key='totalAmount'
            minWidth={150}
            render={(_, record) => {
              return <span>{formatCurrency(get(record, 'totalAmount', 0))}</span>;
            }}
          />
          {/* <Column
            title={t('status')}
            dataIndex='status'
            key='status'
            minWidth={200}
            render={(_, record) => {
              const status = STATUS_OPTIONS.find((s) => s.value === get(record, 'status', ''));

              return (
                <div className='flex items-center gap-2'>
                  {get(status, 'icon', null)}
                  <span>{get(status, 'label', '')}</span>
                </div>
              );
            }}
          /> */}
          {/* <Column
            title={t('delivery_status')}
            dataIndex='deliveryStatus'
            key='deliveryStatus'
            minWidth={200}
            render={(_, record) => {
              const status = DELIVERY_STATUS_OPTIONS.find(
                (s) => s.value === get(record, 'deliveryStatus', ''),
              );

              return (
                <div className='flex items-center gap-3'>
                  {get(status, 'icon', null)}

                  <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                    {get(status, 'label', '')}
                  </span>
                </div>
              );
            }}
          /> */}
          <Column
            title={t('order_at')}
            dataIndex='createdAt'
            key='createdAt'
            minWidth={180}
            render={(_, record) => {
              return <span>{formatDateTime(get(record, 'createdAt', ''))}</span>;
            }}
          />
        </Table>
      </div>
    </div>
  );
};

export default RecentOrdersDataTable;
