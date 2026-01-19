import { Input, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ProductList } from '../ProductList';
import Label from '@/components/ui/Label/Label';

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
        type='dashed'
        htmlType='button'
        onClick={() =>
          append({
            id: undefined,
            title: '',
            position: fields.length + 1,
            items: [],
          })
        }
      >
        + Add section
      </Button>

      <Droppable droppableId='sections' type='SECTION'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='border p-3 mb-2 flex flex-col gap-5 bg-[#FFF] shadow-md'
                  >
                    {/* DRAG HANDLE */}
                    <div
                      {...provided.dragHandleProps}
                      className='cursor-move text-sm text-gray-600'
                    >
                      ☰
                    </div>

                    <Controller
                      control={control}
                      name={`sections.${index}.title`}
                      render={({ field, fieldState }) => {
                        return (
                          <div className='w-full flex flex-col gap-2'>
                            <Label title={t('website_template.name')} required />

                            <Input
                              {...field}
                              placeholder={t('website_template.name')}
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

                    <div className='max-w-[1100px]'>
                      <ProductList sectionIndex={index} />
                    </div>

                    <Button danger htmlType='button' onClick={() => remove(index)}>
                      Remove
                    </Button>
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
