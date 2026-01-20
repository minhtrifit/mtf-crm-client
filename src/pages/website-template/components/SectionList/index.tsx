import { Input, Button, Typography, Popconfirm, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ProductList } from '../ProductList';
import Label from '@/components/ui/Label/Label';
import { GoPlusCircle } from 'react-icons/go';
import { MdDragHandle } from 'react-icons/md';

const { Text } = Typography;

interface Props {
  sectionFieldArray: ReturnType<typeof useFieldArray>;
}

export const SectionList = ({ sectionFieldArray }: Props) => {
  const { control } = useFormContext();

  const { t } = useTranslation();

  const { fields, append, remove } = sectionFieldArray;

  return (
    <div className='flex flex-col gap-5'>
      <Button
        type='primary'
        htmlType='button'
        icon={<GoPlusCircle size={20} />}
        onClick={() =>
          append({
            id: undefined,
            title: '',
            position: fields.length + 1,
            items: [],
          })
        }
      >
        <span>{t('website_template.add_section')}</span>
      </Button>

      {fields.length === 0 && (
        <div className='w-full flex items-center justify-center'>
          <Empty />
        </div>
      )}

      <Droppable droppableId='sections' type='SECTION'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='p-3 mb-2 flex flex-col gap-5 bg-[#FFF]
                                border-[1px] border-solid border-zinc-100 shadow-md'
                  >
                    {/* DRAG HANDLE */}
                    <div
                      {...provided.dragHandleProps}
                      className='cursor-move bg-gray-200 rounded-md flex items-center justify-center py-1'
                    >
                      <MdDragHandle size={20} />
                    </div>

                    <Controller
                      control={control}
                      name={`sections.${index}.title`}
                      render={({ field, fieldState }) => {
                        return (
                          <div className='w-full flex flex-col gap-2'>
                            <Label title={t('website_template.section_name')} required />

                            <Input
                              {...field}
                              placeholder={t('website_template.section_name')}
                              status={fieldState.error ? 'error' : ''}
                            />

                            {fieldState.error && (
                              <Text type='danger' style={{ fontSize: 12 }}>
                                {fieldState.error.message}
                              </Text>
                            )}
                          </div>
                        );
                      }}
                    />

                    <div className='max-w-[calc(100vw-400px)] xl:max-w-[calc(100vw-850px)]'>
                      <ProductList sectionIndex={index} />
                    </div>

                    <Popconfirm
                      title={t('confirm')}
                      description={t('website_template.remove_section_confirm')}
                      onConfirm={() => remove(index)}
                      okText={t('yes')}
                      cancelText={t('cancel')}
                    >
                      <Button danger type='primary' htmlType='button' className='ml-auto'>
                        {t('website_template.remove_section')}
                      </Button>
                    </Popconfirm>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
