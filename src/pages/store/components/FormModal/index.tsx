import { useEffect } from 'react';
import { get } from 'lodash';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Input, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Store } from '@/types/store';
import Label from '@/components/ui/Label/Label';
import { LuSend } from 'react-icons/lu';

const { Text } = Typography;

interface PropType {
  mode: 'add' | 'edit' | 'detail';
  open: boolean;
  defaultValues: Store | null;
  loading: boolean;
  onClose: () => void;
  onOk: (mode: 'add' | 'edit' | 'detail', value: Store) => void;
}

const FormModal = (props: PropType) => {
  const { mode, open, defaultValues, loading, onClose, onOk } = props;

  const { t } = useTranslation();

  const FormSchema = z.object({
    name: z.string().min(1, { message: t('this_field_is_required') }),
    email: z.string().min(1, { message: t('this_field_is_required') }),
    hotline: z.string().min(1, { message: t('this_field_is_required') }),
    taxCode: z.string().min(1, { message: t('this_field_is_required') }),
    address: z.string().min(1, { message: t('this_field_is_required') }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const emptyValue = {
    name: '',
    email: '',
    hotline: '',
    taxCode: '',
    address: '',
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

    onOk(mode, data as Store);

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
          {t(`${mode}`)} {t('breadcrumb.store')}
        </span>
      }
      width={800}
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {mode !== 'add' && (
            <div className='w-full flex flex-col gap-2'>
              <Label title={t('store.code')} />
              <span className='font-bold text-primary'>{get(defaultValues, 'code', '')}</span>
            </div>
          )}

          <Controller
            control={control}
            name='name'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('store.name')} required />

                  <Input
                    {...field}
                    disabled={mode === 'detail'}
                    placeholder={t('store.name')}
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
            name='email'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={'Email'} required />

                  <Input
                    {...field}
                    disabled={mode === 'detail'}
                    placeholder={'Email'}
                    status={errors.email ? 'error' : ''}
                  />

                  {errors.email && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.email.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
          <Controller
            control={control}
            name='hotline'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={'Hotline'} required />

                  <Input
                    {...field}
                    disabled={mode === 'detail'}
                    placeholder={'Hotline'}
                    status={errors.hotline ? 'error' : ''}
                  />

                  {errors.hotline && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.hotline.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
          <Controller
            control={control}
            name='taxCode'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('store.tax_code')} required />

                  <Input
                    {...field}
                    disabled={mode === 'detail'}
                    placeholder={t('store.tax_code')}
                    status={errors.taxCode ? 'error' : ''}
                  />

                  {errors.taxCode && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.taxCode.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
          <Controller
            control={control}
            name='address'
            render={({ field }) => {
              return (
                <div className={`${mode === 'add' && 'col-span-full'} w-full flex flex-col gap-2`}>
                  <Label title={t('store.address')} required />

                  <Input
                    {...field}
                    disabled={mode === 'detail'}
                    placeholder={t('store.address')}
                    status={errors.address ? 'error' : ''}
                  />

                  {errors.address && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.address.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
        </div>

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
