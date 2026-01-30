import { FormEvent, useMemo } from 'react';
import { get } from 'lodash';
import { Avatar, Button, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetAll } from '@/pages/product/hooks/useAll';
import { ADMIN_ROUTE } from '@/routes/route.constant';
import { FilterType } from '../../page/list';
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

  const ratingOptions = [
    { value: '5', label: t('rate.five_star') },
    { value: '4', label: t('rate.four_star') },
    { value: '3', label: t('rate.three_star') },
    { value: '2', label: t('rate.two_star') },
    { value: '1', label: t('rate.one_star') },
  ];

  const { data: products, loading: productsLoading } = useGetAll();

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
    <section className='block__container w-full flex flex-wrap items-end justify-between gap-3'>
      <form
        onSubmit={(e) => {
          handleApplyFilter(e);
        }}
        className='flex flex-wrap items-end gap-3'
      >
        <div className='flex flex-col gap-3'>
          <Label title={t('review.default')} />
          <Input
            style={{ width: 350 }}
            placeholder={t('review.name_placeholder')}
            allowClear
            value={filter.q}
            onChange={(e) => {
              handleChangeFilter('q', e.target.value);
            }}
          />
        </div>

        <div className='flex flex-col gap-3'>
          <Label title={t('product.default')} />
          <Select
            style={{ width: 300 }}
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
            value={filter.productId !== '' ? filter.productId : null}
            onChange={(value) => {
              handleChangeFilter('productId', value);
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

        <div className='flex flex-col gap-3'>
          <Label title={t('review.default')} />
          <Select
            style={{ width: 180 }}
            placeholder={t('review.default')}
            allowClear
            options={ratingOptions}
            optionFilterProp='label'
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={filter.rate !== '' ? filter.rate : null}
            onChange={(value) => {
              handleChangeFilter('rate', value);
            }}
          />
        </div>

        <Button htmlType='submit' color='primary' variant='solid' icon={<SearchOutlined />}>
          {t('search')}
        </Button>
      </form>

      {/* <Button
        htmlType='button'
        color='primary'
        variant='solid'
        icon={<PlusOutlined />}
        onClick={() => {
          navigate(ADMIN_ROUTE.REVIEW_ADD);
        }}
      >
        {t('add')}
      </Button> */}
    </section>
  );
};

export default FilterBar;
