import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Empty,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Tag,
  Typography,
} from 'antd';
import { Order } from '@/types/order';
import { Payment, PaymentPayload, UpdatePaymentPayload } from '@/types/payment';
import { formatCurrency } from '@/+core/helpers';
import { PaymentMethod } from '@/+core/constants/commons.constant';
import { useTranslation } from 'react-i18next';
import { useSearchList } from '@/pages/order/hooks/useSearchList';
import { useDebounce } from '@/hooks/useDebounce';
import Label from '@/components/ui/Label/Label';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import { FaTruck, FaUser } from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';

const { Text } = Typography;
const { Option } = Select;

const paymentMethodValues = Object.values(PaymentMethod);

interface PropType {
  mode: 'add' | 'edit' | 'detail';
  defaultValue: Payment | null;
  loading: boolean;
  open: boolean;
  onClose: () => void;
  onOk: (
    mode: 'add' | 'edit' | 'detail',
    value: PaymentPayload | UpdatePaymentPayload,
    handleResetValue: () => void,
  ) => Promise<void>;
}

const PaymentFormModal = (props: PropType) => {
  const { mode, defaultValue, loading: mutateLoading, open, onClose, onOk } = props;

  const { t } = useTranslation();

  const { data, total, loading, error, fetchData, setData, setTotal } = useSearchList();

  const [inputValue, setInputValue] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(inputValue, 500);

  const PAYMENT_OPTIONS = [
    {
      value: PaymentMethod.COD,
      label: t('payment.cod'),
      icon: <FaTruck size={20} />,
    },
    {
      value: PaymentMethod.VNPAY,
      label: t('payment.vnpay'),
      icon: <img className='w-[20px]' src='/assets/icons/icon-vnpay.png' alt='vnpay-icon' />,
    },
  ];

  const FormSchema = z
    .object({
      orderId: z.string().min(1, { message: t('this_field_is_required') }),

      amount: z.number({
        required_error: t('this_field_is_required'),
        invalid_type_error: t('this_field_is_required'),
      }),

      method: z.string({
        required_error: t('this_field_is_required'),
        invalid_type_error: t('this_field_is_required'),
      }),
    })
    .superRefine((data, ctx) => {
      /** Validate amount max (sau khi chọn order) */
      if (order) {
        const remain = order.totalAmount - getPaidAmount(order.payments);

        if (data.amount > remain) {
          ctx.addIssue({
            path: ['amount'],
            message: t('amount_exceed_remain'),
            code: z.ZodIssueCode.custom,
          });
        }
      }

      /** Validate payment method */
      if (data.method && !paymentMethodValues.includes(data.method as PaymentMethod)) {
        ctx.addIssue({
          path: ['method'],
          message: t('invalid_value'),
          code: z.ZodIssueCode.custom,
        });
      }
    });

  type FormType = z.infer<typeof FormSchema>;

  const emptyValue = {
    orderId: '',
    amount: undefined,
    method: undefined,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
    watch,
    setValue,
    trigger,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: emptyValue,
  });

  const orderIdValue = watch('orderId');

  const handleResetValue = () => {
    reset(emptyValue);
    setInputValue('');
    setOrder(null);
  };

  const getPaidAmount = (payments: Payment[]) => {
    return payments.reduce((sum, item) => sum + item.amount, 0);
  };

  const getRemainAmount = (totalAmount: number, paidAmount: number) => {
    return totalAmount - paidAmount;
  };

  const checkFormRender = () => {
    if (mode === 'edit') return true;
    if (mode === 'add' && !orderIdValue) return false;
    if (mode === 'add' && orderIdValue) return true;

    return false;
  };

  const onSubmit = (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);

    if (!order) {
      message.error(t('order.not_found'));
      return;
    }

    const payload: PaymentPayload = {
      orderId: order?.id,
      amount: data?.amount,
      method: data?.method as PaymentMethod,
    };

    onOk(mode, payload, handleResetValue);
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  useEffect(() => {
    if (!debouncedSearch) {
      setData([]);
      setTotal(0);
      return;
    }

    fetchData({
      q: debouncedSearch,
    });
  }, [debouncedSearch]);

  // Mỗi khi defaultValues thay đổi (edit/detail), reset form
  useEffect(() => {
    if (mode === 'edit' && defaultValue) {
      reset({
        orderId: defaultValue?.orderId,
        method: defaultValue?.method,
        amount: defaultValue?.amount,
      });
      setOrder(defaultValue?.order);
    }
  }, [defaultValue]);

  return (
    <Modal
      title={
        <span className='text-xl text-primary font-bold'>
          {t(`${mode}`)} {t('breadcrumb.payment')}
        </span>
      }
      width={700}
      centered
      footer={null}
      open={open}
      maskClosable={false}
      onCancel={() => {
        onClose();
        handleResetValue();
      }}
    >
      <Divider className='my-0' />

      {mode === 'add' && !orderIdValue && (
        <div className='mt-5 flex flex-col gap-5'>
          <div className='flex flex-col gap-3'>
            <Label title={t('order.search')} />
            <Input
              placeholder={t('payment.search_placeholder')}
              allowClear
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
          </div>

          {!loading && error && <Error />}

          {loading ? (
            <DataLoading size='large' />
          ) : (
            <>
              {total === 0 ? (
                <div className='mx-auto my-5 flex flex-col gap-5'>
                  <Empty
                    description={t('order.choose_to_continue')}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : (
                <div className='w-full max-h-[300px] overflow-y-auto flex flex-col gap-2'>
                  {data?.map((order) => {
                    return (
                      <Card
                        key={get(order, 'id', '')}
                        className='hover:border-primary hover:bg-zinc-100 hover:cursor-pointer'
                        onClick={() => {
                          reset({
                            orderId: get(order, 'id', ''),
                          });
                          setInputValue('');
                          setOrder(order);
                        }}
                      >
                        <div className='flex items-center gap-5'>
                          <div className='w-[110px] flex flex-col gap-1'>
                            <Label title={t('order.code')} />
                            <span className='text-primary font-semibold text-[0.8rem]'>
                              {get(order, 'orderCode', '')}
                            </span>
                          </div>

                          <div className='w-[1px] h-[50px] bg-zinc-200' />

                          {get(order, 'user', null) ? (
                            <div className='flex items-center gap-3'>
                              <Avatar
                                size={50}
                                src={get(order, 'user.avatar', '')}
                                icon={<FaUser size={18} />}
                                className={`${
                                  !get(order, 'user.avatar', '') && 'bg-primary'
                                } shrink-0`}
                              />

                              <div className='flex flex-col gap-1'>
                                <span className='font-semibold'>
                                  {get(order, 'user.fullName', '')}
                                </span>
                                <span className='text-[0.8rem] text-zinc-700'>
                                  {get(order, 'user.email', '')} | {get(order, 'user.phone', '')}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className='flex items-center gap-3'>
                              <Avatar
                                size={50}
                                src={get(order, 'customer.fullName', '')}
                                icon={<FaUser size={18} />}
                                className='bg-primary shrink-0'
                              />

                              <div className='flex flex-col gap-1'>
                                <span className='font-semibold'>
                                  {get(order, 'customer.fullName', '')}
                                </span>
                                <span className='text-[0.8rem] text-zinc-700'>
                                  {get(order, 'user.email', '')} | {get(order, 'user.phone', '')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {checkFormRender() && (
        <form onSubmit={handleSubmit(onSubmit, onError)} className='mt-5 flex flex-col gap-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col gap-1'>
              <Label title={t('order.code')} />
              <span className='text-primary font-semibold text-[0.8rem]'>
                {get(order, 'orderCode', '')}
              </span>
            </div>

            {get(order, 'user', null) ? (
              <div className='flex items-center gap-3'>
                <Avatar
                  size={50}
                  src={get(order, 'user.avatar', '')}
                  icon={<FaUser size={18} />}
                  className={`${!get(order, 'user.avatar', '') && 'bg-primary'} shrink-0`}
                />

                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{get(order, 'user.fullName', '')}</span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {get(order, 'user.email', '')}
                  </span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {get(order, 'user.phone', '')}
                  </span>
                </div>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <Avatar
                  size={50}
                  src={get(order, 'customer.fullName', '')}
                  icon={<FaUser size={18} />}
                  className='bg-primary shrink-0'
                />

                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{get(order, 'customer.fullName', '')}</span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {get(order, 'user.email', '')}
                  </span>
                  <span className='text-[0.8rem] text-zinc-700'>
                    {get(order, 'user.phone', '')}
                  </span>
                </div>
              </div>
            )}

            <div className='col-span-full grid grid-cols-3 gap-5'>
              <div className='flex flex-col gap-1'>
                <Label title={t('total')} />
                <span className='text-primary font-semibold text-[0.8rem]'>
                  {formatCurrency(get(order, 'totalAmount', 0))}
                </span>
              </div>

              <div className='flex flex-col gap-1'>
                <Label title={t('order.paid')} />
                <span className='text-primary font-semibold text-[0.8rem]'>
                  {formatCurrency(getPaidAmount(get(order, 'payments', [])))}
                </span>
              </div>

              <div className='flex flex-col gap-1'>
                <Label title={t('remain')} />
                <span className='text-primary font-semibold text-[0.8rem]'>
                  {getRemainAmount(
                    get(order, 'totalAmount', 0),
                    getPaidAmount(get(order, 'payments', [])),
                  ) === 0 ? (
                    <Tag color='green'>{t('paid_complete')}</Tag>
                  ) : (
                    formatCurrency(
                      getRemainAmount(
                        get(order, 'totalAmount', 0),
                        getPaidAmount(get(order, 'payments', [])),
                      ),
                    )
                  )}
                </span>
              </div>
            </div>

            <Controller
              control={control}
              name='method'
              render={({ field }) => {
                return (
                  <div className='w-full flex flex-col gap-2'>
                    <Label title={t('payment.method')} required />

                    <Select
                      {...field}
                      disabled={
                        getRemainAmount(
                          get(order, 'totalAmount', 0),
                          getPaidAmount(get(order, 'payments', [])),
                        ) === 0
                      }
                      placeholder={t('payment.method')}
                      showSearch
                      optionFilterProp='label'
                      status={errors.method ? 'error' : ''}
                      onClear={() => {
                        setValue('method', '');
                        trigger('method');
                      }}
                      onChange={(value) => {
                        setValue('method', value ? value : '', {
                          shouldValidate: true,
                        });
                      }}
                      filterOption={(input, option) => {
                        const label = option?.label;

                        if (typeof label !== 'string') return false;

                        return label.toLowerCase().includes(input.toLowerCase());
                      }}
                    >
                      {PAYMENT_OPTIONS.map((item) => {
                        return (
                          <Option
                            key={`order-status-${get(item, 'value', '')}`}
                            value={get(item, 'value', '')}
                            label={get(item, 'label', '')}
                          >
                            <div className='flex items-center gap-3'>
                              {get(item, 'icon', null)}

                              <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                                {get(item, 'label', '')}
                              </span>
                            </div>
                          </Option>
                        );
                      })}
                    </Select>

                    {errors.method && (
                      <Text type='danger' style={{ fontSize: 12 }}>
                        {errors.method.message}
                      </Text>
                    )}
                  </div>
                );
              }}
            />

            <Controller
              control={control}
              name='amount'
              render={({ field }) => (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('amount')} required />

                  <InputNumber
                    disabled={
                      getRemainAmount(
                        get(order, 'totalAmount', 0),
                        getPaidAmount(get(order, 'payments', [])),
                      ) === 0
                    }
                    className='w-full'
                    placeholder={t('amount')}
                    suffix={'đ'}
                    status={errors.amount ? 'error' : ''}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    formatter={(value) =>
                      value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                    }
                    parser={(value) => (value ? Number(value.replace(/\./g, '')) : null) as number}
                  />

                  {errors.amount && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.amount.message}
                    </Text>
                  )}
                </div>
              )}
            />
          </div>

          <section className='flex items-center justify-end gap-2'>
            <Button
              htmlType='button'
              onClick={() => {
                handleResetValue();
                if (mode === 'edit') onClose();
              }}
            >
              {t('back')}
            </Button>

            <Button
              disabled={
                getRemainAmount(
                  get(order, 'totalAmount', 0),
                  getPaidAmount(get(order, 'payments', [])),
                ) === 0
              }
              htmlType='submit'
              type='primary'
              loading={mutateLoading}
              icon={<LuSend />}
            >
              {t('save')}
            </Button>
          </section>
        </form>
      )}
    </Modal>
  );
};

export default PaymentFormModal;
