import { FormEvent, useState } from 'react';
import { message } from 'antd';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useList } from '../../hooks/useList';
import { useEdit } from '../../hooks/useEdit';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { UpdateProductPayload } from '@/types/product';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';

export interface FilterType {
  page: number;
  q: string;
  categoryId: string;
  isActive: string;
}

const ProductListPage = () => {
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const isActive = searchParams.get('isActive') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
    categoryId: categoryId,
    isActive: isActive,
  });

  const { data, loading, error, paging, params, setParams, fetchData } = useList({
    page: filter.page,
    q: filter.q,
    categoryId: filter.categoryId,
    isActive: filter.isActive,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { loading: editLoading, mutate: editMutate } = useEdit();

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
      categoryId: filter.categoryId,
      isActive: filter.isActive,
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
      categoryId: filter.categoryId,
      isActive: filter.isActive,
    });
  };

  const handleActionItem = async (name: string, value: any) => {
    if (name === 'status') {
      const payload: UpdateProductPayload = {
        isActive: value?.value,
      };
      const res = await editMutate(value?.id, payload);
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

      {loading ? (
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

export default ProductListPage;
