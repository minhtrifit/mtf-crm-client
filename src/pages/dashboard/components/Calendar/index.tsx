import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useTranslation } from 'react-i18next';
import { Calendar as AntdCalendar, Radio, Select } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import './styles.scss';

dayjs.extend(dayLocaleData);

const Calendar = () => {
  const { t } = useTranslation();

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <AntdCalendar
      fullscreen={false}
      onPanelChange={onPanelChange}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const year = value.year();
        const month = value.month();

        const yearOptions = Array.from({ length: 20 }, (_, i) => {
          const label = year - 10 + i;
          return { label, value: label };
        });

        const monthOptions = value
          .localeData()
          .monthsShort()
          .map((label, index) => ({
            label,
            value: index,
          }));

        return (
          <div className='w-full flex items-start justify-between gap-2'>
            <h3>Lịch sắp tới</h3>

            <div className='flex gap-3 mb-3'>
              <Radio.Group size='small' onChange={(e) => onTypeChange(e.target.value)} value={type}>
                <Radio.Button value='month'>{t('month.default')}</Radio.Button>
                <Radio.Button value='year'>{t('year')}</Radio.Button>
              </Radio.Group>

              <Select
                size='small'
                popupMatchSelectWidth={false}
                value={year}
                options={yearOptions}
                onChange={(newYear) => {
                  const now = value.clone().year(newYear);
                  onChange(now);
                }}
              />

              <Select
                size='small'
                popupMatchSelectWidth={false}
                value={month}
                options={monthOptions}
                onChange={(newMonth) => {
                  const now = value.clone().month(newMonth);
                  onChange(now);
                }}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default Calendar;
