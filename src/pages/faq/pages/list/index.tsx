import { FormEvent, useState } from 'react';
import { message } from 'antd';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useList } from '../../hooks/useList';
import { useCreate } from '../../hooks/useCreate';
import { useDetail } from '../../hooks/useDetail';
import { useEdit } from '../../hooks/useEdit';
import { useDelete } from '../../hooks/useDelete';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { Faq } from '@/types/faq';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';

export interface FilterType {
  page: number;
  q: string;
}

const FaqListPage = () => {
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
  });
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'detail' | null }>({
    open: false,
    mode: null,
  });
  const [faq, setFaq] = useState<Faq | null>(null);

  const { data, loading, error, paging, params, setParams, fetchData } = useList({
    page: filter.page,
    q: filter.q,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { loading: detailLoading, fetchData: detailFetchData } = useDetail();
  const { loading: createLoading, mutate: createMutate } = useCreate();
  const { loading: editLoading, mutate: editMutate } = useEdit();
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
      const res = await detailFetchData(value?.id);
      handleOpenModal('detail', res);
    }

    if (name === 'edit') {
      const res = await detailFetchData(value?.id);
      handleOpenModal('edit', res as Faq);
    }

    if (name === 'delete') {
      const res = await deleteMutate(value?.id);

      if (res.success) {
        message.success(res.message);
        fetchData(params); // Refetch list API
      }
    }
  };

  const handleOpenModal = (mode: 'add' | 'edit' | 'detail', value: Faq | null) => {
    setModal({ open: true, mode: mode });
    setFaq(value);
  };

  const handleCloseModal = () => {
    setModal({ open: false, mode: null });
    setFaq(null);
    updateParams({ open: '' });
  };

  const handleConfirmModal = async (mode: 'add' | 'edit' | 'detail', data: Faq) => {
    console.log({ mode, data });

    if (mode === 'add') {
      const res = await createMutate(data);

      if (res.success) {
        message.success(res.message);
        setFilter({ ...filter, page: 1 });
        fetchData({
          ...params,
          page: 1,
        }); // Refetch list API
        handleCloseModal();
      }
    }

    if (mode === 'edit' && faq) {
      const res = await editMutate(faq.id, data);

      if (res.success) {
        message.success(res.message);
        fetchData(params); // Refetch list API
        handleCloseModal();
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
        defaultValues={faq}
        mode={modal.mode as 'add' | 'edit' | 'detail'}
        loading={loading || createLoading || editLoading}
        onOk={handleConfirmModal}
        onClose={handleCloseModal}
      />

      <FilterBar
        filter={filter}
        handleChangeFilter={handleChangeFilter}
        handleApplyFilter={handleApplyFilter}
        handleOpenModal={handleOpenModal}
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

export default FaqListPage;
