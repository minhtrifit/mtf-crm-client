import { useMemo } from 'react';
import { get } from 'lodash';
import { Button, Card, Empty, Pagination, Table, Tooltip } from 'antd';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDateTime } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { FilterType } from '../../pages/orders';
import { Order } from '@/types/order';
import { PagingType } from '@/types';
import { FaEye } from 'react-icons/fa';

const { Column } = Table;

interface PropType {
  filter: FilterType;
  data: Order[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  handleActionItem: (id: string) => void;
}

const DataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange, handleActionItem } = props;

  const isMobile = useIsMobile(1024);
  const { t } = useTranslation();

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => {
      return { ...item, key: item?.id };
    });
  }, [data]);

  if (isMobile) {
    return (
      <section className='flex flex-col gap-3'>
        {TABLE_DATA?.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

        {TABLE_DATA?.map((order, index) => {
          return (
            <Card key={get(order, 'id', '')}>
              <div className='flex flex-col gap-5'>
                <div className='flex items-center justify-end gap-2'>
                  <Tooltip title={t('detail')}>
                    <Button
                      color='primary'
                      variant='solid'
                      icon={<FaEye />}
                      onClick={() => {
                        handleActionItem(order?.id);
                      }}
                    />
                  </Tooltip>
                </div>

                <div className='grid grid-cols-[120px_1fr] gap-3'>
                  <span className='text-[0.8rem] font-semibold'>#</span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {(filter.page - 1) * DEFAULT_PAGE_SIZE + index + 1}
                  </span>
                </div>

                <div className='grid grid-cols-[120px_1fr] gap-3'>
                  <span className='text-[0.8rem] font-semibold'>{t('order.code')}</span>
                  <span className='text-[0.8rem] text-zinc-700'>{get(order, 'orderCode', '')}</span>
                </div>

                <div className='grid grid-cols-[120px_1fr] gap-3'>
                  <span className='text-[0.8rem] font-semibold'>{t('grand_total')}</span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {formatCurrency(get(order, 'totalAmount', 0))}
                  </span>
                </div>

                <div className='grid grid-cols-[120px_1fr] gap-3'>
                  <span className='text-[0.8rem] font-semibold'>{t('status')}</span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {t(`order.${get(order, 'status', '').toLowerCase()}`)}
                  </span>
                </div>

                <div className='grid grid-cols-[120px_1fr] gap-3'>
                  <span className='text-[0.8rem] font-semibold'>{t('order_at')}</span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {formatDateTime(get(order, 'createdAt', ''))}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}

        <div className='mt-3 mx-auto'>
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
  }

  return (
    <section className='flex flex-col gap-[20px]'>
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
              <span className='font-semibold text-[0.8rem]'>{get(record, 'orderCode', '')}</span>
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
            return <span>{t(`order.${get(record, 'status', '').toLowerCase()}`)}</span>;
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
                      handleActionItem(record?.id);
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
