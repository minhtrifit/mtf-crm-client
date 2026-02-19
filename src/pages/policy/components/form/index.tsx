import { useEffect } from 'react';
import { get } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Divider, Input, Typography } from 'antd';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import { CreatePolicyPayload, Policy, UpdatePolicyPayload } from '@/types/policy';
import { SLUG_REGEX } from '@/+core/constants/commons.constant';
import { generateSlug } from '@/+core/helpers';
import { LuSend } from 'react-icons/lu';
import Label from '@/components/ui/Label/Label';
import RenderHtmlContent from '@/components/ui/RenderHtmlContent';
import { TextEditor } from '@/components/ui/TextEditor/TextEditor';

const { Text } = Typography;

interface PropType {
  defaultValues: Policy | null;
  mode: 'add' | 'edit' | 'detail';
  loading: boolean;
  onSubmit: (data: CreatePolicyPayload | UpdatePolicyPayload) => void;
}

const PolicyForm = (props: PropType) => {
  const { defaultValues, mode, loading, onSubmit } = props;

  const navigate = useNavigate();
  const params = useParams();

  const id = params?.id ?? '';

  const { t } = useTranslation();

  const FormSchema = z.object({
    title: z.string().min(1, { message: t('this_field_is_required') }),
    slug: z
      .string()
      .min(1, { message: t('this_field_is_required') })
      .regex(SLUG_REGEX, {
        message: t('invalid_slug'),
      }),
    content: z.string().min(1, { message: t('this_field_is_required') }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
    watch,
    clearErrors,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          slug: defaultValues.slug,
          content: defaultValues.content,
        }
      : {
          title: '',
          slug: '',
          content: '',
        },
  });

  const title = watch('title');
  const debouncedTitle = useDebounce(title, 700);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectEdit = (id: string) => {
    navigate(`/admin/policy/edit/${id}`);
  };

  const handleRedirectDetail = (id: string) => {
    navigate(`/admin/policy/detail/${id}`);
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
    if (!debouncedTitle) {
      setValue('slug', '');
      return;
    }

    const value = generateSlug(title);
    setValue('slug', value);
    clearErrors('slug');
  }, [debouncedTitle]);

  return (
    <form
      className='block__container flex flex-col gap-5'
      onSubmit={handleSubmit(onFormSubmit, onError)}
    >
      <section className='flex items-center justify-between'>
        <span className='text-xl text-primary font-bold'>
          {t(`${mode}`)} {t('breadcrumb.policy')}
        </span>

        {mode === 'detail' && (
          <div className='flex items-center justify-center gap-2'>
            <Button type='default' htmlType='button' onClick={handleBack}>
              {t('back')}
            </Button>

            <Button
              type='primary'
              htmlType='button'
              onClick={() => {
                handleRedirectEdit(id);
              }}
            >
              {t('edit')}
            </Button>
          </div>
        )}

        {mode === 'edit' && (
          <div className='flex items-center justify-center gap-2'>
            <Button
              type='primary'
              htmlType='button'
              onClick={() => {
                handleRedirectDetail(id);
              }}
            >
              {t('detail')}
            </Button>
          </div>
        )}
      </section>

      <Divider className='my-0' />

      <section className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <Controller
          control={control}
          name='title'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('policy.title')} required />

                <Input
                  {...field}
                  disabled={mode === 'detail'}
                  placeholder={t('policy.title')}
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

        <Controller
          control={control}
          name='slug'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title='Slug' required />

                <Input
                  {...field}
                  disabled={mode === 'detail'}
                  placeholder='Slug'
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

        {mode === 'detail' && (
          <div className='col-span-full'>
            <RenderHtmlContent content={get(defaultValues, 'content', '')} />
          </div>
        )}

        {mode !== 'detail' && (
          <Controller
            control={control}
            name='content'
            render={({ field }) => {
              return (
                <div className='w-full flex flex-col gap-2 col-span-full'>
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

export default PolicyForm;
