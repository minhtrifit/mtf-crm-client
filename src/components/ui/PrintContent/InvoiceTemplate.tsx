import { forwardRef } from 'react';
import { get } from 'lodash';
import { Payment } from '@/types/payment';
import { formatCurrency } from '@/+core/helpers';

type Props = {
  data: Payment | null;
};

const InvoiceTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  if (!data) return null;

  console.log(data);

  return (
    <div ref={ref} style={{ padding: 24 }}>
      <h1 className='text-[1.5rem]'>HÓA ĐƠN</h1>
      <span>Số tiền: {formatCurrency(get(data, 'amount', 0))}</span>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
export default InvoiceTemplate;
