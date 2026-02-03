import { useMemo, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm, Controller, useFieldArray, FormProvider, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateWebsiteTemplatePayload,
  SectionType,
  WebsiteTemplate,
} from '@/types/website_template';
import { Button, Collapse, Empty, Input, message, Select, Tabs, Typography } from 'antd';
import { MediaType } from '@/+core/constants/commons.constant';
import Label from '@/components/ui/Label/Label';
import UploadFile, { UploadFileType } from '@/components/ui/UploadFile/UploadFile';
import ColorPicker from '../ColorPicker';
import PreviewForm from '../PreviewForm';
import { SectionList } from '../SectionList';
import { LuSend } from 'react-icons/lu';
import { GoPlusCircle } from 'react-icons/go';
import { FaTrash } from 'react-icons/fa';
import styles from './styles.module.scss';

const mediaValues = Object.values(MediaType);

const { Text } = Typography;
const { Panel } = Collapse;

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
  const { searchParams, updateParams } = useQueryParams();

  const { t } = useTranslation();

  const active_tab = searchParams.get('active_tab') ?? 'general-information';

  const id = params?.id ?? '';

  const MEDIA_OPTIONS = [
    { label: 'Facebook', value: MediaType.FACEBOOK },
    { label: 'Instagram', value: MediaType.INSTAGRAM },
    { label: 'Telegram', value: MediaType.TELEGRAM },
    { label: 'Youtube', value: MediaType.YOUTUBE },
    { label: 'Zalo', value: MediaType.ZALO },
  ];

  const panelActiveKey = useMemo(() => {
    const value = searchParams.get('collapse');

    // Chưa có param → mở hết
    if (value === null) return ['general-information', 'section-information'];

    // Có param nhưng rỗng → đóng hết
    if (value === '') return [];

    return value.split(',');
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<string>(active_tab);
  const [submitActive, setSubmitActive] = useState<boolean>(false);

  const MediaItemSchema = z.object({
    id: z.string().optional(),
    type: z.string().refine((val) => mediaValues.includes(val as MediaType), {
      message: t('invalid_value'),
    }),
    url: z.string().min(1, { message: t('this_field_is_required') }),
  });

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
      .min(1, { message: t('require_at_least_one_product') })
      .default([]),
  });

  const FormSchema = z.object({
    name: z.string().min(1, { message: t('this_field_is_required') }),
    logoUrl: z.string().min(1, { message: t('this_field_is_required') }),
    primaryColor: z.string().min(1, { message: t('this_field_is_required') }),
    bannersUrl: z.array(z.string()),
    email: z.string(),
    phone: z.string(),
    footerDescription: z.string(),

    medias: z.array(MediaItemSchema).default([]),

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
          bannersUrl: defaultValues.bannersUrl,
          email: defaultValues.email ?? '',
          phone: defaultValues.phone ?? '',
          footerDescription: defaultValues.footerDescription ?? '',
          medias: defaultValues.medias,
          sections: defaultValues.sections,
        }
      : {
          name: '',
          logoUrl: '',
          primaryColor: '#e30019',
          bannersUrl: [],
          email: '',
          phone: '',
          footerDescription: '',
          medias: [],
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

  const {
    fields: medias,
    append: appendMedia,
    remove: removeMedia,
  } = useFieldArray({
    control,
    name: 'medias',
  });

  const sectionFieldArray = useFieldArray({
    control,
    name: 'sections',
  });

  const { fields, move: sectionMove } = sectionFieldArray;

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectDetail = (id: string) => {
    // navigate(`/admin/website-template/detail/${id}`);
    window.open(`/admin/website-template/detail/${id}`, '_blank');
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

  const handleChangePanel = (key: string | string[]) => {
    const keys = Array.isArray(key) ? key : [key];
    const params = new URLSearchParams(searchParams.toString());

    params.set('collapse', keys.join(','));

    navigate(`?${params.toString()}`, { replace: true });
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

    if (firstErrorKey === 'sections') {
      updateParams({ active_tab: 'section-information' });
      setActiveTab('section-information');
    }

    setFocus(firstErrorKey as any);

    message.error(t('double_check_information'));
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

              {mode === 'edit' && (
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => {
                    handleRedirectDetail(id);
                  }}
                >
                  {t('website_template.preview')}
                </Button>
              )}
            </div>
          </section>

          <Tabs
            activeKey={activeTab}
            onChange={(value) => {
              setActiveTab(value);
              updateParams({ active_tab: value });
            }}
            items={[
              {
                key: 'general-information',
                label: t('website_template.general_information'),
                children: (
                  <section className='w-full grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-8'>
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

                            <div className={`mr-auto ${field.value && 'bg-zinc-200'}`}>
                              <UploadFile
                                {...field}
                                disabled={mode === 'detail'}
                                error={fieldState.error ? true : false}
                                fileTypes={[UploadFileType.IMAGE]}
                              />
                            </div>

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

                    <Controller
                      control={control}
                      name='bannersUrl'
                      render={({ field, fieldState }) => {
                        return (
                          <div className='w-full flex flex-col gap-2'>
                            <Label title={t('dimension_banner', { width: 1440, height: 600 })} />

                            <UploadFile
                              {...field}
                              mode='multiple'
                              disabled={mode === 'detail'}
                              error={fieldState.error ? true : false}
                              dimension={{ width: 1440, height: 600 }}
                              fileTypes={[UploadFileType.IMAGE]}
                            />

                            {errors.bannersUrl && (
                              <Text type='danger' style={{ fontSize: 12 }}>
                                {errors.bannersUrl.message}
                              </Text>
                            )}
                          </div>
                        );
                      }}
                    />

                    <div className='w-full flex flex-col gap-y-8'>
                      <Controller
                        control={control}
                        name='email'
                        render={({ field }) => {
                          return (
                            <div className='w-full flex flex-col gap-2'>
                              <Label title={t('auth.email')} />

                              <Input
                                {...field}
                                disabled={mode === 'detail'}
                                placeholder={t('auth.email')}
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
                        name='phone'
                        render={({ field }) => {
                          return (
                            <div className='w-full flex flex-col gap-2'>
                              <Label title={t('auth.phone')} />

                              <Input
                                {...field}
                                disabled={mode === 'detail'}
                                placeholder={t('auth.phone')}
                                status={errors.phone ? 'error' : ''}
                              />

                              {errors.phone && (
                                <Text type='danger' style={{ fontSize: 12 }}>
                                  {errors.phone.message}
                                </Text>
                              )}
                            </div>
                          );
                        }}
                      />

                      <Controller
                        control={control}
                        name='footerDescription'
                        render={({ field }) => {
                          return (
                            <div className='w-full flex flex-col gap-2'>
                              <Label title={t('website_template.footer_description')} />

                              <Input
                                {...field}
                                disabled={mode === 'detail'}
                                placeholder={t('website_template.footer_description')}
                                status={errors.footerDescription ? 'error' : ''}
                              />

                              {errors.footerDescription && (
                                <Text type='danger' style={{ fontSize: 12 }}>
                                  {errors.footerDescription.message}
                                </Text>
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>

                    <div className='w-full flex flex-col gap-2'>
                      <Label title={t('website_template.media')} />

                      <div className='w-full flex flex-col gap-5'>
                        <Button
                          type='primary'
                          htmlType='button'
                          className='mr-auto'
                          icon={<GoPlusCircle size={20} />}
                          onClick={() =>
                            appendMedia({
                              type: MediaType.FACEBOOK,
                              url: '',
                            })
                          }
                        >
                          <span>{t('website_template.add_media')}</span>
                        </Button>

                        {medias.length === 0 && (
                          <div className='w-full flex items-center justify-center'>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </div>
                        )}

                        <div className='w-full flex flex-col gap-3'>
                          {medias.map((field, index) => {
                            const typeError = errors?.medias?.[index]?.type as
                              | FieldError
                              | undefined;
                            const urlError = errors?.medias?.[index]?.url as FieldError | undefined;

                            return (
                              <div key={field.id} className='flex flex-col gap-1'>
                                <div className='w-full flex items-start gap-3'>
                                  <Controller
                                    control={control}
                                    name={`medias.${index}.type`}
                                    render={({ field }) => (
                                      <div className='w-40 flex flex-col gap-2'>
                                        <Select
                                          {...field}
                                          disabled={mode === 'detail'}
                                          options={MEDIA_OPTIONS}
                                          status={typeError ? 'error' : ''}
                                        />

                                        {typeError?.message && (
                                          <Text type='danger' style={{ fontSize: 12 }}>
                                            {typeError.message}
                                          </Text>
                                        )}
                                      </div>
                                    )}
                                  />

                                  <Controller
                                    control={control}
                                    name={`medias.${index}.url`}
                                    render={({ field }) => (
                                      <div className='flex-1 flex flex-col gap-2'>
                                        <Input
                                          {...field}
                                          disabled={mode === 'detail'}
                                          placeholder='https://...'
                                          status={urlError ? 'error' : ''}
                                        />

                                        {urlError?.message && (
                                          <Text type='danger' style={{ fontSize: 12 }}>
                                            {urlError.message}
                                          </Text>
                                        )}
                                      </div>
                                    )}
                                  />

                                  {/* REMOVE */}
                                  {mode !== 'detail' && (
                                    <Button danger onClick={() => removeMedia(index)}>
                                      <FaTrash />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>
                ),
              },
              {
                key: 'section-information',
                label: `${t('website_template.section_content')} ${
                  fields?.length !== 0 ? `(${fields?.length})` : ''
                }`,
                children: (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <SectionList
                      sectionFieldArray={
                        sectionFieldArray as unknown as ReturnType<typeof useFieldArray>
                      }
                    />
                  </DragDropContext>
                ),
              },
            ]}
          />

          {/* <Collapse activeKey={panelActiveKey} onChange={handleChangePanel}>
            <Panel header={t('website_template.general_information')} key='general-information'>
              content
            </Panel>

            <Panel
              header={`${t('website_template.section_content')} ${
                fields?.length !== 0 ? `(${fields?.length})` : ''
              }`}
              key='section-information'
            >
              content
            </Panel>
          </Collapse> */}
        </form>

        {/* <div className='hidden xl:block sticky top-[100px] self-start'>
          <PreviewForm primaryColor={primaryColor} logoUrl={logoUrl} />
        </div> */}
      </div>
    </FormProvider>
  );
};

export default WebsiteTemplateForm;
