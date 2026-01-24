import { useMemo } from 'react';
import { get } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, Select } from 'antd';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCompactNumber, formatNumber } from '@/+core/helpers';
import { quarterData, yearData } from '../../mock';
import {
  OvertQuarterChartType,
  OvertYearChartType,
  OverviewTotalType,
  ViewType,
} from '@/types/stats';
import { useTranslation } from 'react-i18next';
import { OverviewFilterType } from '../../pages/DashboardPage';

interface PropType {
  overviewStats: OverviewTotalType | null;
  chartData: OvertYearChartType | OvertQuarterChartType | null;
  filter: OverviewFilterType;
  handleChangeFilter: (name: 'type' | 'year', value: ViewType | number) => void;
}

const OverviewChart = (props: PropType) => {
  const { overviewStats, chartData, filter, handleChangeFilter } = props;

  const { t } = useTranslation();

  // Total Stats
  const items = [
    {
      value: get(overviewStats, 'total_products', 0),
      label: t('product.default'),
      format: formatNumber,
    },
    {
      value: get(overviewStats, 'total_orders', 0),
      label: t('order.default'),
      format: formatNumber,
    },
    {
      value: get(overviewStats, 'total_revenue', 0),
      label: t('revenue'),
      format: formatCompactNumber,
    },
    { value: get(overviewStats, 'total_users', 0), label: t('user.default'), format: formatNumber },
  ];

  const chartConfig = useMemo(() => {
    if (!chartData) {
      return {
        year: {
          data: [],
          xKey: 'month',
          formatLabel: (v: string) => t(`month.${v}`),
        },
        quarter: {
          data: [],
          xKey: 'label',
          formatLabel: (v: string) => v,
        },
      };
    }

    return {
      year: {
        data: chartData,
        // data: yearData,
        xKey: 'month',
        formatLabel: (v: string) => t(`month.${v}`),
      },
      quarter: {
        data: chartData,
        // data: quarterData
        xKey: 'label',
        formatLabel: (v: string) => v,
      },
    };
  }, [chartData]);

  const { data, formatLabel, xKey } = chartConfig[filter.type];

  const RenderLegend = ({ payload }: any) => {
    return (
      <div className='flex items-center justify-center gap-6 text-sm text-gray-500'>
        {payload.map((item: any) => (
          <div key={item.value} className='flex items-center gap-2'>
            <span
              className='rounded-full'
              style={{
                width: 10,
                height: 10,
                backgroundColor: item.color,
              }}
            />
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='block__container flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-[16px] text-[#495057] whitespace-nowrap'>{t('overview')}</h3>

        <div className='w-full flex items-center justify-end gap-3'>
          <DatePicker
            picker='year'
            allowClear={false}
            value={dayjs(filter.year.toString(), 'YYYY')}
            onChange={(value: Dayjs) => {
              const year = value?.year();
              handleChangeFilter('year', year as number);
            }}
          />

          <Select
            value={filter.type}
            onChange={(value: string) => handleChangeFilter('type', value as ViewType)}
            className='w-[130px]'
            options={[
              { value: ViewType.YEAR, label: t('year') },
              { value: ViewType.QUARTER, label: t('quarter') },
            ]}
          />
        </div>
      </div>

      <div
        className='w-full h-[70px] bg-[#f9fbfc] grid grid-cols-4
             border border-dashed border-zinc-200'
      >
        {items.map((item, index) => {
          const borderClass =
            index === 1
              ? 'border-l-[1px] border-r-[0] border-y-[0] border-dashed border-zinc-200'
              : index === 2
              ? 'border-x-[1px] border-y-[0] border-dashed border-zinc-200'
              : '';

          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-2 ${borderClass}`}
            >
              <span className='text-[#495057] text-[1rem] font-bold'>
                {item.format(item.value)}
              </span>
              <span className='text-zinc-700 text-[0.8rem]'>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className='w-full h-[350px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart data={data as any} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid stroke='#f5f5f5' />

            <Tooltip
              labelFormatter={(label) => (filter.type === 'year' ? t(`month.${label}`) : label)}
            />

            <Legend content={<RenderLegend />} />

            <XAxis
              dataKey={xKey}
              tickFormatter={(value) => formatLabel(value)}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />

            <YAxis
              yAxisId='left'
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <YAxis
              yAxisId='right'
              orientation='right'
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
              tickFormatter={(v) => formatCompactNumber(v)}
            />

            <Bar
              yAxisId='left'
              dataKey='orders'
              barSize={18}
              fill='#405189'
              name={t('order.default')}
            />
            <Bar
              yAxisId='left'
              dataKey='users'
              barSize={18}
              fill='#0ab39c'
              name={t('user.default')}
            />
            <Area
              yAxisId='right'
              type='monotone'
              dataKey='revenue'
              fill='#fef8ed'
              stroke='#f7b84b'
              name={t('revenue')}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;
