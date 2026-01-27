import { useEffect, useMemo, useState } from 'react';
import { get } from 'lodash';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Avatar, Button, Collapse, Input, InputNumber, message, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useScrollToId } from '@/hooks/useScrollToId';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchList } from '@/pages/user/hooks/useSearchList';
import { useList } from '@/pages/product/hooks/useList';
import { useCart } from '../../hooks/useCart';
import { DeliveryStatus, OrderStatus, PaymentMethod } from '@/+core/constants/commons.constant';
import { FilterType } from '@/pages/product/pages/list';
import { AdminOrderPayload } from '@/types/order';
import { formatCurrency } from '@/+core/helpers';
import Label from '@/components/ui/Label/Label';
import Error from '@/components/ui/Error/Error';
import ProductFilterBar from '../ProductFilterBar';
import DataLoading from '@/components/ui/DataLoading/DataLoading';
import ProductDataTable from '../ProductDataTable';
import CartForm from '../CartForm';
import { LuSend } from 'react-icons/lu';
import { MdCancel, MdOutlineBookmarkAdded, MdPaid, MdPending } from 'react-icons/md';
import { FaRegCheckCircle, FaRegCreditCard, FaTruck, FaUser } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';
import styles from './styles.module.scss';

const orderStatusValues = Object.values(OrderStatus);
const deliveryStatusValues = Object.values(DeliveryStatus);
const paymentMethodValues = Object.values(PaymentMethod);

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

export const PAGE_SIZE = 6;

interface PropType {
  loading: boolean;
  handleSubmitForm: (payload: AdminOrderPayload) => Promise<void>;
}

