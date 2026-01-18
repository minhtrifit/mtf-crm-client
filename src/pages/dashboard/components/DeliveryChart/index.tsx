import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { MdOutlineBookmarkAdded } from 'react-icons/md';
import { FaRegCheckCircle, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';
import { get } from 'lodash';

const DeliveryChart = () => {
  const { t } = useTranslation();

  const data = [
    { name: t('delivery.ordered'), value: 400, icon: <FaRegCreditCard size={20} /> },
    { name: t('delivery.confirmed'), value: 300, icon: <MdOutlineBookmarkAdded size={20} /> },
    { name: t('delivery.preparing'), value: 300, icon: <PiPackageBold size={20} /> },
    { name: t('delivery.shipping'), value: 200, icon: <FaTruck size={20} /> },
    { name: t('delivery.delivered'), value: 200, icon: <FaRegCheckCircle size={20} /> },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ['#405189', '#0ab39c', '#f7b84b', '#f06548', '#299cdb'];

  const renderPercentLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const percent = value / total;
    if (percent < 0.05) return null; // ẩn % quá nhỏ

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='#fff'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={12}
        fontWeight={600}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className='block__container w-full h-[650px] flex flex-col justify-between gap-3'>
      <h3 className='text-[16px] text-[#495057]'>{t('delivery_statistics')}</h3>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={70}
              dataKey='value'
              labelLine={false}
              label={renderPercentLabel}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='w-full flex flex-col gap-5'>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;

          return (
            <div key={`status-${index}`} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary text-[#FFF] p-2 rounded-md flex items-center justify-center'>
                  {get(item, 'icon', null)}
                </div>
                <span className='text-[0.85rem] text-zinc-500'>{get(item, 'name', '')}</span>
              </div>

              <span className='font-semibold text-zinc-500'>{get(item, 'value', 0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryChart;
