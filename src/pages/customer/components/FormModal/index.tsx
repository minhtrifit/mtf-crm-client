import { useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Input, Modal, Typography } from 'antd';
import { Customer } from '@/types/customer';
import { useTranslation } from 'react-i18next';
import Label from '@/components/ui/Label/Label';
import { LuSend } from 'react-icons/lu';

const { Text } = Typography;

interface PropType {
  mode: 'add' | 'edit' | 'detail';
  open: boolean;
  defaultValues: Customer | null;
  loading: boolean;
  onClose: () => void;
  onOk: (mode: 'add' | 'edit' | 'detail', value: Customer) => void;
}

const FormModal = (props: PropType) => {
  const { mode, open, defaultValues, loading, onClose, onOk } = props;

  const { t } = useTranslation();

  const FormSchema = z.object({
    fullName: z.string().min(1, { message: t('this_field_is_required') }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const emptyValue = {
    fullName: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: emptyValue,
  });

  // Mỗi khi defaultValues thay đổi (edit/detail), reset form
  useEffect(() => {
    reset(defaultValues ?? emptyValue);
  }, [defaultValues]);

  const onSubmit = (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);

    onOk(mode, data as Customer);

    if (mode === 'add') reset();
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <Modal
      title={
        <span className='text-xl text-primary font-bold'>
          {t(`${mode}`)} {t('breadcrumb.category')}
        </span>
      }
      width={500}
      centered
      footer={null}
      open={open}
      maskClosable={false}
      onOk={() => {
        onClose();
      }}
      onCancel={() => onClose()}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className='flex flex-col gap-5'>
        <Divider className='my-0' />

        <Controller
          control={control}
          name='fullName'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('category.name')} required />

                <Input
                  {...field}
                  disabled={mode === 'detail'}
                  placeholder={t('category.name')}
                  status={errors.fullName ? 'error' : ''}
                />

                {errors.fullName && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.fullName.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        {mode !== 'detail' && (
          <section className='flex items-center justify-end gap-2'>
            <Button htmlType='button' onClick={onClose}>
              {t('cancel')}
            </Button>

            <Button htmlType='submit' type='primary' loading={loading} icon={<LuSend />}>
              {t('save')}
            </Button>
          </section>
        )}
      </form>
    </Modal>
  );
};

export default FormModal;
