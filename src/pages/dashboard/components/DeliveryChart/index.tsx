import { useMemo } from 'react';
import { get } from 'lodash';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { MdOutlineBookmarkAdded } from 'react-icons/md';
import { FaRegCheckCircle, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import { PiPackageBold } from 'react-icons/pi';
import styles from './styles.module.scss';
import { DeliveryStatusType } from '@/types/stats';

interface PropType {
  data: DeliveryStatusType | null;
}

const DeliveryChart = (props: PropType) => {
  const { data } = props;

  const { t } = useTranslation();

  const formattedData = useMemo(() => {
    if (!data)
      return [
        { name: t('delivery.ordered'), value: 0, icon: <FaRegCreditCard size={20} /> },
        { name: t('delivery.confirmed'), value: 0, icon: <MdOutlineBookmarkAdded size={20} /> },
        { name: t('delivery.preparing'), value: 0, icon: <PiPackageBold size={20} /> },
        { name: t('delivery.shipping'), value: 0, icon: <FaTruck size={20} /> },
        { name: t('delivery.delivered'), value: 0, icon: <FaRegCheckCircle size={20} /> },
      ];

    return [
      {
        name: t('delivery.ordered'),
        value: get(data, 'ordered', 0),
        icon: <FaRegCreditCard size={20} />,
      },
      {
        name: t('delivery.confirmed'),
        value: get(data, 'confirmed', 0),
        icon: <MdOutlineBookmarkAdded size={20} />,
      },
      {
        name: t('delivery.preparing'),
        value: get(data, 'preparing', 0),
        icon: <PiPackageBold size={20} />,
      },
      {
        name: t('delivery.shipping'),
        value: get(data, 'shipping', 0),
        icon: <FaTruck size={20} />,
      },
      {
        name: t('delivery.delivered'),
        value: get(data, 'delivered', 0),
        icon: <FaRegCheckCircle size={20} />,
      },
    ];
  }, [data]);

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

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
    <div className={`block__container ${styles.container}`}>
      <h3 className='text-[16px] text-[#495057]'>{t('delivery_statistics')}</h3>

      <div className={styles.content}>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={formattedData}
                cx='50%'
                cy='50%'
                innerRadius={70}
                dataKey='value'
                labelLine={false}
                label={renderPercentLabel}
                startAngle={90}
                endAngle={-270}
              >
                {formattedData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='w-full flex flex-col gap-5'>
          {formattedData.map((item, index) => {
            const isLast = index === formattedData.length - 1;

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
    </div>
  );
};

export default DeliveryChart;
