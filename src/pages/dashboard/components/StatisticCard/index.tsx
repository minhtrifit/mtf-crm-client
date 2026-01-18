import React from 'react';
import CountUp from 'react-countup';
import { Statistic, Tag } from 'antd';
import type { StatisticProps } from 'antd';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';

export const IconTheme = {
  BLUE: {
    title: '#299cdb',
    background: '#dff0fa',
  },
  GREEN: {
    title: '#16a34a',
    background: '#dcfce7',
  },
  ORANGE: {
    title: '#f97316',
    background: '#ffedd5',
  },
} as const;

type IconThemeKey = keyof typeof IconTheme;

interface PropType {
  title: string;
  value: number;
  icon: React.ReactElement;
  theme: IconThemeKey;
  growth?: number;
  decline?: number;
}

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator='.' />
);

const StatisticCard = (props: PropType) => {
  const { title, value, icon, theme, growth, decline } = props;

  const currentTheme = IconTheme[theme];

  const styledIcon = React.cloneElement(icon, {
    className: `
      ${icon.props.className || ''}
      text-[24px] text-[#299cdb] `,
    style: {
      color: currentTheme.title,
    },
  });

  const RenderLabel = () => {
    if (!growth && !decline) return <div className='opacity-0'>label</div>;

    if (growth)
      return (
        <Tag color='green' className='mr-auto flex items-center gap-2'>
          <FaArrowTrendUp size={15} />
          <span className='text-[0.8rem] font-[600]'>{growth} %</span>
        </Tag>
      );

    if (decline)
      return (
        <Tag color='red' className='mr-auto flex items-center gap-2'>
          <FaArrowTrendUp size={15} />
          <span className='text-[0.8rem] font-[600]'>{decline} %</span>
        </Tag>
      );

    return <div className='opacity-0'>label</div>;
  };

  return (
    <div
      className='block__container w-full flex items-start justify-between gap-5 rounded-lg p-4
                    transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group'
    >
      <Statistic
        title={<span className='text-[#878a99] text-[0.8rem] uppercase font-[500]'>{title}</span>}
        value={value}
        formatter={formatter}
        valueStyle={{
          color: '#495057',
          fontSize: '1.4rem',
          fontWeight: '600',
        }}
      />

      <div className='flex flex-col items-end gap-8'>
        <RenderLabel />

        <div
          style={{ background: currentTheme.background }}
          className='w-[48px] h-[48px] flex items-center justify-center p-2 rounded-md'
        >
          {styledIcon}
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
