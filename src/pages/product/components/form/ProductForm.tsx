import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input, InputNumber, Button, Select, Typography, Upload, Form } from 'antd';
import type { UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { handleRenderFormModeText } from '@/+core/helpers';

const { Text } = Typography;

interface PropType {
  defaultValues: any;
  mode: 'create' | 'edit' | 'view';
  submitLoading: boolean;
  onFinish: (data: any) => void;
}

const ProductForm = (props: PropType) => {
  const { defaultValues, mode, submitLoading, onFinish } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

  const [uploadingImage, setUploadingImage] = useState(false);

  const productSchema = z.object({
    title: z.string().min(1, t('title-required')),
    category: z
      .string()
      .nullable()
      .refine((val) => val && val.length > 0, {
        message: t('category-required'),
      }),
    price: z
      .number()
      .nullable()
      .refine((val) => val !== null && val > 0, {
        message: t('price-min-zero'),
      }),
    image: z.string().min(1, t('image-required')),
    description: z.string().min(1, t('description-required')),
  });

  type ProductFormData = z.infer<typeof productSchema>;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
    setValue,
    reset,
    watch,
    clearErrors,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? {
      title: '',
      category: null,
      price: null,
      image: '',
      description: '',
    },
  });

  const imageUrl = watch('image');

  const handleChange: UploadProps['onChange'] = (info) => {
    clearErrors('image');

    console.log(info);

    setUploadingImage(true);

    setTimeout(() => {
      setValue('image', 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png');
      setUploadingImage(false);
    }, 2000);
  };

  const onSubmit = async (data: ProductFormData) => {
    onFinish(data);
    reset();
  };

  const onError = (errors: any) => {
    console.error('Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <form className='block__container' onSubmit={handleSubmit(onSubmit, onError)}>
      <span className='text-xl text-primary font-bold'>
        {handleRenderFormModeText(mode)} sản phẩm
      </span>

      <div className='mt-5 grid grid-cols-1 xl:grid-cols-2 gap-5'>
        <Controller
          name='title'
          control={control}
          render={({ field }) => {
            return (
              <div className='flex flex-col gap-2'>
                <label>{t('title')}</label>

                <Form.Item validateStatus={errors.title ? 'error' : undefined}>
                  <Input {...field} placeholder='Nhập tên sản phẩm' />
                </Form.Item>

                {errors.title && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.title.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          name='category'
          control={control}
          render={({ field }) => {
            return (
              <div className='flex flex-col gap-2'>
                <label>{t('category')}</label>

                <Form.Item validateStatus={errors.category ? 'error' : undefined}>
                  <Select
                    {...field}
                    onChange={(value) => field.onChange(value)}
                    placeholder='Chọn danh mục'
                  >
                    {categories.map((cat) => (
                      <Select.Option key={cat} value={cat}>
                        {cat}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {errors.category && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.category.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          name='price'
          control={control}
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <label>{t('price')}</label>

                <Form.Item validateStatus={errors.price ? 'error' : undefined}>
                  <InputNumber
                    {...field}
                    min={0}
                    style={{ width: '100%' }}
                    onChange={(value) => field.onChange(value ?? 0)}
                    placeholder='Nhập giá tiền'
                  />
                </Form.Item>

                {errors.price && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.price.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          name='image'
          control={control}
          render={() => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <label>{t('image')}</label>

                <div className='flex items-center gap-5'>
                  <Upload
                    name='avatar'
                    listType='picture-card'
                    className='avatar-uploader'
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleChange}
                  >
                    <button
                      type='button'
                      className='hover:cursor-pointer'
                      style={{ border: 0, background: 'none' }}
                    >
                      {uploadingImage ? <LoadingOutlined /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  </Upload>

                  {imageUrl && (
                    <div className='w-[102px] h-[102px] flex items-center justify-center'>
                      <img src={imageUrl} className='w-full h-full object-cover' alt='avatar' />
                    </div>
                  )}
                </div>

                {errors.image && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.image.message}
                  </Text>
                )}
              </div>
            );
          }}
        />
      </div>

      <div className='w-full mt-5'>
        <Controller
          name='description'
          control={control}
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <label>{t('description')}</label>

                <Form.Item validateStatus={errors.description ? 'error' : undefined}>
                  <Input.TextArea
                    {...field}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    placeholder='Nhập mô tả'
                  />
                </Form.Item>

                {errors.description && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.description.message}
                  </Text>
                )}
              </div>
            );
          }}
        />
      </div>

      <div className='w-full mt-5 flex items-center justify-end gap-2'>
        <Button
          type='default'
          disabled={submitLoading}
          onClick={() => {
            navigate('/management/products');
          }}
        >
          {t('cancel')}
        </Button>

        <Button type='primary' htmlType='submit' disabled={submitLoading} loading={submitLoading}>
          {t('save')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
