import { FormEvent, useState } from 'react';
import { message } from 'antd';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useList } from '../../hooks/useList';
import { useDetail } from '../../hooks/useDetail';
import { useEdit } from '../../hooks/useEdit';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { Customer } from '@/types/customer';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';

export interface FilterType {
  page: number;
  q: string;
  isActive: string;
}

const CustomerListPage = () => {
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const isActive = searchParams.get('isActive') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
    isActive: isActive,
  });
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'detail' | null }>({
    open: false,
    mode: null,
  });

  const { data, loading, error, paging, params, setParams, fetchData } = useList({
    page: filter.page,
    q: filter.q,
    isActive: filter.isActive,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { fetchData: fetchDetailCustomer } = useDetail();
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
      isActive: filter.isActive,
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
      isActive: filter.isActive,
    });
  };

  const handleOpenModal = (mode: 'add' | 'edit' | 'detail', value: Customer | null) => {
    setModal({ open: true, mode: mode });
    setCustomer(value);
  };

  const handleCloseModal = () => {
    setModal({ open: false, mode: null });
    setCustomer(null);
  };

  const handleConfirmModal = async (mode: 'add' | 'edit' | 'detail', data: Customer) => {
    if (mode === 'edit' && customer) {
      const res = await editMutate(customer?.id, data);

      if (res.success) {
        message.success(res.message);
        fetchData(params); // Refetch list API
        handleCloseModal();
      }
    }
  };

  const handleActionItem = async (name: string, value: any) => {
    if (name === 'edit') {
      const res = await fetchDetailCustomer(value?.id);

      if (res) {
        setCustomer(res);
        handleOpenModal('edit', res);
      }
    }
  };

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='flex flex-col gap-5'>
      <FormModal
        open={modal.open}
        defaultValues={customer}
        mode={modal.mode as 'add' | 'edit' | 'detail'}
        loading={editLoading}
        onOk={handleConfirmModal}
        onClose={handleCloseModal}
      />

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

export default CustomerListPage;
