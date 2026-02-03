import { Input, Button, Typography, Popconfirm, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ProductList } from '../ProductList';
import Label from '@/components/ui/Label/Label';
import { GoPlusCircle } from 'react-icons/go';
import { MdDragIndicator } from 'react-icons/md';

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
        className='mr-auto'
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
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      <Droppable droppableId='sections' type='SECTION'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided) => {
                  const style = provided.draggableProps.style;

                  let transform = style?.transform;
                  if (transform) {
                    const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                    if (match) {
                      transform = `translate(0px, ${match[2]})`;
                    }
                  }

                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...style,
                        transform,
                      }}
                      className='px-2 py-3 mb-2 flex gap-3 bg-[#FFF] border-[1px] border-solid border-zinc-100 shadow-md'
                    >
                      {/* DRAG HANDLE */}
                      <div
                        {...provided.dragHandleProps}
                        className='cursor-move bg-gray-100 rounded-sm flex items-center justify-center'
                      >
                        <MdDragIndicator size={20} />
                      </div>

                      {/* <Controller
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
                      /> */}

                      <div className='w-full flex flex-col gap-1'>
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

                        <ProductList sectionIndex={index} />
                      </div>
                    </div>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
