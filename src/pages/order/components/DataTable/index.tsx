import { useMemo, useState } from 'react';
import { get } from 'lodash';
import { Avatar, Button, Modal, Pagination, Select, Table, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDateTime } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE, DeliveryStatus, OrderStatus } from '@/+core/constants/commons.constant';
import { Order } from '@/types/order';
import { FilterType } from '../../pages/list';
import { PagingType } from '@/types';
import { MdOutlineBookmarkAdded, MdPaid, MdPending, MdCancel } from 'react-icons/md';
import { FaEye, FaPen, FaUser, FaRegCheckCircle, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';

const { Column } = Table;
const { Option } = Select;

interface PropType {
  filter: FilterType;
  data: Order[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  handleActionItem: (name: string, value: any) => Promise<void>;
}

const DataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange, handleActionItem } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [target, setTarget] = useState<{ orderId: string; value: DeliveryStatus } | null>(null);

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

  const handleConfirmChangeDeliveryStatus = () => {
    handleActionItem('deliveryStatus', {
      id: target?.orderId,
      value: target?.value,
    });
  };

  return (
    <section className='block__container flex flex-col gap-[20px]'>
      <Modal
        width={400}
        centered
        title={t('confirm')}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={openConfirmModal}
        onOk={handleConfirmChangeDeliveryStatus}
        onCancel={() => {
          setOpenConfirmModal(false);
        }}
      >
        <span>{t('order.change_delivery_status_confirm')}</span>
      </Modal>

      <Table dataSource={TABLE_DATA} pagination={false} bordered scroll={{ x: 'max-content' }}>
        <Column
          title='#'
          key='index'
          width={60}
          align='center'
          render={(_, __, index) => (filter.page - 1) * DEFAULT_PAGE_SIZE + index + 1}
        />
        <Column
          title={t('order.code')}
          dataIndex='orderCode'
          key='orderCode'
          minWidth={180}
          render={(_, record) => {
            return (
              <span
                className='text-primary font-semibold text-[0.8rem] hover:underline hover:cursor-pointer'
                onClick={() => {
                  navigate(`detail/${record?.id}`);
                }}
              >
                {get(record, 'orderCode', '')}
              </span>
            );
          }}
        />
        <Column
          title={`${t('user.default')} / ${t('customer.default')}`}
          dataIndex='user'
          key='user'
          minWidth={300}
          render={(_, record) => {
            // User render
            if (record?.user) {
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
            }

            // Customer render
            return (
              <div className='flex items-center gap-3'>
                <Avatar
                  size={50}
                  src={get(record, 'customer.fullName', '')}
                  icon={<FaUser size={18} />}
                  className='bg-primary'
                />

                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{get(record, 'customer.fullName', '')}</span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {get(record, 'customer.phone', '')}
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
        <Column
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
        />
        <Column
          title={t('delivery_status')}
          dataIndex='deliveryStatus'
          key='deliveryStatus'
          minWidth={200}
          render={(_, record) => {
            return (
              <Select
                style={{ width: '100%' }}
                variant='borderless'
                placeholder={t('delivery_status')}
                optionFilterProp='label'
                value={get(record, 'deliveryStatus', null)}
                onChange={(value) => {
                  setTarget({
                    orderId: get(record, 'id', ''),
                    value: value,
                  });

                  setOpenConfirmModal(true);
                }}
              >
                {DELIVERY_STATUS_OPTIONS.map((item) => {
                  return (
                    <Option
                      key={`item-${get(item, 'value', '')}`}
                      value={get(item, 'value', '')}
                      label={get(item, 'label', '')}
                    >
                      <div className='flex items-center gap-3'>
                        {get(item, 'icon', null)}

                        <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                          {get(item, 'label', '')}
                        </span>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            );
          }}
        />
        <Column
          title={t('order_at')}
          dataIndex='createdAt'
          key='createdAt'
          minWidth={180}
          render={(_, record) => {
            return <span>{formatDateTime(get(record, 'createdAt', ''))}</span>;
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
                      navigate(`detail/${record?.id}`);
                    }}
                  />
                </Tooltip>

                <Tooltip title={t('edit')}>
                  <Button
                    color='gold'
                    variant='solid'
                    icon={<FaPen />}
                    onClick={() => {
                      navigate(`edit/${record?.id}`);
                    }}
                  />
                </Tooltip>
              </div>
            );
          }}
        />
      </Table>

      <div className='flex items-center justify-between'>
        <span>
          {get(paging, 'total_item', 0)}/{get(paging, 'total', 0)}
        </span>

        <Pagination
          showSizeChanger={false}
          current={filter.page}
          pageSize={DEFAULT_PAGE_SIZE}
          total={get(paging, 'total', 0)}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default DataTable;
