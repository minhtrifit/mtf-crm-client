import { FormEvent, useEffect, useState } from 'react';
import { message } from 'antd';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useList } from '../../hooks/useList';
import { useDetail } from '../../hooks/useDetail';
import { useCreate } from '../../hooks/useCreate';
import { useEdit } from '../../hooks/useEdit';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { Category, UpdateCategoryPayload } from '@/types/category';
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

const CategoryListPage = () => {
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const isActive = searchParams.get('isActive') ?? '';
  const open = searchParams.get('open') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
    isActive: isActive,
  });
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'detail' | null }>({
    open: false,
    mode: null,
  });
  const [category, setCategory] = useState<Category | null>(null);

  const { data, loading, error, paging, params, setParams, fetchData } = useList({
    page: filter.page,
    q: filter.q,
    isActive: filter.isActive,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { loading: detailLoading, fetchData: detailFetchData } = useDetail();
  const { loading: createLoading, mutate: createMutate } = useCreate();
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

  const handleActionItem = async (name: string, value: any) => {
    if (name === 'status') {
      const payload: UpdateCategoryPayload = {
        isActive: value?.value,
      };

      const res = await editMutate(value?.id, payload);

      if (res.success) {
        message.success(res.message);
        fetchData(params);
      }
    }

    if (name === 'detail') {
      const res = await detailFetchData(value?.id);
      handleOpenModal('detail', res);
    }

    if (name === 'edit') {
      const res = await detailFetchData(value?.id);
      handleOpenModal('edit', res as Category);
    }
  };

  const handleOpenModal = (mode: 'add' | 'edit' | 'detail', value: Category | null) => {
    setModal({ open: true, mode: mode });
    setCategory(value);
  };

  const handleCloseModal = () => {
    setModal({ open: false, mode: null });
    setCategory(null);
    updateParams({ open: '' });
  };

  const handleConfirmModal = async (mode: 'add' | 'edit' | 'detail', data: Category) => {
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

    if (mode === 'edit' && category) {
      const res = await editMutate(category.id, data);

      if (res.success) {
        message.success(res.message);
        fetchData(params); // Refetch list API
        handleCloseModal();
      }
    }
  };

  // Auto open detail
  useEffect(() => {
    const handleAutoOpenDetail = async (id: string) => {
      const res = await detailFetchData(id);
      handleOpenModal('detail', res);
    };

    if (open) handleAutoOpenDetail(open);
  }, [open]);

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='flex flex-col gap-5'>
      <FormModal
        open={modal.open}
        defaultValues={category}
        mode={modal.mode as 'add' | 'edit' | 'detail'}
        loading={createLoading || editLoading}
        onOk={handleConfirmModal}
        onClose={handleCloseModal}
      />

      <FilterBar
        filter={filter}
        handleChangeFilter={handleChangeFilter}
        handleApplyFilter={handleApplyFilter}
        handleOpenModal={handleOpenModal}
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

export default CategoryListPage;
