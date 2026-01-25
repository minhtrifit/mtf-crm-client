import { FormEvent, useState } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useList } from '../../hooks/useList';
import { DEFAULT_PAGE_SIZE, PaymentMethod } from '@/+core/constants/commons.constant';
import { PaymentFilterType } from '@/types/payment';
import Error from '@/components/ui/Error/Error';
import FilterBar from '../../components/FilterBar';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import DataTable from '../../components/DataTable';

const PaymentListPage = () => {
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const method = searchParams.get('method') ?? '';
  const fromAmount = searchParams.get('fromAmount') ? Number(searchParams.get('fromAmount')) : null;
  const toAmount = searchParams.get('toAmount') ? Number(searchParams.get('toAmount')) : null;
  const fromPaidTime = searchParams.get('fromPaidTime') ?? null;
  const toPaidTime = searchParams.get('toPaidTime') ?? null;

  const [filter, setFilter] = useState<PaymentFilterType>({
    page: page,
    q: q,
    method: method as PaymentMethod,
    fromAmount: fromAmount,
    toAmount: toAmount,
    fromPaidTime: fromPaidTime,
    toPaidTime: toPaidTime,
  });

  const {
    data: payments,
    paging: paymentPaging,
    loading: paymentLoading,
    error: paymentError,
    params: paymentParams,
    setParams: setPaymentParams,
  } = useList({
    page: filter.page,
    q: filter.q,
    method: filter.method,
    fromAmount: filter.fromAmount,
    toAmount: filter.toAmount,
    fromPaidTime: filter.fromPaidTime,
    toPaidTime: filter.toPaidTime,
    limit: DEFAULT_PAGE_SIZE,
  });

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setPaymentParams({
      ...paymentParams,
      page: page,
    });
    updateParams({ page: page.toString() });
  };

  const handleChangeFilter = (key: string, value: string | number) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('APPLY FILTER:', filter);

    setFilter({ ...filter, page: 1 });

    setPaymentParams({
      page: 1,
      q: filter.q,
      method: filter.method,
      fromAmount: filter.fromAmount,
      toAmount: filter.toAmount,
      fromPaidTime: filter.fromPaidTime,
      toPaidTime: filter.toPaidTime,
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
      method: filter.method,
      fromAmount: filter.fromAmount?.toString(),
      toAmount: filter.toAmount?.toString(),
      fromPaidTime: filter.fromPaidTime,
      toPaidTime: filter.toPaidTime,
    });
  };

  const handleClearAdvanceFilter = () => {
    setFilter({
      ...filter,
      page: 1,
      q: filter.q,
      method: '' as PaymentMethod,
      fromAmount: null,
      toAmount: null,
      fromPaidTime: '',
      toPaidTime: '',
    });

    setPaymentParams({
      page: 1,
      q: filter.q,
      method: '' as PaymentMethod,
      fromAmount: null,
      toAmount: null,
      fromPaidTime: '',
      toPaidTime: '',
      limit: DEFAULT_PAGE_SIZE,
    });

    updateParams({
      page: '1',
      q: filter.q,
      method: '',
      fromAmount: '',
      toAmount: '',
      fromPaidTime: '',
      toPaidTime: '',
      is_filter_advance: '',
    });
  };

  if (!paymentLoading && paymentError) {
    return <Error />;
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='block__container'>
        <FilterBar
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          handleApplyFilter={handleApplyFilter}
          isShowOrderCode={true}
          advancedMod={true}
          handleClearAdvanceFilter={handleClearAdvanceFilter}
        />
      </div>

      {paymentLoading ? (
        <div className='mt-10'>
          <DataLoading size='large' />
        </div>
      ) : (
        <div className='block__container'>
          <DataTable
            filter={filter}
            data={payments}
            paging={paymentPaging}
            handlePageChange={handlePageChange}
            isShowOrderCode={true}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentListPage;
