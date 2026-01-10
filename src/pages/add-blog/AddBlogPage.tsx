import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, message, Typography } from 'antd';
import { LuSend } from 'react-icons/lu';
import { TextEditor } from '@/components/ui/TextEditor/TextEditor';
import Label from '@/components/ui/Label/Label';

const { Text } = Typography;

const AddBlogPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const FormSchema = z.object({
    content: z.string().min(1, { message: 'Vui lòng nhập nội dung' }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
    reset,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = (data: any) => {
    console.log('✅ Dữ liệu hợp lệ:', data);

    message.success('Tạo thành công');
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <div className='block__container'>
      <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit, onError)}>
        <Controller
          control={control}
          name='content'
          render={({ field, fieldState }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title='Nội dung' />

                <TextEditor
                  {...field}
                  error={fieldState.error?.message}
                  key='blog_content'
                  height={400}
                  placeholder={'Nhập nội dung'}
                  value={field.value}
                  onChange={(data) => {
                    field.onChange(data);
                    clearErrors('content');
                  }}
                />

                {errors.content && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.content.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <section className='flex items-center justify-end gap-2'>
          <Button htmlType='button' onClick={handleBack}>
            Hủy
          </Button>

          <Button htmlType='submit' type='primary' loading={false} icon={<LuSend />}>
            Lưu
          </Button>
        </section>
      </form>
    </div>
  );
};

export default AddBlogPage;
