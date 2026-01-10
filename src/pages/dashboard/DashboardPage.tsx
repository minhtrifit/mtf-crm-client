import { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Card, Statistic, DatePicker } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DropboxOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const { t } = useTranslation();

  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  return (
    <main className='block__container flex flex-col gap-5'>
      <section className='flex items-center justify-end gap-5'>
        <RangePicker
          format='DD/MM/YYYY' // Định dạng hiển thị
          value={dates}
          placeholder={[t('start-date'), t('end-date')]}
          onChange={(values) => {
            setDates(values);
            if (values) {
              const startDate = values[0]?.format('DD/MM/YYYY');
              const endDate = values[1]?.format('DD/MM/YYYY');

              console.log('Start date:', startDate);
              console.log('End date:', endDate);
            }
          }}
        />
      </section>

      <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5'>
        <Card variant='borderless' className='bg-violet-700'>
          <div>
            <Statistic
              title={<span className='text-[#FFF]'>Đơn hàng</span>}
              value={150}
              precision={1}
              prefix={<ShoppingOutlined className='text-[#FFF] text-[30px]' />}
              valueStyle={{ color: '#FFF' }}
            />
          </div>
        </Card>

        <Card variant='borderless' className='bg-blue-500'>
          <Statistic
            title={<span className='text-[#FFF]'>Sản phẩm</span>}
            value={120}
            prefix={<DropboxOutlined />}
            valueStyle={{ color: '#FFF' }}
          />
        </Card>

        <Card variant='borderless' className='bg-yellow-500'>
          <Statistic
            title={<span className='text-[#FFF]'>Doanh số</span>}
            value={9.3}
            precision={2}
            prefix={<ArrowUpOutlined />}
            suffix='%'
            valueStyle={{ color: '#FFF' }}
          />
        </Card>

        <Card variant='borderless' className='bg-red-500'>
          <Statistic
            title={<span className='text-[#FFF]'>Lượt truy cập</span>}
            value={9.3}
            precision={2}
            prefix={<ArrowDownOutlined />}
            suffix='%'
            valueStyle={{ color: '#FFF' }}
          />
        </Card>
      </section>
    </main>
  );
};

export default DashboardPage;
