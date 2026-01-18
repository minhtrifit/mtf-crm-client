import { get } from 'lodash';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Divider, Input, Select, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Order, UpdateOrderPayload } from '@/types/order';
import { useTranslation } from 'react-i18next';
import { DeliveryStatus, OrderStatus } from '@/+core/constants/commons.constant';
import Label from '@/components/ui/Label/Label';
import { LuSend } from 'react-icons/lu';
import { MdCancel, MdOutlineBookmarkAdded, MdPaid, MdPending } from 'react-icons/md';
import { FaRegCheckCircle, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';

const orderStatusValues = Object.values(OrderStatus);
const deliveryStatusValues = Object.values(DeliveryStatus);

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PropType {
  defaultValues: Order;
  mode: 'add' | 'edit' | 'detail';
  loading: boolean;
  onSubmit: (data: UpdateOrderPayload) => void;
}

const OrderForm = (props: PropType) => {
  const { defaultValues, mode, loading, onSubmit } = props;

  const navigate = useNavigate();
  const params = useParams();

  const { t } = useTranslation();

  const id = params?.id ?? '';

  const STATUS_OPTIONS = [
    {
      value: OrderStatus.PAID,
      label: t('order.paid'),
      icon: <MdPaid size={20} className='text-green-500' />,
    },
    {
      value: OrderStatus.PENDING,
      label: t('order.pending'),
      icon: <MdPending size={20} className='text-yellow-500' />,
    },
    {
      value: OrderStatus.CANCELLED,
      label: t('order.cancelled'),
      icon: <MdCancel size={20} className='text-red-500' />,
    },
  ];

  const DELIVERY_STATUS_OPTIONS = [
    {
      value: DeliveryStatus.ORDERED,
      label: t('delivery.ordered'),
      icon: <FaRegCreditCard size={20} />,
    },
    {
      value: DeliveryStatus.CONFIRMED,
      label: t('delivery.confirmed'),
      icon: <MdOutlineBookmarkAdded size={20} />,
    },
    {
      value: DeliveryStatus.PREPARING,
      label: t('delivery.preparing'),
      icon: <PiPackageBold size={20} />,
    },
    {
      value: DeliveryStatus.SHIPPING,
      label: t('delivery.shipping'),
      icon: <FaTruck size={20} />,
    },
    {
      value: DeliveryStatus.DELIVERED,
      label: t('delivery.delivered'),
      icon: <FaRegCheckCircle size={20} />,
    },
  ];

  const FormSchema = z.object({
    note: z.string(),
    deliveryAddress: z.string(),
    status: z.string().refine((val) => orderStatusValues.includes(val as OrderStatus), {
      message: t('invalid_value'),
    }),
    deliveryStatus: z
      .string()
      .refine((val) => deliveryStatusValues.includes(val as DeliveryStatus), {
        message: t('invalid_value'),
      }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
    trigger,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          note: defaultValues.note as string | undefined,
          deliveryAddress: defaultValues.deliveryAddress as string | undefined,
          status: defaultValues.status,
          deliveryStatus: defaultValues.deliveryStatus,
        }
      : {
          note: '',
          deliveryAddress: '',
          status: OrderStatus.PENDING,
          deliveryStatus: DeliveryStatus.ORDERED,
        },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectDetail = (id: string) => {
    navigate(`/admin/order/detail/${id}`);
  };

  const onFormSubmit = (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);
    onSubmit(data as UpdateOrderPayload);
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <form
      className='block__container flex flex-col gap-5'
      onSubmit={handleSubmit(onFormSubmit, onError)}
    >
      <section className='flex items-center justify-between'>
        <span className='text-xl text-primary font-bold'>
          {t(`${mode}`)} {t('breadcrumb.order')}
        </span>

        <div className='flex items-center justify-center gap-2'>
          {mode === 'edit' && (
            <Button
              type='primary'
              htmlType='button'
              onClick={() => {
                handleRedirectDetail(id);
              }}
            >
              {t('detail')}
            </Button>
          )}
        </div>
      </section>

      <Divider className='my-0' />

      <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        <Controller
          control={control}
          name='deliveryAddress'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('delivery_address')} required />

                <Input
                  {...field}
                  disabled={mode === 'detail'}
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
          name='status'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('status')} required />

                <Select
                  {...field}
                  placeholder={t('status')}
                  showSearch
                  allowClear
                  optionFilterProp='label'
                  status={errors.status ? 'error' : ''}
                  onClear={() => {
                    setValue('status', OrderStatus.PENDING);
                    trigger('status');
                  }}
                  onChange={(value) => {
                    setValue('status', value ? value : OrderStatus.PENDING, {
                      shouldValidate: true,
                    });
                  }}
                  filterOption={(input, option) => {
                    const label = option?.label;

                    if (typeof label !== 'string') return false;

                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {STATUS_OPTIONS.map((item) => {
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

                {errors.status && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.status.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name='deliveryStatus'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('delivery_status')} required />

                <Select
                  {...field}
                  placeholder={t('delivery_status')}
                  showSearch
                  allowClear
                  optionFilterProp='label'
                  status={errors.deliveryStatus ? 'error' : ''}
                  onClear={() => {
                    setValue('deliveryStatus', DeliveryStatus.ORDERED);
                    trigger('deliveryStatus');
                  }}
                  onChange={(value) => {
                    setValue('deliveryStatus', value ? value : DeliveryStatus.ORDERED, {
                      shouldValidate: true,
                    });
                  }}
                  filterOption={(input, option) => {
                    const label = option?.label;

                    if (typeof label !== 'string') return false;

                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {DELIVERY_STATUS_OPTIONS.map((item) => {
                    return (
                      <Option
                        key={`delivery-status-${get(item, 'value', '')}`}
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

                {errors.deliveryStatus && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.deliveryStatus.message}
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
                  disabled={mode === 'detail'}
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
      </section>

      {mode !== 'detail' && (
        <section className='flex items-center justify-end gap-2'>
          <Button htmlType='button' onClick={handleBack}>
            {t('back')}
          </Button>

          <Button htmlType='submit' type='primary' loading={loading} icon={<LuSend />}>
            {t('save')}
          </Button>
        </section>
      )}
    </form>
  );
};

export default OrderForm;
