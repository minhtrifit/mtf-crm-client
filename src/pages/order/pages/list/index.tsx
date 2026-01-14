import { FormEvent, useState } from 'react';
import { message } from 'antd';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE, DeliveryStatus, OrderStatus } from '@/+core/constants/commons.constant';
import { useList } from '../../hooks/useList';
import { useEdit } from '../../hooks/useEdit';
import Error from '@/components/ui/Error/Error';
import FilterBar from '../../components/FilterBar';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import DataTable from '../../components/DataTable';
import { UpdateOrderPayload } from '@/types/order';

export interface FilterType {
  page: number;
  q: string;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  buyerQ: string;
  fromPaidTime: string | null;
  toPaidTime: string | null;
}

const OrderListPage = () => {
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? '';
  const deliveryStatus = searchParams.get('deliveryStatus') ?? '';
  const buyerQ = searchParams.get('buyerQ') ?? '';
  const fromPaidTime = searchParams.get('fromPaidTime') ?? null;
  const toPaidTime = searchParams.get('toPaidTime') ?? null;

  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
    status: status as OrderStatus,
    deliveryStatus: deliveryStatus as DeliveryStatus,
    buyerQ: buyerQ,
    fromPaidTime: fromPaidTime,
    toPaidTime: toPaidTime,
  });

  const {
    data,
    loading: listLoading,
    error,
    paging,
    params,
    setParams,
    fetchData,
  } = useList({
    page: filter.page,
    q: filter.q,
    status: filter.status,
    deliveryStatus: filter.deliveryStatus,
    buyerQ: filter.buyerQ,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { mutate: editMutate, loading: editLoading } = useEdit();

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
      buyerQ: filter.buyerQ,
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
      buyerQ: filter.buyerQ,
    });
  };

  const handleActionItem = async (name: string, value: any) => {
    if (name === 'deliveryStatus') {
      const payload: UpdateOrderPayload = {
        deliveryStatus: value?.value as DeliveryStatus,
      };

      const res = await editMutate(value?.id, payload);

      if (res.success) {
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
          fetchData(params);
          message.success(res.message);
        }, 500);
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

      {loading || listLoading || editLoading ? (
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

export default OrderListPage;
