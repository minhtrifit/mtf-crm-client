import { get } from 'lodash';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { useCreateCodOrder } from '../../hooks/useCreateCodOrder';
import { useCreateVnPayOrder } from '../../hooks/useCreateVnPayOrder';
import { clearCart } from '@/store/actions/cart.action';
import { RootState } from '@/store/store';
import { PaymentMethod } from '@/+core/constants/commons.constant';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { formatCurrency } from '@/+core/helpers';
import { Button, Card, Input, notification, Radio, Typography } from 'antd';
import Label from '@/components/ui/Label/Label';
import CartEmpty from '../CartEmpty';
import { FaTruck } from 'react-icons/fa';
import { OrderPayload } from '@/types/order';

const { Text } = Typography;
const { TextArea } = Input;

const InformationForm = () => {
  const { config } = useAppConfig();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.users.user);
  const total = useSelector((state: RootState) => state.carts.total);
  const carts = useSelector((state: RootState) => state.carts.items);

  const { loading: codLoading, mutate: codMutate } = useCreateCodOrder();
  const { loading: vnPayLoading, mutate: vnPayMutate } = useCreateVnPayOrder();

  const FormSchema = z
    .object({
      userId: z.string().min(1, { message: t('this_field_is_required') }),
      phone: z.string().min(1, { message: t('this_field_is_required') }),
      deliveryAddress: z.string().min(1, { message: t('this_field_is_required') }),
      note: z.string(),
      paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
    })
    .superRefine((data, ctx) => {
      if (data.paymentMethod === null) {
        ctx.addIssue({
          path: ['paymentMethod'],
          message: t('order.payment_method_required'),
          code: z.ZodIssueCode.custom,
        });
      }
    });

  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
    setValue,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: user?.id,
      phone: user?.phone ?? '',
      deliveryAddress: user?.address ?? '',
      note: '',
      paymentMethod: null,
    },
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);

    const payload: OrderPayload = {
      userId: data.userId,
      phone: data.phone,
      deliveryAddress: data.deliveryAddress,
      note: data.note,
      items: carts?.map((item) => {
        return {
          productId: item?.product?.id,
          quantity: item?.quantity,
        };
      }),
    };

    // Handle COD Payment
    if (data.paymentMethod === PaymentMethod.COD) {
      const res = await codMutate(payload);

      if (res.success) {
        dispatch(clearCart());

        const statusParams = res.data?.redirect_payment_url?.split(WEBSITE_ROUTE.CHECKOUT)[1];
        const redirectPath = `${WEBSITE_ROUTE.CHECKOUT}${statusParams}`;

        navigate(redirectPath);
      } else {
        notification.error({
          message: t('notification'),
          description: res.message,
          placement: 'bottomLeft',
        });
      }
    }

    // Handle VNPay Payment
    if (data.paymentMethod === PaymentMethod.VNPAY) {
      const res = await vnPayMutate(payload);

      if (res.success) {
        dispatch(clearCart());
        window.location.href = res.data;
      } else {
        notification.error({
          message: t('notification'),
          description: res.message,
          placement: 'bottomLeft',
        });
      }
    }
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  if (carts?.length === 0) return <CartEmpty />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5 items-start'
    >
      <Card
        styles={{
          body: {
            padding: 15,
            borderTop: '1px solid #f5f5f5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div className='w-full flex flex-col gap-2'>
            <Label title={t('auth.fullName')} />

            <span className='text-zinc-700'>{get(user, 'fullName', '')}</span>
          </div>

          <div className='w-full flex flex-col gap-2'>
            <Label title={t('auth.email')} />

            <span className='text-zinc-700'>{get(user, 'email', '')}</span>
          </div>

          <div className='w-full flex flex-col gap-2'>
            <Label title={t('auth.address')} />

            <span className='text-zinc-700'>{get(user, 'address', '')}</span>
          </div>

          <Controller
            control={control}
            name='phone'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('auth.phone')} required />

                  <Input
                    {...field}
                    placeholder={t('auth.phone')}
                    status={errors.phone ? 'error' : ''}
                  />

                  {errors.phone && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.phone.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />

          <Controller
            control={control}
            name='deliveryAddress'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2 col-span-full'>
                  <Label title={t('delivery_address')} required />

                  <Input
                    {...field}
                    placeholder={t('delivery_address')}
                    status={errors.deliveryAddress ? 'error' : ''}
                  />

                  {errors.deliveryAddress && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.deliveryAddress.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />

          <Controller
            control={control}
            name='note'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2 col-span-full'>
                  <Label title={t('note')} />

                  <TextArea
                    {...field}
                    placeholder={t('note')}
                    status={errors.note ? 'error' : ''}
                    rows={8}
                  />

                  {errors.note && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.note.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
        </div>
      </Card>

      <Card
        styles={{
          body: {
            padding: 15,
            borderTop: '1px solid #f5f5f5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <div className='w-full min-h-full flex flex-col gap-5'>
          <div className='flex flex-col gap-5'>
            <div className='grid grid-cols-2 gap-5'>
              <span
                style={{ color: config?.websitePrimaryColor }}
                className='text-[1.05rem] font-bold'
              >
                {t('grand_total')}
              </span>
              <span className='text-[1.05rem] text-zinc-700'>{formatCurrency(total)}</span>
            </div>
          </div>

          <Controller
            control={control}
            name='paymentMethod'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2 col-span-full'>
                  <Label title={t('order.payment_method')} required />

                  <Radio.Group
                    {...field}
                    value={field.value ?? undefined} // ⚠️ tránh warning Radio với null
                    onChange={(e) => field.onChange(e.target.value)}
                    className='flex flex-col gap-3'
                  >
                    <div
                      style={{
                        border:
                          paymentMethod === PaymentMethod.COD
                            ? `1px solid ${config?.websitePrimaryColor}`
                            : '1px solid transparent',
                      }}
                      className='rounded-md p-4 transition-colors border border-solid hover:!border-zinc-300'
                      onClick={() => {
                        setValue('paymentMethod', PaymentMethod.COD);
                        clearErrors('paymentMethod');
                      }}
                    >
                      <Radio value={PaymentMethod.COD} className='flex items-center gap-3'>
                        <div className='my-auto grid grid-cols-[30px_1fr] gap-3'>
                          <FaTruck size={30} />
                          <span className='text-[0.8rem] text-zinc-700'>
                            {t('order.cod_payment')}
                          </span>
                        </div>
                      </Radio>
                    </div>

                    <div
                      style={{
                        border:
                          paymentMethod === PaymentMethod.VNPAY
                            ? `1px solid ${config?.websitePrimaryColor}`
                            : '1px solid transparent',
                      }}
                      className='rounded-md p-4 transition-colors border border-solid hover:!border-zinc-300'
                      onClick={() => {
                        setValue('paymentMethod', PaymentMethod.VNPAY);
                        clearErrors('paymentMethod');
                      }}
                    >
                      <Radio value={PaymentMethod.VNPAY} className='flex items-center gap-3'>
                        <div className='my-auto grid grid-cols-[30px_1fr] gap-3'>
                          <img
                            className='w-[30px]'
                            src='/assets/icons/icon-vnpay.png'
                            alt='vnpay-icon'
                          />
                          <span className='text-[0.8rem] text-zinc-700'>
                            {t('order.vn_pay_payment')}
                          </span>
                        </div>
                      </Radio>
                    </div>
                  </Radio.Group>

                  {errors.paymentMethod && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.paymentMethod.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />

          <Button
            disabled={carts?.length === 0}
            htmlType='submit'
            type='primary'
            loading={codLoading || vnPayLoading}
          >
            {t('place_order')}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default InformationForm;
