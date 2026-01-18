import { FormEvent } from 'react';
import { Button, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import { FilterType } from '@/pages/category/pages/list';
import Label from '@/components/ui/Label/Label';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface PropType {
  filter: FilterType;
  handleChangeFilter: (key: string, value: string) => void;
  handleApplyFilter: (e: FormEvent<HTMLFormElement>) => void;
}

const FilterBar = (props: PropType) => {
  const { filter, handleChangeFilter, handleApplyFilter } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const isActiveOption = [
    { value: 'true', label: t('active') },
    { value: 'false', label: t('inactive') },
  ];

  return (
    <section className='block__container w-full flex flex-wrap items-end justify-between gap-3'>
      <form
        onSubmit={(e) => {
          handleApplyFilter(e);
        }}
        className='flex flex-wrap items-end gap-3'
      >
        <div className='flex flex-col gap-3'>
          <Label title={t('website_template.name')} />
          <Input
            style={{ width: 300 }}
            placeholder={t('website_template.name_placeholder')}
            allowClear
            value={filter.q}
            onChange={(e) => {
              handleChangeFilter('q', e.target.value);
            }}
          />
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
          navigate(ADMIN_ROUTE.WEBSITE_TEMPLATE_ADD);
        }}
      >
        {t('add')}
      </Button>
    </section>
  );
};

export default FilterBar;
