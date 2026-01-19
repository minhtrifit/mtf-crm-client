import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm, Controller, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateWebsiteTemplatePayload,
  SectionType,
  WebsiteTemplate,
} from '@/types/website_template';
import { Button, Divider, Input, Typography } from 'antd';
import Label from '@/components/ui/Label/Label';
import UploadFile from '@/components/ui/UploadFile/UploadFile';
import ColorPicker from '../ColorPicker';
import { LuSend } from 'react-icons/lu';
import PreviewForm from '../PreviewForm';
import { SectionList } from '../SectionList';
import styles from './styles.module.scss';

const { Text } = Typography;

interface PropType {
  defaultValues: WebsiteTemplate | null;
  mode: 'add' | 'edit' | 'detail';
  loading: boolean;
  onSubmit: (data: CreateWebsiteTemplatePayload) => void;
}

const WebsiteTemplateForm = (props: PropType) => {
  const { defaultValues, mode, loading, onSubmit } = props;

  const navigate = useNavigate();
  const params = useParams();

  const { t } = useTranslation();

  const id = params?.id ?? '';

  const [submitActive, setSubmitActive] = useState<boolean>(false);

  const SectionItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: t('this_field_is_required') }),
    position: z.number().optional(),
    items: z
      .array(
        z.object({
          id: z.string().optional(),
          productId: z.string().optional(),
          position: z.number().optional(),
        }),
      )
      .min(1)
      .default([]),
  });

  const FormSchema = z.object({
    name: z.string().min(1, { message: t('this_field_is_required') }),
    logoUrl: z.string().min(1, { message: t('this_field_is_required') }),
    primaryColor: z.string().min(1, { message: t('this_field_is_required') }),

    sections: z.array(SectionItemSchema).default([]),
  });

  type FormType = z.infer<typeof FormSchema>;

  const methods = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          logoUrl: defaultValues.logoUrl,
          primaryColor: defaultValues.primaryColor,
          sections: defaultValues.sections,
        }
      : {
          name: '',
          logoUrl: '',
          primaryColor: '',
          sections: [],
        },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = methods;

  const primaryColor = watch('primaryColor');
  const logoUrl = watch('logoUrl');

  const sectionFieldArray = useFieldArray({
    control,
    name: 'sections',
  });

  const { fields, move: sectionMove } = sectionFieldArray;

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectDetail = (id: string) => {
    navigate(`/admin/website-template/detail/${id}`);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // MOVE SECTION
    if (type === 'SECTION') {
      sectionMove(source.index, destination.index);
      return;
    }

    // MOVE PRODUCT (trong cùng section)
    if (type.startsWith('PRODUCT-')) {
      const sectionIndex = Number(type.replace('PRODUCT-', ''));

      const productFieldArray = methods.getValues(`sections.${sectionIndex}.items`);

      const updated = [...productFieldArray];
      const [moved] = updated.splice(source.index, 1);
      updated.splice(destination.index, 0, moved);

      methods.setValue(`sections.${sectionIndex}.items`, updated);
    }
  };

  const onFormSubmit = (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);

    const payload: CreateWebsiteTemplatePayload = {
      ...data,
      isActive: submitActive ? true : false,
      sections: data.sections.map((s, i) => ({
        id: s.id,
        title: s.title,
        position: i + 1,
        items: s.items.map((si, sii) => ({
          id: si.id,
          productId: si.productId,
          position: sii + 1,
        })),
      })) as SectionType[],
    };

    onSubmit(payload);
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.container}>
        <form
          className='block__container flex flex-col gap-5'
          onSubmit={handleSubmit(onFormSubmit, onError)}
        >
          <section className='flex items-center justify-between'>
            <span className='text-xl text-primary font-bold'>
              {t(`${mode}`)} {t('breadcrumb.website-template')}
            </span>

            <div className='flex items-center justify-center gap-2'>
              {mode === 'edit' && (
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => {
                    handleRedirectDetail(id);
                  }}
                >
                  {t('detail')}
                </Button>
              )}
            </div>
          </section>

          <Divider className='my-0' />

          <section className='w-full grid grid-cols-1 xl:grid-cols-2 gap-5'>
            <Controller
              control={control}
              name='name'
              render={({ field }) => {
                return (
                  <div className='w-full flex flex-col gap-2'>
                    <Label title={t('website_template.name')} required />

                    <Input
                      {...field}
                      disabled={mode === 'detail'}
                      placeholder={t('website_template.name')}
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
              name='logoUrl'
              render={({ field, fieldState }) => {
                return (
                  <div className='w-full flex flex-col gap-2'>
                    <Label title={t('website_template.brand_logo')} required />

                    <UploadFile
                      {...field}
                      disabled={mode === 'detail'}
                      error={fieldState.error ? true : false}
                    />

                    {errors.logoUrl && (
                      <Text type='danger' style={{ fontSize: 12 }}>
                        {errors.logoUrl.message}
                      </Text>
                    )}
                  </div>
                );
              }}
            />

            <Controller
              control={control}
              name='primaryColor'
              render={({ field }) => {
                return (
                  <div className='w-full flex flex-col gap-2'>
                    <Label title={t('website_template.brand_color')} required />

                    <ColorPicker {...field} disabled={mode === 'detail'} />

                    {errors.primaryColor && (
                      <Text type='danger' style={{ fontSize: 12 }}>
                        {errors.primaryColor.message}
                      </Text>
                    )}
                  </div>
                );
              }}
            />
          </section>

          <Divider className='my-0' />

          <DragDropContext onDragEnd={handleDragEnd}>
            <SectionList
              sectionFieldArray={sectionFieldArray as unknown as ReturnType<typeof useFieldArray>}
            />
          </DragDropContext>

          {mode !== 'detail' && (
            <section className='flex items-center justify-end gap-2'>
              <Button htmlType='button' onClick={handleBack}>
                {t('back')}
              </Button>

              {/* Save thường */}
              <Button
                htmlType='submit'
                type='default'
                loading={loading}
                onClick={() => setSubmitActive(false)}
              >
                {t('save')}
              </Button>

              {/* Save & Active */}
              <Button
                htmlType='submit'
                type='primary'
                loading={loading}
                icon={<LuSend />}
                onClick={() => setSubmitActive(true)}
              >
                {t('save_and_apply')}
              </Button>
            </section>
          )}
        </form>

        <PreviewForm primaryColor={primaryColor} logoUrl={logoUrl} />
      </div>
    </FormProvider>
  );
};

export default WebsiteTemplateForm;
