import { useMemo, useState } from 'react';
import { Avatar, Button, Select, Typography } from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useGetAll } from '@/pages/product/hooks/useAll';
import { Product } from '@/types/product';
import Label from '@/components/ui/Label/Label';
import { MdCategory } from 'react-icons/md';
import { formatCurrency } from '@/+core/helpers';

const { Option } = Select;
const { Text } = Typography;

interface Props {
  sectionIndex: number;
}

export const ProductList = ({ sectionIndex }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error: any = errors.sections ?? null;

  const { t } = useTranslation();

  const { data: products, loading: productsLoading } = useGetAll();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.items`,
  });

  const handleAddProduct = () => {
    append({
      id: undefined,
      productId: selectedProduct?.id,
      product: selectedProduct,
      position: fields.length + 1,
    });

    setSelectedProduct(null);
  };

  const productOptions = useMemo(() => {
    if (!products) return [];

    return products?.map((c) => {
      return {
        value: c.id,
        label: c.name,
        image: c.imagesUrl[0],
      };
    });
  }, [products]);

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-wrap items-end gap-3'>
        <div className='flex flex-col gap-3'>
          <Label title={t('product.default')} />
          <Select
            style={{ width: 280 }}
            disabled={productsLoading}
            placeholder={t('product.default')}
            showSearch
            allowClear
            optionFilterProp='label'
            filterOption={(input, option) => {
              const label = option?.label;

              if (typeof label !== 'string') return false;

              return label.toLowerCase().includes(input.toLowerCase());
            }}
            value={selectedProduct?.id !== '' ? selectedProduct?.id : null}
            onChange={(value) => {
              const product = products?.find((p) => p?.id === value);

              setSelectedProduct(product as Product);
            }}
          >
            {productOptions?.map((po) => {
              return (
                <Option
                  key={`co-${get(po, 'value', '')}`}
                  value={get(po, 'value', '')}
                  label={get(po, 'label', '')}
                >
                  <div className='flex items-center gap-3'>
                    <Avatar size={30} src={get(po, 'image', '')} icon={<MdCategory />} />

                    <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                      {get(po, 'label', '')}
                    </span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </div>

        <Button
          type='dashed'
          htmlType='button'
          disabled={!selectedProduct}
          onClick={handleAddProduct}
        >
          + Add product
        </Button>
      </div>

      <Droppable
        droppableId={`products-${sectionIndex}`}
        type={`PRODUCT-${sectionIndex}`}
        direction='horizontal'
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='flex gap-3 overflow-x-auto pb-2'
          >
            {fields.map((field, productIndex) => (
              <Draggable key={field.id} draggableId={field.id} index={productIndex}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='w-[300px] min-w-[300px] bg-gray-50 border rounded p-2 flex flex-col gap-2'
                  >
                    {/* DRAG HANDLE */}
                    <div
                      {...provided.dragHandleProps}
                      className='cursor-move text-xs text-gray-600'
                    >
                      ☰
                    </div>

                    <div className='flex gap-3'>
                      <Avatar
                        size={100}
                        shape='square'
                        src={get(field, 'product.imagesUrl[0]', '')}
                        icon={<MdCategory />}
                      />

                      <div className='flex flex-col gap-3'>
                        <span className='text-[0.8rem] text-zinc-700'>
                          {get(field, 'product.name', '')}
                        </span>
                        <span className='text-[0.8rem] text-zinc-700 font-semibold'>
                          {formatCurrency(get(field, 'product.price', 0))}
                        </span>
                      </div>
                    </div>

                    <Button
                      size='small'
                      danger
                      htmlType='button'
                      onClick={() => remove(productIndex)}
                    >
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

      {error && error[sectionIndex] && (
        <Text type='danger' style={{ fontSize: 12 }}>
          {error[sectionIndex]?.items?.message}
        </Text>
      )}
    </div>
  );
};
