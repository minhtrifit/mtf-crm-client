import { get } from 'lodash';
import { Button, Card, Skeleton } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import { useDetailOrder } from '../../hooks/useDetailOrder';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { formatCurrency, formatTimezone, isValidPaymentMethod } from '@/+core/helpers';
import { PaymentMethod, VnPayResponseCode } from '@/+core/constants/commons.constant';
import Error from '@/components/ui/Error/Error';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

const StatusForm = () => {
  const { searchParams } = useQueryParams();
  const { t } = useTranslation();
  const isMobile = useIsMobile(1024);
  const navigate = useNavigate();
  const { config } = useAppConfig();

  const orderId = searchParams.get('order_id') ?? '';
  const paymentMethod = searchParams.get('method') ?? '';
  const vnpResponseCode = searchParams.get('vnpResponseCode') ?? '';

  const { data, loading, error } = useDetailOrder(orderId);

  if (!orderId || !isValidPaymentMethod(paymentMethod)) {
    return <Navigate to={WEBSITE_ROUTE.HOME} />;
  }

  if (paymentMethod === PaymentMethod.VNPAY && !vnpResponseCode) {
    return <Navigate to={WEBSITE_ROUTE.HOME} />;
  }

  if (!loading && error) {
    return <Error />;
  }

  const RenderCodStatus = () => {
    return (
      <div className='w-full flex flex-col items-center gap-5'>
        <CheckCircleFilled style={{ color: '#52c41a', fontSize: 60 }} />

        <h3>{t('order_successfully')}</h3>

        <section className='mt-5 w-full grid grid-col-1 lg:grid-cols-2 gap-[50px]'>
          <div className='w-full flex flex-col gap-5'>
            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('order.id')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'orderCode', '')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('auth.fullName')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.fullName', '')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('auth.email')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.email', '')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('delivery_address')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {get(data, 'deliveryAddress', '')}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('note')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'note', '')}</span>
            </div>
          </div>

          <div className='w-full flex flex-col gap-5'>
            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('status')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {t(`order.${get(data, 'status', '').toLowerCase()}`)}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('delivery_status')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {t(`delivery.${get(data, 'deliveryStatus', '').toLowerCase()}`)}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('order.payment_method')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{t('payment.cod')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('order_at')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {formatTimezone(get(data, 'createdAt', ''))}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('grand_total')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {formatCurrency(get(data, 'totalAmount', ''))}
              </span>
            </div>
          </div>
        </section>

        <section className='mt-5 w-full flex items-center justify-center gap-3'>
          <Button
            onClick={() => {
              navigate(`${WEBSITE_ROUTE.ORDERS}?order_id=${orderId}`);
            }}
          >
            {t('view_detail_order')}
          </Button>
          <Button
            type='primary'
            onClick={() => {
              navigate(WEBSITE_ROUTE.HOME);
            }}
          >
            {t('back_homepage')}
          </Button>
        </section>
      </div>
    );
  };

  const RenderVnPayStatus = () => {
    return (
      <div className='w-full flex flex-col items-center gap-5'>
        {vnpResponseCode === VnPayResponseCode.SUCCESS ? (
          <CheckCircleFilled style={{ color: '#52c41a', fontSize: 60 }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 60 }} />
        )}

        <h3>{t(`vnpay_code.${vnpResponseCode}`)}</h3>

        <section className='mt-5 w-full grid grid-col-1 lg:grid-cols-2 gap-[50px]'>
          <div className='w-full flex flex-col gap-5'>
            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('order.id')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'orderCode', '')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('auth.fullName')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.fullName', '')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('auth.email')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'user.email', '')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('delivery_address')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {get(data, 'deliveryAddress', '')}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('note')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{get(data, 'note', '')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('order_at')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {formatTimezone(get(data, 'createdAt', ''))}
              </span>
            </div>
          </div>

          <div className='w-full flex flex-col gap-5'>
            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('status')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {t(`order.${get(data, 'status', '').toLowerCase()}`)}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('delivery_status')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {t(`delivery.${get(data, 'deliveryStatus', '').toLowerCase()}`)}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('order.payment_method')}</span>
              <span className='text-[0.85rem] text-zinc-700'>{t('payment.vnpay')}</span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('paid_at')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {formatTimezone(get(data, 'payments[0].paidAt', ''))}
              </span>
            </div>

            <div className='grid grid-cols-[200px_1fr] gap-5'>
              <span className='text-[1rem] font-semibold'>{t('grand_total')}</span>
              <span className='text-[0.85rem] text-zinc-700'>
                {formatCurrency(get(data, 'totalAmount', ''))}
              </span>
            </div>
          </div>
        </section>

        <section className='mt-5 w-full flex items-center justify-center gap-3'>
          <Button
            onClick={() => {
              navigate(`${WEBSITE_ROUTE.ORDERS}?order_id=${orderId}`);
            }}
          >
            {t('view_detail_order')}
          </Button>
          <Button
            type='primary'
            onClick={() => {
              navigate(WEBSITE_ROUTE.HOME);
            }}
          >
            {t('back_homepage')}
          </Button>
        </section>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div style={{ width: isMobile ? '100%' : '500px' }} className='flex flex-col mx-auto'>
          <Skeleton.Node active style={{ height: 400, width: '100%' }} />
        </div>
      ) : (
        <Card
          styles={{
            body: {
              padding: 15,
              borderTop: '1px solid #f5f5f5',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            },
          }}
          className='w-full mx-auto'
        >
          {paymentMethod === PaymentMethod.COD && <RenderCodStatus />}
          {paymentMethod === PaymentMethod.VNPAY && <RenderVnPayStatus />}
        </Card>
      )}
    </>
  );
};

export default StatusForm;
