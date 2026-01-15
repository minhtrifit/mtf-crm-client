import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useList } from '@/pages/payment/hooks/useList';
import { useDetail } from '../../hooks/useDetail';
import { useQueryParams } from '@/hooks/useQueryParams';
import { PaymentFilterType } from '@/types/payment';
import { DEFAULT_PAGE_SIZE, PaymentMethod } from '@/+core/constants/commons.constant';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import DetailForm from '../../components/DetailForm';

const OrderDetailPage = () => {
  const params = useParams();
  const { searchParams, updateParams } = useQueryParams();

  const id = params?.id ?? '';

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

  const { data, loading, error } = useDetail(id);

  const {
    data: payments,
    paging: paymentPaging,
    loading: paymentLoading,
    setParams: setPaymentParams,
  } = useList({
    page: filter.page,
    q: filter.q,
    orderId: id, // DEFAULT
    method: filter.method,
    fromAmount: filter.fromAmount,
    toAmount: filter.toAmount,
    fromPaidTime: filter.fromPaidTime,
    toPaidTime: filter.toPaidTime,
    limit: DEFAULT_PAGE_SIZE,
  });

  const handlePagePaymentChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setPaymentParams({
      ...params,
      orderId: id, // DEFAULT
      page: page,
    });
    updateParams({ page: page.toString() });
  };

  const handleChangePaymentFilter = (key: string, value: string | number) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyPaymentFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('APPLY FILTER:', filter);

    setFilter({ ...filter, page: 1 });

    setPaymentParams({
      page: 1,
      q: filter.q,
      orderId: id, // DEFAULT
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

  if (!loading && !paymentLoading && error) {
    return <Error />;
  }

  return (
    <>
      {(loading || paymentLoading) && <DataLoading size='large' />}
      {!loading && data && (
        <DetailForm
          data={data}
          paymentData={{
            filter: filter,
            data: payments,
            paging: paymentPaging,
            handleChangeFilter: handleChangePaymentFilter,
            handleApplyFilter: handleApplyPaymentFilter,
            handlePageChange: handlePagePaymentChange,
          }}
        />
      )}
    </>
  );
};

export default OrderDetailPage;
