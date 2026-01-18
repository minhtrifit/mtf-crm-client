import { useTranslation } from 'react-i18next';
import { FiShoppingBag } from 'react-icons/fi';
import { AiFillDollarCircle } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import StatisticCard from './components/StatisticCard';
import OverviewChart from './components/OverviewChart';
import DeliveryChart from './components/DeliveryChart';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <main className='flex flex-col gap-5'>
      <section className='grid grid-cols-1 2xl:grid-cols-[1fr_25%] items-between gap-5'>
        <div className='w-full flex flex-col justify-between gap-5'>
          <div className='w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
            <StatisticCard
              theme='ORANGE'
              title={t('dashboard.total_order')}
              value={50000}
              growth={1624}
              icon={<FiShoppingBag />}
            />

            <StatisticCard
              theme='GREEN'
              title={t('dashboard.total_revenue')}
              value={10500000000}
              decline={3.57}
              icon={<AiFillDollarCircle />}
            />

            <StatisticCard
              theme='BLUE'
              title={t('dashboard.total_users')}
              value={1200}
              growth={29.08}
              icon={<FaUser />}
            />
          </div>

          <OverviewChart />
        </div>

        <div className='h-full'>
          <DeliveryChart />
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
