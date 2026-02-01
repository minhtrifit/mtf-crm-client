import { FormEvent, useMemo } from 'react';
import { get } from 'lodash';
import { Avatar, Button, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useGetShowcaseCategory } from '@/pages/home/hooks/useGetShowcaseCategory';
import { SearchOutlined } from '@ant-design/icons';
import { FilterType } from '../../list';
import Label from '@/components/ui/Label/Label';
import { MdCategory } from 'react-icons/md';

const { Option } = Select;

interface PropType {
  filter: FilterType;
  handleChangeFilter: (key: string, value: string) => void;
  handleApplyFilter: (e: FormEvent<HTMLFormElement>) => void;
}

const FilterBar = (props: PropType) => {
  const { filter, handleChangeFilter, handleApplyFilter } = props;

  const { t } = useTranslation();

  const { data: categories, loading: categoriesLoading } = useGetShowcaseCategory();

  const categoryOptions = useMemo(() => {
    if (!categories) return [];

    return categories?.map((c) => {
      return {
        value: c.slug,
        label: c.name,
        image: c.imageUrl,
      };
    });
  }, [categories]);

  return (
    <section className='block__container w-full flex flex-col gap-5 border border-solid border-zinc-100'>
      <h3 className='text-[1rem]'>{t('all_products')}</h3>

      <form
        onSubmit={(e) => {
          handleApplyFilter(e);
        }}
        className='flex flex-wrap items-end gap-3'
      >
        <div className='flex flex-col gap-3'>
          <span className='text-[0.85em] text-zinc-500'>{t('product.name')}</span>
          <Input
            style={{ width: 300 }}
            placeholder={t('product.showcase_name_placeholder')}
            allowClear
            value={filter.q}
            onChange={(e) => {
              handleChangeFilter('q', e.target.value);
            }}
          />
        </div>

        <div className='flex flex-col gap-3'>
          <span className='text-[0.85em] text-zinc-500'>{t('category.default')}</span>
          <Select
            style={{ width: 280 }}
            disabled={categoriesLoading}
            placeholder={t('category.default')}
            showSearch
            allowClear
            optionFilterProp='label'
            filterOption={(input, option) => {
              const label = option?.label;

              if (typeof label !== 'string') return false;

              return label.toLowerCase().includes(input.toLowerCase());
            }}
            value={filter.categorySlug !== '' ? filter.categorySlug : null}
            onChange={(value) => {
              handleChangeFilter('categorySlug', value);
            }}
          >
            {categoryOptions?.map((co) => {
              return (
                <Option
                  key={`co-${get(co, 'value', '')}`}
                  value={get(co, 'value', '')}
                  label={get(co, 'label', '')}
                >
                  <div className='flex items-center gap-3'>
                    <Avatar size={30} src={get(co, 'image', '')} icon={<MdCategory />} />

                    <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                      {get(co, 'label', '')}
                    </span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </div>

        {/* <Button htmlType='submit' color='primary' variant='solid' icon={<SearchOutlined />}>
          {t('search')}
        </Button> */}
      </form>
    </section>
  );
};

export default FilterBar;
