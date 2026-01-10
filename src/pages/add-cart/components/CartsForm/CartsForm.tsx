import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, InputNumber, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Editor from '../Editor/Editor';

interface PropType {
  defaultValues: any;
  isEdit: boolean;
  submitLoading: boolean;
  onFinish: (data: any) => void;
}

const CartsForm = (props: PropType) => {
  const { defaultValues, isEdit, submitLoading, onFinish } = props;

  const cartItemSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
    description: z.string().min(1, 'Vui lòng nhập mô tả'),
    quantity: z
      .number()
      .min(1, 'Số lượng phải lớn hơn 0')
      .refine((val) => typeof val === 'number', {
        message: 'Số lượng phải là số',
      }),
  });

  const schema = z.object({
    carts: z.array(cartItemSchema).min(1, 'Cần ít nhất 1 sản phẩm'),
  });

  type FormType = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      carts: [{ title: '', description: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'carts',
  });

  const onSubmit = (data: any) => {
    onFinish(data);
    reset();
  };

  const onError = (errors: any) => {
    console.error('Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey === 'carts') {
      const firstCartErrorIndex = Number(Object.keys(errors.carts || {})[0]);
      const firstCartFieldKey = Object.keys((errors.carts as any)[firstCartErrorIndex] || {})[0];
      if (firstCartFieldKey && firstCartFieldKey !== 'description') {
        setFocus(`carts.${firstCartErrorIndex}.${firstCartFieldKey}` as any);
      }
      // Nếu là description thì scroll tới đó
      if (firstCartFieldKey === 'description') {
        const el = document.querySelector(
          `[data-quill-index="${firstCartErrorIndex}"] .ql-editor`,
        ) as HTMLElement;
        el?.focus();
      }
    } else {
      setFocus(firstErrorKey as any);
    }
  };

  return (
    <Form className='flex flex-col gap-5' onFinish={handleSubmit(onSubmit, onError)}>
      <span className='font-bold text-xl text-primary'>
        {!isEdit ? 'Thêm mới' : 'Chỉnh sửa'} giỏ hàng
      </span>

      <div className='flex flex-col gap-5'>
        {fields.map((field, index) => (
          <div key={field.id} className='h-full flex flex-col gap-3'>
            <div className='flex items-start gap-5'>
              {/* Title */}
              <Form.Item
                validateStatus={errors.carts?.[index]?.title ? 'error' : undefined}
                help={errors.carts?.[index]?.title?.message}
              >
                <Controller
                  control={control}
                  name={`carts.${index}.title`}
                  render={({ field }) => <Input placeholder='Nhập tên sản phẩm' {...field} />}
                />
              </Form.Item>

              {/* Quantity */}
              <Form.Item
                validateStatus={errors.carts?.[index]?.quantity ? 'error' : undefined}
                help={errors.carts?.[index]?.quantity?.message}
              >
                <Controller
                  control={control}
                  name={`carts.${index}.quantity`}
                  render={({ field }) => <InputNumber min={1} {...field} />}
                />
              </Form.Item>

              <Form.Item>
                <MinusCircleOutlined
                  onClick={() => remove(index)}
                  style={{ color: 'red', fontSize: 18 }}
                />
              </Form.Item>
            </div>

            {/* Description */}
            <Form.Item
              validateStatus={errors.carts?.[index]?.description ? 'error' : undefined}
              help={errors.carts?.[index]?.description?.message}
            >
              <Controller
                control={control}
                name={`carts.${index}.description`}
                render={({ field }) => (
                  <Editor value={field.value} onChange={field.onChange} height={300} />
                )}
              />
            </Form.Item>
          </div>
        ))}
      </div>

      <Form.Item>
        <Button
          type='dashed'
          onClick={() => append({ title: '', description: '', quantity: 1 })}
          icon={<PlusOutlined />}
        >
          Thêm sản phẩm
        </Button>
      </Form.Item>

      {errors.carts?.message && (
        <Typography.Text type='danger'>{errors.carts.message}</Typography.Text>
      )}

      <Form.Item>
        <Button type='primary' htmlType='submit' loading={submitLoading}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CartsForm;
