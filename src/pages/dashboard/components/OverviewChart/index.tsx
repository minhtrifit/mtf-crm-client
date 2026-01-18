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
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatNumber } from '@/+core/helpers';

const OverviewChart = () => {
  const { t } = useTranslation();

  const data = [
    { month: '1', orders: 5000, users: 2050, revenue: 3000 },
    { month: '2', orders: 3000, users: 430, revenue: 5050 },
    { month: '3', orders: 4000, users: 610, revenue: 1650 },
    { month: '4', orders: 3000, users: 5030, revenue: 4050 },
    { month: '5', orders: 2000, users: 840, revenue: 2550 },
    { month: '6', orders: 500, users: 890, revenue: 2950 },
    { month: '7', orders: 4000, users: 860, revenue: 4750 },
    { month: '8', orders: 2000, users: 940, revenue: 3250 },
    { month: '9', orders: 2000, users: 880, revenue: 2850 },
    { month: '10', orders: 3000, users: 980, revenue: 3450 },
    { month: '11', orders: 2000, users: 1000, revenue: 3700 },
    { month: '12', orders: 5000, users: 2130, revenue: 4450 },
  ];

  const items = [
    { value: 300, label: t('product.default'), format: formatNumber },
    { value: 15000, label: t('order.default'), format: formatNumber },
    { value: 10500000000, label: t('revenue'), format: formatCurrency },
    { value: 1200, label: t('user.default'), format: formatNumber },
  ];

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
      <h3 className='text-[16px] text-[#495057]'>{t('overview')}</h3>

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
          <ComposedChart data={data} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid stroke='#f5f5f5' />

            <XAxis
              dataKey='month'
              tickFormatter={(value) => t(`month.${value}`)}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />

            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip labelFormatter={(label) => t(`month.${label}`)} />

            <Legend content={<RenderLegend />} />

            <Bar dataKey='orders' barSize={18} fill='#405189' name={t('order.default')} />
            <Bar dataKey='users' barSize={18} fill='#0ab39c' name={t('user.default')} />
            <Area
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
