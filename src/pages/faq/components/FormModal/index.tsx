import { useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Input, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Faq } from '@/types/faq';
import Label from '@/components/ui/Label/Label';
import { TextEditor } from '@/components/ui/TextEditor/TextEditor';
import { LuSend } from 'react-icons/lu';
import { get } from 'lodash';

const { Text } = Typography;

interface PropType {
  mode: 'add' | 'edit' | 'detail';
  open: boolean;
  defaultValues: Faq | null;
  loading: boolean;
  onClose: () => void;
  onOk: (mode: 'add' | 'edit' | 'detail', value: Faq) => void;
}

const FormModal = (props: PropType) => {
  const { mode, open, defaultValues, loading, onClose, onOk } = props;

  const { t } = useTranslation();

  const FormSchema = z.object({
    title: z.string().min(1, { message: t('this_field_is_required') }),
    content: z.string().min(1, { message: t('this_field_is_required') }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const emptyValue = {
    title: '',
    content: '',
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

    onOk(mode, data as Faq);

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
          {t(`${mode}`)} {t('breadcrumb.faq')}
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
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className='max-h-[80vh] overflow-y-auto flex flex-col gap-5'
      >
        <Divider className='my-0' />

        {mode === 'detail' && (
          <span className='text-[1rem] font-semibold'>{get(defaultValues, 'title', '')}</span>
        )}

        {mode !== 'detail' && (
          <Controller
            control={control}
            name='title'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('faq.title')} required />

                  <Input
                    {...field}
                    placeholder={t('faq.title')}
                    status={errors.title ? 'error' : ''}
                  />

                  {errors.title && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.title.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
        )}

        {mode === 'detail' && (
          <div
            className='editor-content'
            dangerouslySetInnerHTML={{ __html: get(defaultValues, 'content', '') }}
          />
        )}

        {mode !== 'detail' && (
          <Controller
            control={control}
            name='content'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2'>
                  <Label title={t('faq.content')} required />

                  <TextEditor
                    value={field.value}
                    onChange={field.onChange}
                    height={400}
                    placeholder={t('faq.content')}
                    toolbarSticky={false}
                    error={errors.content?.message}
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
        )}

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
