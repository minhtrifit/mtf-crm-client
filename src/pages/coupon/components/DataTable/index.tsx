import { Button, Pagination, Popconfirm, Table, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Coupon } from '@/types/coupon';
import { PagingType } from '@/types';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { formatCurrency, formatDateTime, formatNumber } from '@/+core/helpers';
import { FilterType } from '../../pages/list';
import { FaPen, FaTrash } from 'react-icons/fa';

interface PropType {
  filter: FilterType;
  data: Coupon[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  handleDelete: (coupon: Coupon) => Promise<void>;
}

const DataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange, handleDelete } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const getCouponStatus = (coupon: Coupon, t: (key: string) => string) => {
    if (!coupon.isActive) return <Tag>{t('coupon.inactive_status')}</Tag>;

    const now = Date.now();
    if (new Date(coupon.startsAt).getTime() > now)
      return <Tag color='blue'>{t('coupon.upcoming_status')}</Tag>;
    if (new Date(coupon.expiresAt).getTime() < now)
      return <Tag color='default'>{t('coupon.expired_status')}</Tag>;

    return <Tag color='green'>{t('coupon.active_status')}</Tag>;
  };

  return (
    <section className='block__container flex flex-col gap-5'>
      <Table<Coupon>
        rowKey='id'
        dataSource={data}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      >
        <Table.Column<Coupon>
          title='#'
          key='index'
          width={60}
          align='center'
          render={(_, __, index) => (filter.page - 1) * DEFAULT_PAGE_SIZE + index + 1}
        />
        <Table.Column<Coupon>
          title={t('coupon.code')}
          dataIndex='code'
          key='code'
          width={160}
          render={(code: string) => <span className='font-semibold'>{code}</span>}
        />
        <Table.Column<Coupon>
          title={t('coupon.discount')}
          key='discount'
          width={200}
          render={(_, coupon) =>
            coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatCurrency(coupon.value)
          }
        />
        <Table.Column<Coupon>
          title={t('coupon.usage')}
          dataIndex='usage'
          key='usage'
          width={200}
          render={(_, record) => (
            <span>
              {formatNumber(record.usedCount)} / {formatNumber(record.usageLimit ?? 0)}
            </span>
          )}
        />
        <Table.Column<Coupon>
          title={t('coupon.visibility')}
          dataIndex='isPublic'
          key='isPublic'
          width={180}
          render={(isPublic: boolean) =>
            isPublic ? (
              <Tag color='green'>{t('coupon.public')}</Tag>
            ) : (
              <Tag>{t('coupon.private')}</Tag>
            )
          }
        />
        <Table.Column<Coupon>
          title={t('coupon.starts_at')}
          key='startsAt'
          width={200}
          render={(_, coupon) => <span>{formatDateTime(coupon.startsAt)}</span>}
        />
        <Table.Column<Coupon>
          title={t('coupon.expires_at')}
          key='expiresAt'
          width={200}
          render={(_, coupon) => <span>{formatDateTime(coupon.expiresAt)}</span>}
        />
        <Table.Column<Coupon>
          title={t('status')}
          key='status'
          width={130}
          render={(_, coupon) => getCouponStatus(coupon, t)}
        />
        <Table.Column<Coupon>
          title={t('action')}
          key='action'
          width={110}
          fixed='right'
          render={(_, coupon) => (
            <div className='flex items-center gap-2'>
              <Tooltip title={t('edit')}>
                <Button
                  color='gold'
                  variant='solid'
                  icon={<FaPen />}
                  onClick={() => navigate(`/admin/${ADMIN_ROUTE.COUPON}/edit/${coupon.id}`)}
                />
              </Tooltip>
              <Popconfirm
                title={t('confirm')}
                description={t('coupon.delete_confirm')}
                onConfirm={() => handleDelete(coupon)}
                okText={t('yes')}
                cancelText={t('cancel')}
              >
                <Button danger type='primary' icon={<FaTrash />} />
              </Popconfirm>
            </div>
          )}
        />
      </Table>

      <div className='flex items-center justify-between'>
        <span>
          {paging?.total_item ?? 0}/{paging?.total ?? 0}
        </span>
        <Pagination
          showSizeChanger={false}
          current={filter.page}
          pageSize={DEFAULT_PAGE_SIZE}
          total={paging?.total ?? 0}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default DataTable;
