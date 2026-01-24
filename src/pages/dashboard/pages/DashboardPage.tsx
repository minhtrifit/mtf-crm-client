import { useState } from 'react';
import { get } from 'lodash';
import dayjs from 'dayjs';
import { OvertQuarterChartType, OvertYearChartType, TopSellingType, ViewType } from '@/types/stats';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useTranslation } from 'react-i18next';
import { useGetTotal } from '../hooks/useGetTotal';
import { useGetOverview } from '../hooks/useGetOverview';
import { useGetDeliveryStatus } from '../hooks/useGetDeliveryStatus';
import { useGetTopSellingProducts } from '../hooks/useGetTopSellingProducts';
import { useGetRecentOrders } from '../hooks/useGetRecentOrders';
import StatisticCard from '../components/StatisticCard';
import OverviewChart from '../components/OverviewChart';
import DeliveryChart from '../components/DeliveryChart';
import TopSellingProductDataTable from '../components/TopSellingProductsDt';
import RecentOrdersDataTable from '../components/RecentOrdersDt';
import { FiShoppingBag } from 'react-icons/fi';
import { AiFillDollarCircle } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import styles from './styles.module.scss';

export interface OverviewFilterType {
  type: ViewType;
  year: number;
}

export interface TopSellingProductsFilterType {
  type: TopSellingType;
}

const DashboardPage = () => {
  const { searchParams, updateParams } = useQueryParams();
  const { t } = useTranslation();

  const overview_view_type = searchParams.get('overview_view_type') ?? ViewType.YEAR;
  const overview_year = searchParams.get('overview_year')
    ? Number(searchParams.get('overview_year'))
    : dayjs().year();
  const top_selling_products_type =
    searchParams.get('top_selling_products_type') ?? TopSellingType.WEEK;

  const [overviewFilter, setOverviewFilter] = useState<OverviewFilterType>({
    type: overview_view_type as ViewType,
    year: overview_year,
  });

  const [topSellingProductsFilter, setTopSellingProductsFilter] =
    useState<TopSellingProductsFilterType>({
      type: top_selling_products_type as TopSellingType,
    });

  const { data: stats } = useGetTotal();

  const {
    data: overview,
    params: overviewParams,
    setParams: setOverviewParams,
  } = useGetOverview({
    type: overviewFilter.type,
    year: overviewFilter.year,
  });

  const { data: deliveryStatus } = useGetDeliveryStatus();

  const {
    data: topSellingProducts,
    params: topSellingProductsParams,
    setParams: setTopSellingProductsParams,
  } = useGetTopSellingProducts({
    type: topSellingProductsFilter.type,
  });

  const { data: recentOrders } = useGetRecentOrders();

  const handleChangeOverviewFilter = (name: 'type' | 'year', value: ViewType | number) => {
    if (name === 'year') {
      setOverviewFilter({ ...overviewFilter, year: value as number });
      updateParams({ overview_year: value.toString() });
      setOverviewParams({ ...overviewParams, year: value });
    }

    if (name === 'type') {
      setOverviewFilter({ ...overviewFilter, type: value as ViewType });
      updateParams({ overview_view_type: value as ViewType });
      setOverviewParams({ ...overviewParams, type: value });
    }
  };

  const handleChangeTopSellingProductsFilter = (value: TopSellingType) => {
    setTopSellingProductsFilter({ ...topSellingProductsFilter, type: value });
    updateParams({ top_selling_products_type: value });
    setTopSellingProductsParams({ ...topSellingProductsParams, type: value });
  };

  return (
    <main className='flex flex-col gap-5'>
      <section className={styles.section__1__wrapper}>
        <div className='w-full flex flex-col justify-between gap-5'>
          <div className='w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
            <StatisticCard
              theme='ORANGE'
              title={t('dashboard.total_order')}
              value={get(stats, 'total_orders', 0)}
              icon={<FiShoppingBag />}
            />

            <StatisticCard
              theme='GREEN'
              title={t('dashboard.total_revenue')}
              value={get(stats, 'total_revenue', 0)}
              icon={<AiFillDollarCircle />}
            />

            <StatisticCard
              theme='BLUE'
              title={t('dashboard.total_users')}
              value={get(stats, 'total_users', 0)}
              icon={<FaUser />}
            />
          </div>

          <OverviewChart
            overviewStats={get(overview, 'overview', null)}
            chartData={
              get(overview, `chart.${overviewFilter.type}`, null) as
                | OvertYearChartType
                | OvertQuarterChartType
                | null
            }
            filter={overviewFilter}
            handleChangeFilter={handleChangeOverviewFilter}
          />
        </div>

        <div className='h-full'>
          <DeliveryChart data={deliveryStatus} />
        </div>
      </section>

      <section className={styles.section__2__wrapper}>
        <TopSellingProductDataTable
          data={topSellingProducts}
          filter={topSellingProductsFilter}
          handleChangeFilter={handleChangeTopSellingProductsFilter}
        />

        <RecentOrdersDataTable data={recentOrders} />
      </section>
    </main>
  );
};

export default DashboardPage;
