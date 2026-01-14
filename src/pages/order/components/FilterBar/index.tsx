import { FormEvent } from 'react';
import { get } from 'lodash';
import { Button, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { FilterType } from '../../pages/list';
import { SearchOutlined } from '@ant-design/icons';
import Label from '@/components/ui/Label/Label';
import { DeliveryStatus, OrderStatus } from '@/+core/constants/commons.constant';
import { MdCancel, MdOutlineBookmarkAdded, MdPaid, MdPending } from 'react-icons/md';
import { FaRegCheckCircle, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';

const { Option } = Select;

interface PropType {
  filter: FilterType;
  handleChangeFilter: (key: string, value: string) => void;
  handleApplyFilter: (e: FormEvent<HTMLFormElement>) => void;
}

const FilterBar = (props: PropType) => {
  const { filter, handleChangeFilter, handleApplyFilter } = props;

  const { t } = useTranslation();

  const STATUS_OPTIONS = [
    {
      value: OrderStatus.PAID,
      label: t('order.paid'),
      icon: <MdPaid size={20} className='text-green-500' />,
    },
    {
      value: OrderStatus.PENDING,
      label: t('order.pending'),
      icon: <MdPending size={20} className='text-yellow-500' />,
    },
    {
      value: OrderStatus.CANCELLED,
      label: t('order.cancelled'),
      icon: <MdCancel size={20} className='text-red-500' />,
    },
  ];

  const DELIVERY_STATUS_OPTIONS = [
    {
      value: DeliveryStatus.ORDERED,
      label: t('delivery.ordered'),
      icon: <FaRegCreditCard size={20} />,
    },
    {
      value: DeliveryStatus.CONFIRMED,
      label: t('delivery.confirm'),
      icon: <MdOutlineBookmarkAdded size={20} />,
    },
    {
      value: DeliveryStatus.PREPARING,
      label: t('delivery.preparing'),
      icon: <PiPackageBold size={20} />,
    },
    {
      value: DeliveryStatus.SHIPPING,
      label: t('delivery.shipping'),
      icon: <FaTruck size={20} />,
    },
    {
      value: DeliveryStatus.DELIVERED,
      label: t('delivery.delivered'),
      icon: <FaRegCheckCircle size={20} />,
    },
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

        <div className='flex flex-col gap-3'>
          <Label title={`${t('user.default')} / ${t('customer.default')}`} />
          <Input
            style={{ width: 280 }}
            placeholder={t('order.user_placeholder')}
            allowClear
            value={filter.buyerQ}
            onChange={(e) => {
              handleChangeFilter('buyerQ', e.target.value);
            }}
          />
        </div>

        <div className='flex flex-col gap-3'>
          <Label title={t('status')} />
          <Select
            style={{ width: 230 }}
            placeholder={t('status')}
            showSearch
            allowClear
            optionFilterProp='label'
            filterOption={(input, option) => {
              const label = option?.label;

              if (typeof label !== 'string') return false;

              return label.toLowerCase().includes(input.toLowerCase());
            }}
            value={filter.status ? filter.status : null}
            onChange={(value) => {
              handleChangeFilter('status', value);
            }}
          >
            {STATUS_OPTIONS.map((item) => {
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
          <Label title={t('delivery_status')} />
          <Select
            style={{ width: 230 }}
            placeholder={t('delivery_status')}
            showSearch
            allowClear
            optionFilterProp='label'
            filterOption={(input, option) => {
              const label = option?.label;

              if (typeof label !== 'string') return false;

              return label.toLowerCase().includes(input.toLowerCase());
            }}
            value={filter.deliveryStatus ? filter.deliveryStatus : null}
            onChange={(value) => {
              handleChangeFilter('deliveryStatus', value);
            }}
          >
            {DELIVERY_STATUS_OPTIONS.map((item) => {
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

        <Button htmlType='submit' color='primary' variant='solid' icon={<SearchOutlined />}>
          {t('search')}
        </Button>
      </form>
    </section>
  );
};

export default FilterBar;
