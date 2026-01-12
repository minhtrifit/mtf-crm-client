import { useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Divider, Input, InputNumber, Select, Space, Typography } from 'antd';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import { SLUG_REGEX } from '@/+core/constants/commons.constant';
import { generateSlug } from '@/+core/helpers';
import { UpdateCategoryPayload } from '@/types/category';
import { CreateProductPayload, Product } from '@/types/product';
import { useGetShowcaseCategory } from '@/pages/home/hooks/useGetShowcaseCategory';
import { LuSend } from 'react-icons/lu';
import { FaRandom } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import Label from '@/components/ui/Label/Label';
import UploadFile from '@/components/ui/UploadFile/UploadFile';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PropType {
  defaultValues: Product | null;
  mode: 'add' | 'edit' | 'detail';
  loading: boolean;
  onSubmit: (data: CreateProductPayload | UpdateCategoryPayload) => void;
}

const ProductForm = (props: PropType) => {
  const { defaultValues, mode, loading, onSubmit } = props;

  const navigate = useNavigate();
  const params = useParams();

  const { t } = useTranslation();

  const { data: categories, loading: categoriesLoading } = useGetShowcaseCategory();

  const id = params?.id ?? '';

  const categoryOptions = useMemo(() => {
    if (!categories) return [];

    return categories?.map((c) => {
      return {
        value: c.id,
        label: c.name,
        image: c.imageUrl,
      };
    });
  }, [categories]);

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
      categoryId: z.string().nullable(),
      price: z.number().nullable(),
      stock: z.number().nullable(),
      imagesUrl: z.array(z.string()).min(1, { message: t('this_field_is_required') }),
      description: z.string(),
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

      if (data.categoryId === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('this_field_is_required'),
          path: ['categoryId'],
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
    watch,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          sku: defaultValues.sku,
          slug: defaultValues.slug,
          categoryId: defaultValues.categoryId,
          price: defaultValues.price,
          stock: defaultValues.stock,
          imagesUrl: defaultValues.imagesUrl,
          description: defaultValues.description,
        }
      : {
          name: '',
          sku: '',
          slug: '',
          categoryId: null,
          price: null,
          stock: null,
          imagesUrl: [],
          description: '',
        },
  });

  const name = watch('name');
  const debouncedName = useDebounce(name, 700);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectEdit = (id: string) => {
    navigate(`/admin/product/edit/${id}`);
  };

  const generateSku = () => {
    return `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
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

  useEffect(() => {
    if (!debouncedName) {
      setValue('slug', '');
      return;
    }

    const value = generateSlug(name);
    setValue('slug', value);
  }, [debouncedName]);

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
          {mode === 'detail' && (
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

          {mode === 'detail' && (
            <Button
              type={mode === 'detail' ? 'default' : 'primary'}
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
        <section className='grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5'>
          <Controller
            control={control}
            name='name'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('product.name')} required />

                  <Input
                    {...field}
                    disabled={mode === 'detail'}
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
            render={({ field }) => (
              <div className='w-full flex flex-col gap-2'>
                <Label title='SKU' required />

                <Space.Compact>
                  <Input
                    {...field}
                    disabled={mode === 'detail'}
                    placeholder='SKU'
                    status={errors.sku ? 'error' : ''}
                  />
                  <Button
                    type='primary'
                    disabled={mode === 'detail'}
                    icon={<FaRandom />}
                    onClick={() => {
                      const sku = generateSku();
                      setValue('sku', sku, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                </Space.Compact>

                {errors.sku && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.sku.message}
                  </Text>
                )}
              </div>
            )}
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
                    disabled={mode === 'detail'}
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
            name='categoryId'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('category.default')} required />

                  <Select
                    {...field}
                    disabled={categoriesLoading}
                    placeholder={t('category.default')}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    status={errors.categoryId ? 'error' : ''}
                    onClear={() => {
                      setValue('categoryId', null);
                      trigger('categoryId');
                    }}
                    onChange={(value) => {
                      setValue('categoryId', value ? value : null, { shouldValidate: true });
                    }}
                    filterOption={(input, option) => {
                      const label = option?.label;

                      if (typeof label !== 'string') return false;

                      return label.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {categoryOptions?.map((co) => {
                      return (
                        <Option
                          key={`co-${get(co, 'value', '')}`}
                          value={get(co, 'value', '')}
                          label={get(co, 'label', '')}
                        >
                          <div className='flex items-center gap-3'>
                            <Avatar size={30} src={get(co, 'image', '')} icon={<MdCategory />} />

                            <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                              {get(co, 'label', '')}
                            </span>
                          </div>
                        </Option>
                      );
                    })}
                  </Select>

                  {errors.categoryId && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.categoryId.message}
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
                  min={0}
                  suffix={'đ'}
                  onChange={(value) => field.onChange(value)}
                  disabled={mode === 'detail'}
                  placeholder={t('price')}
                  status={errors.price ? 'error' : undefined}
                  formatter={(value) =>
                    value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                  }
                  parser={(value) => (value ? Number(value.replace(/\./g, '')) : null) as number}
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
                  disabled={mode === 'detail'}
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

          <Controller
            control={control}
            name='description'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2 col-span-full'>
                  <Label title={t('description')} />

                  <TextArea
                    {...field}
                    disabled={mode === 'detail'}
                    placeholder={t('description')}
                    status={errors.description ? 'error' : ''}
                    rows={8}
                  />

                  {errors.description && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.description.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
        </section>

        <Controller
          control={control}
          name='imagesUrl'
          render={({ field, fieldState }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('image_square')} required />

                <UploadFile
                  {...field}
                  mode='multiple'
                  disabled={mode === 'detail'}
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

export default ProductForm;
