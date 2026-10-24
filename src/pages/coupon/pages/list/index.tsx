import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { useList } from '../../hooks/useList';
import { useDelete } from '../../hooks/useDelete';
import { Coupon } from '@/types/coupon';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import Label from '@/components/ui/Label/Label';
import DataTable from '../../components/DataTable';

export interface FilterType {
  page: number;
  q: string;
  isActive: string;
}

const CouponListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [filter, setFilter] = useState<FilterType>({ page: 1, q: '', isActive: '' });

  const { data, paging, loading, error, params, setParams } = useList({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { mutate: deleteCoupon, loading: deleteLoading } = useDelete();

  const handleApplyFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextParams = {
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      ...(filter.q.trim() && { q: filter.q.trim() }),
      ...(filter.isActive && { isActive: filter.isActive }),
    };

    setFilter((previous) => ({ ...previous, page: 1 }));
    setParams(nextParams);
  };

  const handlePageChange = (page: number) => {
    setFilter((previous) => ({ ...previous, page }));
    setParams({ ...params, page });
  };

  const handleDelete = async (coupon: Coupon) => {
    const result = await deleteCoupon(coupon.id);
    if (!result.success) {
      message.error(result.message);
      return;
    }

    message.success(result.message);
    const currentPage = data.length === 1 && filter.page > 1 ? filter.page - 1 : filter.page;
    setFilter((previous) => ({ ...previous, page: currentPage }));
    setParams({ ...params, page: currentPage });
  };

  if (!loading && error) return <Error />;

  return (
    <div className='flex flex-col gap-5'>
      <section className='block__container w-full flex flex-wrap items-end justify-between gap-3'>
        <form onSubmit={handleApplyFilter} className='flex flex-wrap items-end gap-3'>
          <div className='flex flex-col gap-3'>
            <Label title={t('coupon.code')} />
            <Input
              style={{ width: 300 }}
              placeholder={t('coupon.search_placeholder')}
              allowClear
              value={filter.q}
              onChange={(event) =>
                setFilter((previous) => ({ ...previous, q: event.target.value }))
              }
            />
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('status')} />
            <Select
              style={{ width: 200 }}
              placeholder={t('status')}
              allowClear
              value={filter.isActive || undefined}
              options={[
                { value: 'true', label: t('active') },
                { value: 'false', label: t('inactive') },
              ]}
              onChange={(value) =>
                setFilter((previous) => ({ ...previous, isActive: value ?? '' }))
              }
            />
          </div>

          <Button htmlType='submit' type='primary' icon={<SearchOutlined />}>
            {t('search')}
          </Button>
        </form>

        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate(`/admin/${ADMIN_ROUTE.COUPON}/${ADMIN_ROUTE.COUPON_ADD}`)}
        >
          {t('add')}
        </Button>
      </section>

      {loading || deleteLoading ? (
        <div className='mt-10'>
          <DataLoading size='large' />
        </div>
      ) : (
        <DataTable
          filter={filter}
          data={data}
          paging={paging}
          handlePageChange={handlePageChange}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default CouponListPage;
