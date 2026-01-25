import { useMemo } from 'react';
import { get } from 'lodash';
import { Button, Pagination, Table, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Payment, PaymentFilterType } from '@/types/payment';
import { PagingType } from '@/types';
import { formatCurrency, formatTimezone } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE, PaymentMethod } from '@/+core/constants/commons.constant';
import { FaPen, FaTruck } from 'react-icons/fa';

const { Column } = Table;

interface PropType {
  filter: PaymentFilterType;
  data: Payment[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  isShowOrderCode?: boolean;
  handleActionItem?: (name: string, value: any) => Promise<void>;
}

const DataTable = (props: PropType) => {
  const {
    filter,
    data,
    paging,
    handlePageChange,
    isShowOrderCode = false,
    handleActionItem,
  } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const PAYMENT_OPTIONS = [
    {
      value: PaymentMethod.COD,
      label: t('payment.cod'),
      icon: <FaTruck size={20} />,
    },
    {
      value: PaymentMethod.VNPAY,
      label: t('payment.vnpay'),
      icon: <img className='w-[20px]' src='/assets/icons/icon-vnpay.png' alt='vnpay-icon' />,
    },
  ];

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => {
      return { ...item, key: item?.id };
    });
  }, [data]);

  return (
    <section className='w-full flex flex-col gap-[20px]'>
      <Table dataSource={TABLE_DATA} pagination={false} bordered scroll={{ x: 'max-content' }}>
        <Column
          title='#'
          key='index'
          width={60}
          align='center'
          render={(_, __, index) => (filter.page - 1) * DEFAULT_PAGE_SIZE + index + 1}
        />
        {isShowOrderCode && (
          <Column
            title={t('order.code')}
            dataIndex='orderCode'
            key='orderCode'
            width={100}
            minWidth={150}
            render={(_, record) => {
              return (
                <span
                  className='text-primary font-semibold text-[0.8rem] hover:underline hover:cursor-pointer'
                  onClick={() => {
                    navigate(`/admin/order/detail/${record?.order?.id}`);
                  }}
                >
                  {get(record, 'order.orderCode', '')}
                </span>
              );
            }}
          />
        )}
        <Column
          title={t('order.payment_method')}
          dataIndex='payment_method'
          key='payment_method'
          width={200}
          minWidth={250}
          render={(_, record) => {
            const method = PAYMENT_OPTIONS.find((p) => p.value === get(record, 'method', ''));

            return (
              <div className='flex items-center gap-3'>
                {get(method, 'icon', null)}
                <span>{get(method, 'label', '')}</span>
              </div>
            );
          }}
        />
        <Column
          title={t('amount')}
          dataIndex='amount'
          key='amount'
          width={120}
          minWidth={150}
          render={(_, record) => {
            return <span>{formatCurrency(get(record, 'amount', 0))}</span>;
          }}
        />
        <Column
          title={t('paid_at')}
          dataIndex='paidAt'
          key='paidAt'
          width={100}
          minWidth={200}
          render={(_, record) => {
            return <span>{formatTimezone(get(record, 'paidAt', ''))}</span>;
          }}
        />
        {handleActionItem && (
          <Column
            title={t('action')}
            key='action'
            width={100}
            fixed='right'
            render={(_, record) => {
              return (
                <div className='flex items-center gap-2'>
                  <Tooltip title={t('edit')}>
                    <Button
                      color='gold'
                      variant='solid'
                      icon={<FaPen />}
                      onClick={() => {
                        handleActionItem('edit', record);
                      }}
                    />
                  </Tooltip>
                </div>
              );
            }}
          />
        )}
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
