import { FormEvent, useState } from 'react';
import { message } from 'antd';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useNavigate } from 'react-router-dom';
import { useList } from '../../hooks/useList';
import { useCreate } from '../../hooks/useCreate';
import { useDetail } from '../../hooks/useDetail';
import { useEdit } from '../../hooks/useEdit';
import { useDelete } from '../../hooks/useDelete';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { Policy } from '@/types/policy';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';

export interface FilterType {
  page: number;
  q: string;
}

const PolicyListPage = () => {
  const { searchParams, updateParams } = useQueryParams();
  const navigate = useNavigate();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
  });
  const [policy, setPolicy] = useState<Policy | null>(null);

  const { data, loading, error, paging, params, setParams, fetchData } = useList({
    page: filter.page,
    q: filter.q,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { loading: deleteLoading, mutate: deleteMutate } = useDelete();

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
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
    });
  };

  const handleActionItem = async (name: string, value: any) => {
    if (name === 'detail') {
      navigate(`/admin/policy/detail/${value?.id}`);
    }

    if (name === 'edit') {
      navigate(`/admin/policy/edit/${value?.id}`);
    }

    if (name === 'delete') {
      const res = await deleteMutate(value?.id);

      if (res.success) {
        message.success(res.message);
        fetchData(params); // Refetch list API
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

export default PolicyListPage;
