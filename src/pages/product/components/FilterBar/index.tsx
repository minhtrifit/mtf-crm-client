import { FormEvent, useMemo } from 'react';
import { get } from 'lodash';
import { Avatar, Button, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetShowcaseCategory } from '@/pages/home/hooks/useGetShowcaseCategory';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import { FilterType } from '../../pages/list';
import Label from '@/components/ui/Label/Label';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { MdCategory } from 'react-icons/md';

const { Option } = Select;

interface PropType {
  filter: FilterType;
  handleChangeFilter: (key: string, value: string) => void;
  handleApplyFilter: (e: FormEvent<HTMLFormElement>) => void;
}

const FilterBar = (props: PropType) => {
  const { filter, handleChangeFilter, handleApplyFilter } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: categories, loading: categoriesLoading } = useGetShowcaseCategory();

  const isActiveOption = [
    { value: 'true', label: t('active') },
    { value: 'false', label: t('inactive') },
  ];

  const categoryOptions = useMemo(() => {
    if (!categories) return [];

    return categories?.map((c) => {
      return {
        value: c.id,
        label: c.name,
        image: c.imageUrl,
      };
    });
  }, [categories]);

  return (
    <section className='block__container w-full flex flex-wrap items-end justify-between gap-3'>
      <form
        onSubmit={(e) => {
          handleApplyFilter(e);
        }}
        className='flex flex-wrap items-end gap-3'
      >
        <div className='flex flex-col gap-3'>
          <Label title={t('product.name')} />
          <Input
            style={{ width: 300 }}
            placeholder={t('product.name_placeholder')}
            allowClear
            value={filter.q}
            onChange={(e) => {
              handleChangeFilter('q', e.target.value);
            }}
          />
        </div>

        <div className='flex flex-col gap-3'>
          <Label title={t('category.default')} />
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
            value={filter.categoryId !== '' ? filter.categoryId : null}
            onChange={(value) => {
              handleChangeFilter('categoryId', value);
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

        <div className='flex flex-col gap-3'>
          <Label title={t('status')} />
          <Select
            style={{ width: 200 }}
            placeholder={t('status')}
            showSearch
            allowClear
            options={isActiveOption}
            optionFilterProp='label'
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={filter.isActive !== '' ? filter.isActive : null}
            onChange={(value) => {
              handleChangeFilter('isActive', value);
            }}
          />
        </div>

        <Button htmlType='submit' color='primary' variant='solid' icon={<SearchOutlined />}>
          {t('search')}
        </Button>
      </form>

      <Button
        htmlType='button'
        color='primary'
        variant='solid'
        icon={<PlusOutlined />}
        onClick={() => {
          navigate(ADMIN_ROUTE.PRODUCT_ADD);
        }}
      >
        {t('add')}
      </Button>
    </section>
  );
};

export default FilterBar;
