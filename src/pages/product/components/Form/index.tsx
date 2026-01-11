import { useNavigate, useParams } from 'react-router-dom';
import { Button, Divider, Input, InputNumber, Typography } from 'antd';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { SLUG_REGEX } from '@/+core/constants/commons.constant';
import { UpdateCategoryPayload } from '@/types/category';
import { CreateProductPayload, Product } from '@/types/product';
import { LuSend } from 'react-icons/lu';
import Label from '@/components/ui/Label/Label';
import UploadFile from '@/components/ui/UploadFile/UploadFile';

const { Text } = Typography;

interface PropType {
  defaultValues: Product | null;
  mode: 'add' | 'edit' | 'view';
  loading: boolean;
  onSubmit: (data: CreateProductPayload | UpdateCategoryPayload) => void;
}

const ProductForm = (props: PropType) => {
  const { defaultValues, mode, loading, onSubmit } = props;

  const navigate = useNavigate();
  const params = useParams();

  const { t } = useTranslation();

  const id = params?.id ?? '';

  const FormSchema = z
    .object({
      name: z.string().min(1, { message: t('this_field_is_required') }),
      sku: z.string().min(1, { message: t('this_field_is_required') }),
      slug: z
        .string()
        .min(1, { message: t('this_field_is_required') })
        .regex(SLUG_REGEX, {
          message: t('invalid_slug'),
        }),
      price: z.number().nullable(),
      stock: z.number().nullable(),
      imagesUrl: z.array(z.string()).min(1, { message: t('this_field_is_required') }),
    })
    .superRefine((data, ctx) => {
      if (data.price === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('this_field_is_required'),
          path: ['price'],
        });
      } else if (data.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('this_field_must_be_greater_than_0'),
          path: ['price'],
        });
      }

      if (data.stock === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('this_field_is_required'),
          path: ['stock'],
        });
      } else if (data.stock <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('this_field_must_be_greater_than_0'),
          path: ['stock'],
        });
      }
    });
  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          sku: defaultValues.sku,
          slug: defaultValues.slug,
          price: defaultValues.price,
          stock: defaultValues.stock,
          imagesUrl: defaultValues.imagesUrl,
        }
      : { name: '', sku: '', slug: '', price: null, stock: null, imagesUrl: [] },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectEdit = (id: string) => {
    navigate(`/product/edit/${id}`);
  };

  const onFormSubmit = (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);
    onSubmit(data);
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
          {t(`${mode}`)} {t('breadcrumb.product')}
        </span>

        <div className='flex items-center justify-center gap-2'>
          {mode === 'view' && (
            <Button
              type='primary'
              htmlType='button'
              onClick={() => {
                handleRedirectEdit(id);
              }}
            >
              {t('edit')}
            </Button>
          )}

          {mode === 'view' && (
            <Button
              type={mode === 'view' ? 'default' : 'primary'}
              htmlType='button'
              onClick={handleBack}
            >
              {t('back')}
            </Button>
          )}
        </div>
      </section>

      <Divider className='my-0' />

      <section className='grid grid-cols-1 md:grid-cols-[1fr_350px] gap-5'>
        <section className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5'>
          <Controller
            control={control}
            name='name'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('product.name')} required />

                  <Input
                    {...field}
                    disabled={mode === 'view'}
                    placeholder={t('product.name')}
                    status={errors.name ? 'error' : ''}
                  />

                  {errors.name && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.name.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />

          <Controller
            control={control}
            name='sku'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={'SKU'} required />

                  <Input
                    {...field}
                    disabled={mode === 'view'}
                    placeholder={'SKU'}
                    status={errors.sku ? 'error' : ''}
                  />

                  {errors.sku && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.sku.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />

          <Controller
            control={control}
            name='slug'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={'Slug'} required />

                  <Input
                    {...field}
                    disabled={mode === 'view'}
                    placeholder={'Slug'}
                    status={errors.slug ? 'error' : ''}
                  />

                  {errors.slug && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.slug.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />

          <Controller
            control={control}
            name='price'
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('price')} required />

                <InputNumber
                  className='w-full'
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={mode === 'view'}
                  placeholder={t('price')}
                  status={errors.price ? 'error' : undefined}
                  min={0}
                />

                {errors.price && (
                  <Typography.Text type='danger' style={{ fontSize: 12 }}>
                    {errors.price.message}
                  </Typography.Text>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name='stock'
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('stock')} required />

                <InputNumber
                  className='w-full'
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={mode === 'view'}
                  placeholder={t('stock')}
                  status={errors.price ? 'error' : undefined}
                  min={0}
                />

                {errors.stock && (
                  <Typography.Text type='danger' style={{ fontSize: 12 }}>
                    {errors.stock.message}
                  </Typography.Text>
                )}
              </div>
            )}
          />
        </section>

        <Controller
          control={control}
          name='imagesUrl'
          render={({ field, fieldState }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('image')} required />

                <UploadFile
                  {...field}
                  mode='multiple'
                  disabled={mode === 'view'}
                  error={fieldState.error ? true : false}
                />

                {errors.imagesUrl && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.imagesUrl.message}
                  </Text>
                )}
              </div>
            );
          }}
        />
      </section>

      {mode !== 'view' && (
        <section className='flex items-center justify-end gap-2'>
          <Button htmlType='button' onClick={handleBack}>
            Hủy
          </Button>

          <Button htmlType='submit' type='primary' loading={loading} icon={<LuSend />}>
            Lưu
          </Button>
        </section>
      )}
    </form>
  );
};

export default ProductForm;
