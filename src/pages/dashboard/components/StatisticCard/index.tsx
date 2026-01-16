import React from 'react';
import CountUp from 'react-countup';
import { Statistic } from 'antd';
import type { StatisticProps } from 'antd';

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
}

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator=',' />
);

const StatisticCard = (props: PropType) => {
  const { title, value, icon, theme } = props;

  const currentTheme = IconTheme[theme];

  const styledIcon = React.cloneElement(icon, {
    className: `
      ${icon.props.className || ''}
      text-[24px] text-[#299cdb] `,
    style: {
      color: currentTheme.title,
    },
  });

  return (
    <div
      className='block__container w-full flex items-center gap-5 rounded-lg p-4
                    transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group'
    >
      <div
        style={{ background: currentTheme.background }}
        className='w-[48px] h-[48px] flex items-center justify-center p-2 rounded-md'
      >
        {styledIcon}
      </div>

      <Statistic
        title={<span className='text-[#878a99] text-[0.8rem] uppercase font-[500]'>{title}</span>}
        value={value}
        formatter={formatter}
        valueStyle={{
          color: '#495057',
          fontSize: '1.2rem',
          fontWeight: '500',
        }}
      />
    </div>
  );
};

export default StatisticCard;
