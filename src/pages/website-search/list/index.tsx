import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useScrollToId } from '@/hooks/useScrollToId';
import { useList } from '@/pages/product/hooks/useList';
import { useIsMobile } from '@/hooks/useIsMobile';
import Error from '@/components/ui/Error/Error';
import { ProductListSkeleton } from '@/components/ui/Skeleton';
import ProductList from '@/components/ui/ProductList';

export interface FilterType {
  page: number;
  q: string;
}

const WebsiteSearchPage = () => {
  const { searchParams, updateParams } = useQueryParams();
  const { config } = useAppConfig();
  const isMobile = useIsMobile();
  const scrollToId = useScrollToId();
  const { t } = useTranslation();

  const PRODUCT_LIMIT = 12;

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
  });

  const { data, loading, error, paging, params, setParams } = useList({
    page: filter.page,
    q: filter.q,
    isActive: true,
    limit: PRODUCT_LIMIT,
  });

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setParams({ ...params, page: page });
    updateParams({ page: page.toString() });
    scrollToId('search-products-list', { offset: 150 });
  };

  useEffect(() => {
    if (!q) return;

    setParams({ ...params, q });
  }, [q]);

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='w-full flex-1'>
      <div
        className={cn(
          'max-w-[1200px] mx-auto flex flex-col gap-8',
          isMobile ? 'px-[10px] py-[20px]' : 'px-[20px] py-[50px]',
        )}
      >
        <h3 style={{ color: config?.websitePrimaryColor }} className='my-0 text-[1.5rem]'>
          {t('search_result_for_keyword', {
            keyword: q,
          })}
        </h3>

        <section id='search-products-list' className='w-full'>
          {loading ? (
            <ProductListSkeleton />
          ) : (
            <ProductList
              filter={filter}
              data={data}
              PRODUCT_LIMIT={PRODUCT_LIMIT}
              paging={paging}
              handlePageChange={handlePageChange}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default WebsiteSearchPage;
