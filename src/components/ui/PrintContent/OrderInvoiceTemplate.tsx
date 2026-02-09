import { forwardRef } from 'react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Store } from '@/types/store';
import { Order, OrderItem } from '@/types/order';
import { formatCurrency, formatDateTime, formatFullDate, getCurrentLang } from '@/+core/helpers';

type Props = {
  store: Store | null;
  order: Order | null;
};

const OrderInvoiceTemplate = forwardRef<HTMLDivElement, Props>(({ store, order }, ref) => {
  const { t, i18n } = useTranslation();

  if (!store || !order) return null;

  /* ===== STORE ===== */
  const storeName = get(store, 'name', '---');
  const storeAddress = get(store, 'address', '---');
  const storeHotline = get(store, 'hotline', '---');
  const storeEmail = get(store, 'email', '---');
  const storeTaxCode = get(store, 'taxCode', '---');

  /* ===== ORDER ===== */
  const orderCode = get(order, 'orderCode', '---');
  const fullName = get(order, 'fullName', '---');
  const phone = get(order, 'phone', '---');
  const deliveryAddress = get(order, 'deliveryAddress', '---');
  const note = get(order, 'note');
  const totalAmount = get(order, 'totalAmount', 0);
  const items: OrderItem[] = get(order, 'items', []);
  const payments = get(order, 'payments', []);

  return (
    <div
      ref={ref}
      style={{
        padding: 24,
        fontFamily: 'Arial, sans-serif',
        fontSize: 14,
        color: '#000',
        width: '210mm',
      }}
    >
      {/* SHOP INFO */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ lineHeight: 1.6 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{storeName}</div>
          <div>{t('print.shop.address', { address: storeAddress })}</div>
          <div>{t('print.shop.hotline', { hotline: storeHotline })}</div>
          <div>{t('print.shop.email', { email: storeEmail })}</div>
          <div>{t('print.shop.taxCode', { taxCode: storeTaxCode })}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>{t('print.orderTitle')}</h1>

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <strong>{t('print.orderCode')}:</strong> {orderCode}
            </div>
            <div>{formatFullDate(undefined, getCurrentLang(i18n.language))}</div>
          </div>
        </div>
      </div>

      {/* CUSTOMER INFO */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8 }}>{t('print.customerInfo')}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <strong>{t('print.fullName')}:</strong> {fullName}
          </div>
          <div>
            <strong>{t('print.phone')}:</strong> {phone}
          </div>
          <div>
            <strong>{t('print.address')}:</strong> {deliveryAddress}
          </div>
          {note && (
            <div>
              <strong>{t('print.note')}:</strong> {note}
            </div>
          )}
        </div>
      </div>

      {/* PAYMENTS */}
      {payments.length > 0 && (
        <>
          <h3 style={{ marginBottom: 8 }}>{t('print.paymentInfo')}</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={th}>{t('print.table.index')}</th>
                <th style={th}>{t('print.table.paidAt')}</th>
                <th style={th}>{t('print.table.paymentMethod')}</th>
                <th style={th}>{t('print.table.amount')}</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment: any, index: number) => (
                <tr key={get(payment, 'id', index)}>
                  <td style={tdCenter}>{index + 1}</td>
                  <td style={tdCenter}>
                    {get(payment, 'paidAt') ? formatDateTime(get(payment, 'paidAt')) : '---'}
                  </td>
                  <td style={tdCenter}>
                    {t(`payment.${get(payment, 'method', '---').toLowerCase()}`)}
                  </td>
                  <td style={tdRight}>{formatCurrency(get(payment, 'amount', 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ITEMS */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr>
            <th style={th}>{t('print.table.index')}</th>
            <th style={th}>{t('print.table.product')}</th>
            <th style={th}>{t('print.table.quantity')}</th>
            <th style={{ ...th, minWidth: 100 }}>{t('print.table.price')}</th>
            <th style={{ ...th, minWidth: 100 }}>{t('print.table.total')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const name = get(item, 'product.name', '---');
            const quantity = get(item, 'quantity', 0);
            const price = get(item, 'price', 0);

            return (
              <tr key={get(item, 'id', index)}>
                <td style={tdCenter}>{index + 1}</td>
                <td style={td}>{name}</td>
                <td style={tdCenter}>{quantity}</td>
                <td style={tdRight}>{formatCurrency(price)}</td>
                <td style={tdRight}>{formatCurrency(price * quantity)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* SUMMARY */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 16 }}>
          <strong>{t('print.summary.totalAmount')}:</strong> {formatCurrency(totalAmount)}
        </div>
      </div>

      {/* SIGNATURE */}
      <div
        style={{
          marginTop: 48,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        <div style={{ textAlign: 'center', width: '40%' }}>
          <div style={{ marginBottom: 80 }}>
            <strong>{t('print.signature.staff')}</strong>
          </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: 8 }}>
            {t('print.signature.signHint')}
          </div>
        </div>

        <div style={{ textAlign: 'center', width: '40%' }}>
          <div style={{ marginBottom: 80 }}>
            <strong>{t('print.signature.customer')}</strong>
          </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: 8 }}>
            {t('print.signature.signHint')}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <p>{t('print.footer')}</p>
      </div>
    </div>
  );
});

OrderInvoiceTemplate.displayName = 'OrderInvoiceTemplate';
export default OrderInvoiceTemplate;

/* styles */
const th: React.CSSProperties = {
  border: '1px solid #000',
  padding: 8,
  textAlign: 'center',
  background: '#f5f5f5',
};

const td: React.CSSProperties = {
  border: '1px solid #000',
  padding: 8,
};

const tdCenter: React.CSSProperties = {
  ...td,
  textAlign: 'center',
};

const tdRight: React.CSSProperties = {
  ...td,
  textAlign: 'right',
};
