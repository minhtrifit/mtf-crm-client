import { get } from 'lodash';
import { Pagination, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { Payment, PaymentFilterType } from '@/types/payment';
import { PagingType } from '@/types';
import { formatCurrency, formatTimezone } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';

const { Column } = Table;

interface PropType {
  filter: PaymentFilterType;
  data: Payment[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
}

const DataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange } = props;

  const { t } = useTranslation();

  return (
    <section className='w-full flex flex-col gap-[20px]'>
      <Table dataSource={data} pagination={false} bordered scroll={{ x: 'max-content' }}>
        <Column
          title='#'
          key='index'
          width={60}
          align='center'
          render={(_, __, index) => (filter.page - 1) * DEFAULT_PAGE_SIZE + index + 1}
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
