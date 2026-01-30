import { FormEvent, useState } from 'react';
import { message } from 'antd';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useList } from '../../hooks/useList';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import { useDelete } from '../../hooks/useDelete';

export interface FilterType {
  page: number;
  q: string;
  productId: string;
  rate: string;
}

const ReviewListPage = () => {
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const productId = searchParams.get('productId') ?? '';
  const rate = searchParams.get('rate') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
    productId: productId,
    rate: rate,
  });

  const { data, loading, error, paging, params, setParams, fetchData } = useList({
    page: filter.page,
    q: filter.q,
    productId: filter.productId,
    rate: filter.rate,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { mutate: deleteMutate, loading: deleteLoading } = useDelete();

  const handleChangeFilter = (key: string, value: string) => {
    setFilter({
      ...filter,
      [key]: value,
    });
  };

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setParams({ ...params, page: page });
    updateParams({ page: page.toString() });
  };

  const handleApplyFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('APPLY FILTER:', filter);

    setFilter({ ...filter, page: 1 });

    setParams({
      page: 1,
      q: filter.q,
      productId: filter.productId,
      rate: filter.rate,
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
      productId: filter.productId,
      rate: filter.rate,
    });
  };

  const handleActionItem = async (name: string, value: any) => {
    if (name === 'delete') {
      const res = await deleteMutate(value?.id);

      if (res.success) {
        message.success(res.message);
        fetchData(params);
      }
    }
  };

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='flex flex-col gap-5'>
      <FilterBar
        filter={filter}
        handleChangeFilter={handleChangeFilter}
        handleApplyFilter={handleApplyFilter}
      />

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
          handleActionItem={handleActionItem}
        />
      )}
    </div>
  );
};

export default ReviewListPage;
