import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Button, DatePicker, Divider, Input, InputNumber, Select, Switch, Typography } from 'antd';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { LuSend } from 'react-icons/lu';
import Label from '@/components/ui/Label/Label';
import { Coupon, CouponPayload, UpdateCouponPayload } from '@/types/coupon';
import { getFormSchema } from './schema';

const { Text } = Typography;
const { TextArea } = Input;

const formatGroupedNumber = (value: string | number | undefined) => {
  if (value === undefined || value === '') return '';

  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(number)
    : '';
};

interface PropType {
  defaultValues: Coupon | null;
  mode: 'add' | 'edit';
  loading: boolean;
  onSubmit: (data: CouponPayload | UpdateCouponPayload) => void;
}

const CouponForm = (props: PropType) => {
  const { defaultValues, mode, loading, onSubmit } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const FormSchema = getFormSchema(t);

  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          code: defaultValues.code,
          description: defaultValues.description ?? '',
          type: defaultValues.type,
          value: defaultValues.value,
          minOrderAmount: defaultValues.minOrderAmount,
          maxDiscountAmount: defaultValues.maxDiscountAmount,
          startsAt: new Date(defaultValues.startsAt),
          expiresAt: new Date(defaultValues.expiresAt),
          usageLimit: defaultValues.usageLimit,
          perUserLimit: defaultValues.perUserLimit,
          isActive: defaultValues.isActive,
        }
      : {
          code: '',
          description: '',
          type: 'PERCENTAGE',
          value: null,
          minOrderAmount: 0,
          maxDiscountAmount: null,
          startsAt: new Date(),
          expiresAt: dayjs().add(30, 'day').toDate(),
          usageLimit: null,
          perUserLimit: 1,
          isActive: true,
        },
  });
  const discountType = watch('type');

  const onFormSubmit = (data: FormType) => {
    onSubmit({
      code: data.code.trim().toUpperCase(),
      description: data.description.trim() || null,
      type: data.type,
      value: data.value!,
      minOrderAmount: data.minOrderAmount!,
      maxDiscountAmount: data.maxDiscountAmount,
      startsAt: data.startsAt.toISOString(),
      expiresAt: data.expiresAt.toISOString(),
      usageLimit: data.usageLimit,
      perUserLimit: data.perUserLimit!,
      isActive: data.isActive,
    });
  };

  const onError = (formErrors: typeof errors) => {
    const firstErrorKey = Object.keys(formErrors)[0] as keyof FormType | undefined;
    if (firstErrorKey) setFocus(firstErrorKey);
  };

  const renderError = (name: keyof FormType) =>
    errors[name]?.message ? (
      <Text type='danger' style={{ fontSize: 12 }}>
        {String(errors[name]?.message)}
      </Text>
    ) : null;

  const renderNumberInput = (
    name: 'value' | 'minOrderAmount' | 'maxDiscountAmount' | 'usageLimit' | 'perUserLimit',
    title: string,
    options?: { min?: number; precision?: number; placeholder?: string },
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className='w-full flex flex-col gap-2'>
          <Label title={title} required={name !== 'maxDiscountAmount' && name !== 'usageLimit'} />
          <InputNumber
            className='w-full'
            min={options?.min ?? 0}
            precision={options?.precision}
            value={field.value}
            onChange={field.onChange}
            formatter={formatGroupedNumber}
            parser={(value) =>
              (value ?? '')
                .replace(/\./g, '')
                .replace(',', '.')
                .replace(/[^\d.-]/g, '')
            }
            placeholder={options?.placeholder}
            suffix={name === 'value' ? (discountType === 'PERCENTAGE' ? '%' : '₫') : undefined}
            status={errors[name] ? 'error' : ''}
          />
          {renderError(name)}
        </div>
      )}
    />
  );

  return (
    <form
      className='block__container flex flex-col gap-5'
      onSubmit={handleSubmit(onFormSubmit, onError)}
    >
      <section className='flex items-center justify-between'>
        <span className='text-xl text-primary font-bold'>
          {t(mode)} {t('breadcrumb.coupon')}
        </span>
      </section>

      <Divider className='my-0' />

      <div className='w-full grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5'>
        <section className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <Controller
            control={control}
            name='isActive'
            render={({ field }) => (
              <div className='w-full flex flex-col items-start gap-3'>
                <Label title={t('coupon.active')} />
                <Switch checked={field.value} onChange={field.onChange} />
              </div>
            )}
          />

          <Controller
            control={control}
            name='code'
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('coupon.code')} required />
                <Input
                  {...field}
                  maxLength={50}
                  placeholder={t('coupon.code_placeholder')}
                  status={errors.code ? 'error' : ''}
                  onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                />
                {renderError('code')}
              </div>
            )}
          />

          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('coupon.discount_type')} required />
                <Select
                  {...field}
                  options={[
                    { value: 'PERCENTAGE', label: t('coupon.percentage') },
                    { value: 'FIXED', label: t('coupon.fixed') },
                  ]}
                />
              </div>
            )}
          />
          {renderNumberInput('value', t('coupon.discount_value'), {
            min: 0,
            placeholder: t('coupon.discount_value'),
          })}
          {renderNumberInput('minOrderAmount', t('coupon.min_order_amount'), {
            min: 0,
            placeholder: t('coupon.min_order_amount'),
          })}
          {renderNumberInput('maxDiscountAmount', t('coupon.max_discount_amount'), {
            min: 0,
            placeholder: t('coupon.unlimited'),
          })}
          {renderNumberInput('usageLimit', t('coupon.usage_limit'), {
            min: 1,
            precision: 0,
            placeholder: t('coupon.unlimited'),
          })}
          {renderNumberInput('perUserLimit', t('coupon.per_user_limit'), {
            min: 1,
            precision: 0,
          })}

          <Controller
            control={control}
            name='startsAt'
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('coupon.starts_at')} required />
                <DatePicker
                  className='w-full'
                  allowClear={false}
                  showTime
                  format='DD/MM/YYYY HH:mm:ss'
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(value: Dayjs | null) => field.onChange(value?.toDate())}
                  status={errors.startsAt ? 'error' : ''}
                />
                {renderError('startsAt')}
              </div>
            )}
          />

          <Controller
            control={control}
            name='expiresAt'
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('coupon.expires_at')} required />
                <DatePicker
                  className='w-full'
                  allowClear={false}
                  showTime
                  format='DD/MM/YYYY HH:mm:ss'
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(value: Dayjs | null) => field.onChange(value?.toDate())}
                  status={errors.expiresAt ? 'error' : ''}
                />
                {renderError('expiresAt')}
              </div>
            )}
          />
        </section>

        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <div className='w-full flex flex-col gap-2'>
              <Label title={t('description')} />
              <TextArea {...field} rows={8} placeholder={t('description')} />
            </div>
          )}
        />
      </div>

      <section className='flex items-center justify-end gap-2'>
        <Button htmlType='button' onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
        <Button htmlType='submit' type='primary' loading={loading} icon={<LuSend />}>
          {t('save')}
        </Button>
      </section>
    </form>
  );
};

export default CouponForm;
