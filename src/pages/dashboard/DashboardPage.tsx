import { useTranslation } from 'react-i18next';
import StatisticCard from './components/StatisticCard';
import OverviewChart from './components/OverviewChart';
import { FiShoppingBag } from 'react-icons/fi';
import { AiFillDollarCircle } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import Calendar from './components/Calendar';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <main className='flex flex-col gap-5'>
      <section className='grid grid-cols-1 2xl:grid-cols-[1fr_30%] gap-5'>
        <div className='w-full flex flex-col gap-5'>
          <div className='w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
            <StatisticCard
              theme='ORANGE'
              title={t('dashboard.total_order')}
              value={50000}
              icon={<FiShoppingBag />}
            />

            <StatisticCard
              theme='GREEN'
              title={t('dashboard.total_revenue')}
              value={10500000000}
              icon={<AiFillDollarCircle />}
            />

            <StatisticCard
              theme='BLUE'
              title={t('dashboard.total_users')}
              value={1200}
              icon={<FaUser />}
            />
          </div>

          <OverviewChart />
        </div>

        <div className='block__container'>
          <Calendar />
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
