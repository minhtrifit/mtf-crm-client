import { FormEvent, useState } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useOutletContext } from 'react-router-dom';
import { ProfileLayoutContextType } from '../layout';
import { useGetOrdersByUserId } from '../../hooks/useGetOrdersByUserId';
import { useDetailOrder } from '../../hooks/useDetailOrder';
import { DEFAULT_PAGE_SIZE, DeliveryStatus, OrderStatus } from '@/+core/constants/commons.constant';
import Error from '@/components/ui/Error/Error';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import { TableSkeleton } from '../../components/Skeleton';
import DetailModal from '../../components/DetailModal';

export interface FilterType {
  page: number;
  q: string;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  fromPaidTime: string | null;
  toPaidTime: string | null;
}

const UserOrderPage = () => {
  const { searchParams, updateParams } = useQueryParams();
  const { user } = useOutletContext<ProfileLayoutContextType>();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? '';
  const deliveryStatus = searchParams.get('deliveryStatus') ?? '';
  const fromPaidTime = searchParams.get('fromPaidTime') ?? null;
  const toPaidTime = searchParams.get('toPaidTime') ?? null;

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
    status: status as OrderStatus,
    deliveryStatus: deliveryStatus as DeliveryStatus,
    fromPaidTime: fromPaidTime,
    toPaidTime: toPaidTime,
  });
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

  const {
    data: orders,
    loading,
    error,
    paging,
    params,
    setParams,
  } = useGetOrdersByUserId(user?.id, {
    page: filter.page,
    q: filter.q,
    status: filter.status,
    deliveryStatus: filter.deliveryStatus,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { data: order, loading: orderLoading, fetchData: fetchDetailOrder } = useDetailOrder();

  if (!loading && error) {
    return <Error />;
  }

  const handleChangeFilter = (key: string, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      status: filter.status,
      deliveryStatus: filter.deliveryStatus,
      fromPaidTime: filter.fromPaidTime,
      toPaidTime: filter.toPaidTime,
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
      status: filter.status,
      deliveryStatus: filter.deliveryStatus,
      fromPaidTime: filter.fromPaidTime,
      toPaidTime: filter.toPaidTime,
    });
  };

  const handleClearAdvanceFilter = () => {
    setFilter({
      ...filter,
      page: 1,
      q: filter.q,
      status: '' as OrderStatus,
      deliveryStatus: '' as DeliveryStatus,
      fromPaidTime: '',
      toPaidTime: '',
    });

    setParams({
      page: 1,
      q: filter.q,
      status: '',
      deliveryStatus: '',
      fromPaidTime: '',
      toPaidTime: '',
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
      status: '',
      deliveryStatus: '',
      fromPaidTime: '',
      toPaidTime: '',
    });
  };

  const handleActionItem = async (id: string) => {
    await fetchDetailOrder(id);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      <DetailModal
        order={order}
        loading={orderLoading}
        open={openDetailModal}
        onClose={handleCloseDetailModal}
      />

      <FilterBar
        filter={filter}
        handleChangeFilter={handleChangeFilter}
        handleApplyFilter={handleApplyFilter}
        handleClearAdvanceFilter={handleClearAdvanceFilter}
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          filter={filter}
          data={orders}
          paging={paging}
          handlePageChange={handlePageChange}
          handleActionItem={handleActionItem}
        />
      )}
    </div>
  );
};

export default UserOrderPage;
