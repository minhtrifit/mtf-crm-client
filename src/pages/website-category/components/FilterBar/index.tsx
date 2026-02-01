import { FormEvent } from 'react';
import { Button, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@ant-design/icons';
import { FilterType } from '../../list';
import Label from '@/components/ui/Label/Label';

interface PropType {
  filter: FilterType;
  handleChangeFilter: (key: string, value: string) => void;
  handleApplyFilter: (e: FormEvent<HTMLFormElement>) => void;
}

const FilterBar = (props: PropType) => {
  const { filter, handleChangeFilter, handleApplyFilter } = props;

  const { t } = useTranslation();

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

        {/* <Button htmlType='submit' color='primary' variant='solid' icon={<SearchOutlined />}>
          {t('search')}
        </Button> */}
      </form>
    </section>
  );
};

export default FilterBar;
