import { FormEvent, useState } from 'react';
import { get } from 'lodash';
import dayjs from 'dayjs';
import { Button, DatePicker, Drawer, Input, InputNumber, Select, Space, Tooltip } from 'antd';
import { PaymentFilterType } from '@/types/payment';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '@/hooks/useQueryParams';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Label from '@/components/ui/Label/Label';
import { PaymentMethod } from '@/+core/constants/commons.constant';
import { FaFilter, FaTrash, FaTruck } from 'react-icons/fa';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface PropType {
  filter: PaymentFilterType;
  handleChangeFilter: (key: string, value: string | number) => void;
  handleApplyFilter: (e: FormEvent<HTMLFormElement>) => void;
  isShowOrderCode?: boolean;
  advancedMod?: boolean;
  handleClearAdvanceFilter?: () => void;
  isAddNew?: boolean;
  handleOpenModal?: () => void;
}

const FilterBar = (props: PropType) => {
  const {
    filter,
    handleChangeFilter,
    handleApplyFilter,
    isShowOrderCode,
    advancedMod,
    handleClearAdvanceFilter,
    isAddNew,
    handleOpenModal,
  } = props;

  const { searchParams, updateParams } = useQueryParams();

  const is_filter_advance = searchParams.get('is_filter_advance') ?? '';

  const { t } = useTranslation();

  const [openFilterDrawer, setOpenFilterDrawer] = useState<boolean>(false);

  const PAYMENT_OPTIONS = [
    {
      value: PaymentMethod.COD,
      label: t('payment.cod'),
      icon: <FaTruck size={20} />,
    },
    {
      value: PaymentMethod.VNPAY,
      label: t('payment.vnpay'),
      icon: <img className='w-[20px]' src='/assets/icons/icon-vnpay.png' alt='vnpay-icon' />,
    },
  ];

  return (
    <section className='w-full flex flex-wrap items-end justify-between gap-3'>
      <Drawer
        title={t('advance_filter')}
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => setOpenFilterDrawer(false)}
        open={openFilterDrawer}
        footer={
          <div className='w-full flex items-center gap-3'>
            <Button
              className='w-full'
              icon={<FaTrash />}
              onClick={() => {
                if (handleClearAdvanceFilter) handleClearAdvanceFilter();
                setOpenFilterDrawer(false);
              }}
            >
              {t('clear_filter')}
            </Button>

            <Button
              form='order-advance-filter-form'
              className='w-full'
              htmlType='submit'
              color='primary'
              variant='solid'
              icon={<SearchOutlined />}
            >
              {t('apply')}
            </Button>
          </div>
        }
      >
        <form
          id='order-advance-filter-form'
          onSubmit={(e) => {
            handleApplyFilter(e);
            setOpenFilterDrawer(false);
            updateParams({ is_filter_advance: 'true' });
          }}
          className='flex flex-col gap-5'
        >
          <div className='flex flex-col gap-3'>
            <Label title={t('payment.method')} />
            <Select
              style={{ width: 300 }}
              placeholder={t('payment.method')}
              showSearch
              allowClear
              optionFilterProp='label'
              filterOption={(input, option) => {
                const label = option?.label;

                if (typeof label !== 'string') return false;

                return label.toLowerCase().includes(input.toLowerCase());
              }}
              value={filter.method ? filter.method : null}
              onChange={(value) => {
                handleChangeFilter('method', value);
              }}
            >
              {PAYMENT_OPTIONS.map((item) => {
                return (
                  <Option
                    key={`item-${get(item, 'value', '')}`}
                    value={get(item, 'value', '')}
                    label={get(item, 'label', '')}
                  >
                    <div className='flex items-center gap-3'>
                      {get(item, 'icon', null)}

                      <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                        {get(item, 'label', '')}
                      </span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('amount')} />
            <Space.Compact className='w-[320px]'>
              <InputNumber
                style={{ width: '45%' }}
                min={0}
                placeholder={t('from')}
                value={filter.fromAmount}
                onChange={(value) => {
                  handleChangeFilter('fromAmount', value as number);
                }}
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                }
                parser={(value) => (value ? Number(value.replace(/\./g, '')) : null) as number}
              />
              <Input style={{ width: '10%', textAlign: 'center' }} placeholder='~' disabled />
              <InputNumber
                style={{ width: '45%' }}
                min={filter.fromAmount ?? 0}
                placeholder={t('to')}
                value={filter.toAmount}
                onChange={(value) => {
                  handleChangeFilter('toAmount', value as number);
                }}
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                }
                parser={(value) => (value ? Number(value.replace(/\./g, '')) : null) as number}
              />
            </Space.Compact>
          </div>

          <div className='flex flex-col gap-3'>
            <Label title={t('paid_date')} />

            <RangePicker
              allowClear
              format='YYYY-MM-DD'
              placeholder={[t('from_date'), t('to_date')]}
              value={
                filter.fromPaidTime && filter.toPaidTime
                  ? [
                      dayjs(filter.fromPaidTime, 'YYYY-MM-DD'),
                      dayjs(filter.toPaidTime, 'YYYY-MM-DD'),
                    ]
                  : null
              }
              onChange={(values) => {
                if (!values) {
                  handleChangeFilter('fromPaidTime', '');
                  handleChangeFilter('toPaidTime', '');
                  return;
                }

                handleChangeFilter('fromPaidTime', values[0]?.format('YYYY-MM-DD') || '');
                handleChangeFilter('toPaidTime', values[1]?.format('YYYY-MM-DD') || '');
              }}
            />
          </div>
        </form>
      </Drawer>

      <form
        onSubmit={(e) => {
          handleApplyFilter(e);
        }}
        className='flex flex-wrap items-end gap-3'
      >
        {isShowOrderCode && (
          <div className='flex flex-col gap-3'>
            <Label title={t('order.code')} />
            <Input
              style={{ width: 280 }}
              placeholder={t('order.placeholder')}
              allowClear
              value={filter.q}
              onChange={(e) => {
                handleChangeFilter('q', e.target.value);
              }}
            />
          </div>
        )}

        {advancedMod && is_filter_advance === 'true' && (
          <Button danger icon={<FaTrash />} onClick={handleClearAdvanceFilter}>
            {t('clear_advance_filter')}
          </Button>
        )}

        {advancedMod && (
          <Tooltip title={t('advance_filter')}>
            <Button icon={<FaFilter />} onClick={() => setOpenFilterDrawer(true)} />
          </Tooltip>
        )}

        {!advancedMod && (
          <>
            <div className='flex flex-col gap-3'>
              <Label title={t('payment.method')} />
              <Select
                style={{ width: 300 }}
                placeholder={t('payment.method')}
                showSearch
                allowClear
                optionFilterProp='label'
                filterOption={(input, option) => {
                  const label = option?.label;

                  if (typeof label !== 'string') return false;

                  return label.toLowerCase().includes(input.toLowerCase());
                }}
                value={filter.method ? filter.method : null}
                onChange={(value) => {
                  handleChangeFilter('method', value);
                }}
              >
                {PAYMENT_OPTIONS.map((item) => {
                  return (
                    <Option
                      key={`item-${get(item, 'value', '')}`}
                      value={get(item, 'value', '')}
                      label={get(item, 'label', '')}
                    >
                      <div className='flex items-center gap-3'>
                        {get(item, 'icon', null)}

                        <span className='max-w-[180px] truncate text-[0.85rem] text-zinc-700'>
                          {get(item, 'label', '')}
                        </span>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </div>

            <div className='flex flex-col gap-3'>
              <Label title={t('amount')} />
              <Space.Compact className='w-[320px]'>
                <InputNumber
                  style={{ width: '45%' }}
                  min={0}
                  placeholder={t('from')}
                  value={filter.fromAmount}
                  onChange={(value) => {
                    handleChangeFilter('fromAmount', value as number);
                  }}
                  formatter={(value) =>
                    value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                  }
                  parser={(value) => (value ? Number(value.replace(/\./g, '')) : null) as number}
                />
                <Input style={{ width: '10%', textAlign: 'center' }} placeholder='~' disabled />
                <InputNumber
                  style={{ width: '45%' }}
                  min={filter.fromAmount ?? 0}
                  placeholder={t('to')}
                  value={filter.toAmount}
                  onChange={(value) => {
                    handleChangeFilter('toAmount', value as number);
                  }}
                  formatter={(value) =>
                    value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
                  }
                  parser={(value) => (value ? Number(value.replace(/\./g, '')) : null) as number}
                />
              </Space.Compact>
            </div>

            <div className='flex flex-col gap-3'>
              <Label title={t('paid_date')} />

              <RangePicker
                allowClear
                format='YYYY-MM-DD'
                placeholder={[t('from_date'), t('to_date')]}
                value={
                  filter.fromPaidTime && filter.toPaidTime
                    ? [
                        dayjs(filter.fromPaidTime, 'YYYY-MM-DD'),
                        dayjs(filter.toPaidTime, 'YYYY-MM-DD'),
                      ]
                    : null
                }
                onChange={(values) => {
                  if (!values) {
                    handleChangeFilter('fromPaidTime', '');
                    handleChangeFilter('toPaidTime', '');
                    return;
                  }

                  handleChangeFilter('fromPaidTime', values[0]?.format('YYYY-MM-DD') || '');
                  handleChangeFilter('toPaidTime', values[1]?.format('YYYY-MM-DD') || '');
                }}
              />
            </div>
          </>
        )}

        <Button htmlType='submit' color='primary' variant='solid' icon={<SearchOutlined />}>
          {t('search')}
        </Button>
      </form>

      {isAddNew && handleOpenModal && (
        <Button
          htmlType='button'
          color='primary'
          variant='solid'
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          {t('add')}
        </Button>
      )}
    </section>
  );
};

export default FilterBar;