const OrderCreateForm = (props: PropType) => {
  const { loading, handleSubmitForm } = props;

  const { searchParams, updateParams } = useQueryParams();

  const navigate = useNavigate();
  const scrollToId = useScrollToId();
  const { t } = useTranslation();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const isActive = searchParams.get('isActive') ?? '';

  const panelActiveKey = useMemo(() => {
    const value = searchParams.get('collapse');

    // Chưa có param → mở hết
    if (value === null) return ['general-information', 'section-information'];

    // Có param nhưng rỗng → đóng hết
    if (value === '') return [];

    return value.split(',');
  }, [searchParams]);

  const {
    data: users,
    total: userTotal,
    loading: usersLoading,
    error: userError,
    fetchData: fetchSearchData,
    setData: setUserData,
    setTotal: setUserTotal,
  } = useSearchList();

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const debouncedKeyword = useDebounce(searchKeyword, 500);

  const [productFilter, setProductFilter] = useState<FilterType>({
    page: page,
    q: q,
    categoryId: categoryId,
    isActive: isActive,
  });
  const productSearch = useDebounce(productFilter.q, 500);

  const { cartItems, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const {
    data: products,
    loading: productsLoading,
    error: productError,
    paging: productPaging,
    params: productPararms,
    setParams: setProductParams,
    fetchData: fetchProductData,
  } = useList({
    page: productFilter.page,
    q: productFilter.q,
    categoryId: productFilter.categoryId,
    isActive: productFilter.isActive,
    limit: PAGE_SIZE,
  });

  const USER_OPTIONS = useMemo(() => {
    if (!users) return [];

    return users?.map((user) => {
      return {
        ...user,
        value: user?.id,
        label: user?.fullName,
      };
    });
  }, [users]);

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

  const FormSchema = z
    .object({
      userId: z.string({
        required_error: t('this_field_is_required'),
        invalid_type_error: t('this_field_is_required'),
      }),
      note: z.string(),
      deliveryAddress: z.string().min(1, { message: t('this_field_is_required') }),
      status: z.string({
        required_error: t('this_field_is_required'),
        invalid_type_error: t('this_field_is_required'),
      }),
      deliveryStatus: z.string({
        required_error: t('this_field_is_required'),
        invalid_type_error: t('this_field_is_required'),
      }),
      method: z.string({
        required_error: t('this_field_is_required'),
        invalid_type_error: t('this_field_is_required'),
      }),
      amount: z
        .number({
          required_error: t('this_field_is_required'),
          invalid_type_error: t('this_field_is_required'),
        })
        .min(1, t('this_field_must_be_greater_than_0'))
        .refine((val) => val <= totalPrice, {
          message: t('amount_exceed_total'),
        }),
      cartItems: z
        .array(
          z.object({
            product: z.any(),
            quantity: z
              .number({
                required_error: t('this_field_is_required'),
                invalid_type_error: t('this_field_is_required'),
              })
              .min(1, t('quantity_must_be_greater_than_0')),
          }),
        )
        .min(1, t('product.cart_required')),
    })
    .superRefine((data, ctx) => {
      /** Validate status */
      if (data.status && !orderStatusValues.includes(data.status as OrderStatus)) {
        ctx.addIssue({
          path: ['status'],
          message: t('invalid_value'),
          code: z.ZodIssueCode.custom,
        });
      }

      /** Validate deliveryStatus */
      if (
        data.deliveryStatus &&
        !deliveryStatusValues.includes(data.deliveryStatus as DeliveryStatus)
      ) {
        ctx.addIssue({
          path: ['deliveryStatus'],
          message: t('invalid_value'),
          code: z.ZodIssueCode.custom,
        });
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
    trigger,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: undefined,
      note: '',
      deliveryAddress: '',
      status: undefined,
      deliveryStatus: undefined,
      method: undefined,
      amount: undefined,
      cartItems: [],
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangePanel = (key: string | string[]) => {
    const keys = Array.isArray(key) ? key : [key];
    const params = new URLSearchParams(searchParams.toString());

    params.set('collapse', keys.join(','));

    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleChangeProductFilter = (key: string, value: string) => {
    if (key === 'q') {
      setProductFilter({
        ...productFilter,
        [key]: value,
      });
    }

    if (key !== 'q') {
      setProductFilter({
        ...productFilter,
        [key]: value,
        page: 1,
      });

      setProductParams({
        ...productPararms,
        page: 1,
        [key]: value,
      });

      updateParams({
        page: '1',
        [key]: value,
      });
    }
  };

  const handleProductPageChange = (page: number) => {
    setProductFilter({ ...productFilter, page: page });
    setProductParams({ ...productPararms, page: page });
    updateParams({ page: page.toString() });
    scrollToId('order-product-list', { offset: 150 });
  };

  const handleActionProductItem = async (name: string, value: any) => {
    if (name === 'add_to_cart') {
      addToCart(value, 1);
      clearErrors('amount');
    }
  };

  const onFormSubmit = (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);

    const payload: AdminOrderPayload = {
      userId: data.userId,
      amount: data.amount,
      method: data.method as PaymentMethod,
      deliveryAddress: data.deliveryAddress,
      status: data.status as OrderStatus,
      deliveryStatus: data.deliveryStatus as DeliveryStatus,
      note: data.note,
      items: data.cartItems.map((item) => {
        return {
          productId: item.product?.id,
          quantity: item.quantity,
        };
      }),
    };

    handleSubmitForm(payload);
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);

    message.error(t('double_check_information'));
  };

  useEffect(() => {
    if (!debouncedKeyword) {
      setUserData([]);
      setUserTotal(0);
      return;
    }

    fetchSearchData({ q: debouncedKeyword });
  }, [debouncedKeyword]);

  useEffect(() => {
    setValue('amount', totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    setValue('cartItems', cartItems, {
      shouldValidate: cartItems.length > 0,
    });
  }, [cartItems, setValue]);

  // Product search debounce
  useEffect(() => {
    setProductParams({
      ...productPararms,
      page: 1,
      q: productSearch,
    });

    updateParams({
      page: '1',
      q: productSearch,
    });
  }, [productSearch]);

  return (
    <form className={styles.container} onSubmit={handleSubmit(onFormSubmit, onError)}>
      <section className='w-full flex flex-col gap-5'>
        <div className='block__container'>
          <span className='text-xl text-primary font-bold'>
            {t('add')} {t('breadcrumb.order')}
          </span>
        </div>

        <Collapse activeKey={panelActiveKey} onChange={handleChangePanel}>
          <Panel header={t('order.general_information')} key='general-information'>
            <div className={styles.general__container}>
              <Controller
                control={control}
                name='userId'
                render={({ field }) => (
                  <div className='w-full flex flex-col gap-2'>
                    <Label title={t('user.default')} required />

                    <Select
                      value={field.value}
                      placeholder={t('user.name_placeholder')}
                      showSearch
                      allowClear
                      loading={usersLoading}
                      filterOption={false}
                      optionLabelProp='label' // QUAN TRỌNG
                      onSearch={(value) => setSearchKeyword(value)}
                      onChange={(value) => field.onChange(value)}
                      onClear={() => {
                        field.onChange(undefined);
                        setSearchKeyword('');
                      }}
                      status={errors.userId ? 'error' : ''}
                    >
                      {USER_OPTIONS?.map((item) => {
                        const value = get(item, 'value', '');
                        const name = get(item, 'label', '');
                        const avatar = get(item, 'avatar', '');
                        const email = get(item, 'email', '');
                        const phone = get(item, 'phone', '');

                        return (
                          <Select.Option
                            key={value}
                            value={value}
                            // Label CHỈ dùng khi đã chọn
                            label={
                              <div className='flex items-center gap-2'>
                                <Avatar
                                  size={24}
                                  src={avatar}
                                  icon={<FaUser size={10} />}
                                  className={`${!avatar && 'bg-primary'}`}
                                />
                                <span className='max-w-[140px] truncate font-medium'>{name}</span>
                              </div>
                            }
                          >
                            {/* Dropdown option */}
                            <div className='flex items-center gap-3'>
                              <Avatar
                                size={30}
                                src={avatar}
                                icon={<FaUser size={12} />}
                                className={`${!avatar && 'bg-primary'}`}
                              />
                              <div className='flex flex-col gap-1'>
                                <span className='max-w-[180px] truncate text-[0.85rem] font-semibold'>
                                  {name}
                                </span>
                                <span className='text-[0.7rem] text-zinc-700'>
                                  {email} | {phone}
                                </span>
                              </div>
                            </div>
                          </Select.Option>
                        );
                      })}
                    </Select>

                    {errors.userId && (
                      <Text type='danger' style={{ fontSize: 12 }}>
                        {errors.userId.message}
                      </Text>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name='deliveryAddress'
                render={({ field }) => {
                  return (
                    <div className='w-full flex flex-col gap-2'>
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
                name='method'
                render={({ field }) => {
                  return (
                    <div className='w-full flex flex-col gap-2'>
                      <Label title={t('payment.method')} required />

                      <Select
                        {...field}
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
                name='status'
                render={({ field }) => {
                  return (
                    <div className='w-full flex flex-col gap-2'>
                      <Label title={t('status')} required />

                      <Select
                        {...field}
                        placeholder={t('status')}
                        showSearch
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
                        placeholder={t('note')}
                        status={errors.note ? 'error' : ''}
                        rows={6}
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
          </Panel>

          <Panel header={`${t('order.product_list')}`} key='section-information'>
            <div className='w-full flex flex-col gap-5'>
              <ProductFilterBar
                filter={productFilter}
                handleChangeFilter={handleChangeProductFilter}
              />

              {!productsLoading && productError && <Error />}

              {loading ? (
                <div className='mt-10'>
                  <DataLoading size='large' />
                </div>
              ) : (
                <ProductDataTable
                  filter={productFilter}
                  data={products}
                  paging={productPaging}
                  handlePageChange={handleProductPageChange}
                  handleActionItem={handleActionProductItem}
                />
              )}
            </div>
          </Panel>
        </Collapse>
      </section>

      <section
        className='block__container w-full h-[calc(100vh-130px)] sticky top-[100px]
                    flex flex-col justify-between gap-5'
      >
        <CartForm
          data={cartItems}
          error={errors.cartItems ? true : false}
          errorMessage={errors.cartItems ? errors.cartItems.message : ''}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />

        <div className='w-full flex flex-col gap-5'>
          <span className='text-[1.05rem] text-primary font-semibold'>
            {t('total')}: {formatCurrency(totalPrice)}
          </span>

          <Controller
            control={control}
            name='amount'
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('price')} required />

                <InputNumber
                  className='w-full'
                  value={field.value}
                  min={0}
                  suffix={'đ'}
                  onChange={(value) => field.onChange(value)}
                  placeholder={t('price')}
                  status={errors.amount ? 'error' : undefined}
                  formatter={(value) =>
                    value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                  }
                  parser={(value) => (value ? Number(value.replace(/\./g, '')) : null) as number}
                />

                {errors.amount && (
                  <Typography.Text type='danger' style={{ fontSize: 12 }}>
                    {errors.amount.message}
                  </Typography.Text>
                )}
              </div>
            )}
          />
          <div className='flex items-center justify-end gap-2'>
            <Button className='w-full' htmlType='button' onClick={handleBack}>
              {t('back')}
            </Button>

            <Button
              className='w-full'
              htmlType='submit'
              type='primary'
              loading={loading}
              icon={<LuSend />}
            >
              {t('save')}
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default OrderCreateForm;
