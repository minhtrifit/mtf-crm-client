import { useMemo, useRef, useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import { Store } from '@/types/store';
import { Payment } from '@/types/payment';
import storeApi from '@/+core/api/store.api';
import paymentApi from '@/+core/api/payment.api';
import StoreFormModal from './StoreFormModal';
import InvoiceTemplate from './InvoiceTemplate';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoMdPrint } from 'react-icons/io';

export type PrintType = 'invoice';

interface PropType {
  id: string;
  typeValue: PrintType;
  showText?: boolean;
  showTooltip?: boolean;
}

export default function PrintManager(props: PropType) {
  const { id, typeValue, showText = false, showTooltip = true } = props;

  const { t } = useTranslation();

  const invoiceRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [openStoreModal, setOpenStoreModal] = useState<boolean>(false);
  const [store, setStore] = useState<Store | null>(null);
  const [invoiceData, setInvoiceData] = useState<Payment | null>(null);

  const activeRef = useMemo(() => {
    switch (typeValue) {
      case 'invoice':
        return invoiceRef;
      default:
        return invoiceRef;
    }
  }, [typeValue]);

  const handlePrint = useReactToPrint({
    contentRef: activeRef,
  });

  const fetchStoreData = async (id: string) => {
    try {
      setLoading(true);

      const res = await storeApi.getDetail(id);
      const data = res?.data;

      if (!data?.success) {
        message.error(data?.message);
        return false;
      }

      setStore(data?.data);

      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      if (typeValue === 'invoice') {
        const res = await paymentApi.getDetail(id);
        const data = res?.data;

        if (!data?.success) {
          message.error(data?.message);
          return false;
        }

        setInvoiceData(data?.data);

        return true;
      }
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onInvoiceConfirm = async (id: string) => {
    const store = await fetchStoreData(id);
    const result = await fetchData();

    if (store && result) {
      // Chờ React render xong
      setTimeout(() => {
        handlePrint();
      }, 0);
    }
  };

  if (typeValue === 'invoice') {
    return (
      <>
        <StoreFormModal
          open={openStoreModal}
          onClose={() => setOpenStoreModal(false)}
          onConfirm={onInvoiceConfirm}
        />

        <Tooltip title={showTooltip ? t('print.invoice') : null}>
          <Button
            className='w-auto'
            type='primary'
            icon={loading ? <HiDotsHorizontal size={20} /> : <IoMdPrint size={20} />}
            onClick={() => setOpenStoreModal(true)}
            disabled={loading}
          >
            {!loading && showText && t('print.invoice')}
          </Button>
        </Tooltip>

        {/* Hidden print content */}
        <div style={{ display: 'none' }}>
          <InvoiceTemplate ref={invoiceRef} store={store} data={invoiceData} />
        </div>
      </>
    );
  }

  return null;
}
