import { FormEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useScrollToId } from '@/hooks/useScrollToId';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useList } from '@/pages/product/hooks/useList';
import { useIsMobile } from '@/hooks/useIsMobile';
import Error from '@/components/ui/Error/Error';
import { ProductListSkeleton } from '@/components/ui/Skeleton';
import FilterBar from '../components/FilterBar';
import ProductList from '@/components/ui/ProductList';
import CouponSlide from '@/pages/home/components/CouponSlide';

export interface FilterType {
  page: number;
  q: string;
  categorySlug: string;
}

const WebsiteProductPage = () => {
  const { searchParams, updateParams } = useQueryParams();
  const scrollToId = useScrollToId();
  const isMobile = useIsMobile();
  useDocumentTitle('page.all_products');

  const PRODUCT_LIMIT = 12;

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const q = searchParams.get('q') ?? '';
  const categorySlug = searchParams.get('categorySlug') ?? '';

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: q,
    categorySlug: categorySlug,
  });
  const productSearch = useDebounce(filter.q, 500);

  const { data, loading, error, paging, params, setParams } = useList({
    page: filter.page,
    q: filter.q,
    categorySlug: filter.categorySlug,
    isActive: true,
    limit: PRODUCT_LIMIT,
  });

  const handleChangeFilter = (key: string, value: string) => {
    if (key === 'q') {
      setFilter({
        ...filter,
        [key]: value,
      });
    }

    if (key !== 'q') {
      setFilter({
        ...filter,
        [key]: value,
        page: 1,
      });

      setParams({
        ...params,
        page: 1,
        [key]: value,
      });

      updateParams({
        page: '1',
        [key]: value,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setParams({ ...params, page: page });
    updateParams({ page: page.toString() });
    scrollToId('all-products-list', { offset: 150 });
  };

  const handleApplyFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('APPLY FILTER:', filter);

    setFilter({ ...filter, page: 1 });

    setParams({
      page: 1,
      q: filter.q,
      categorySlug: filter.categorySlug,
      isActive: true,
      limit: PRODUCT_LIMIT,
    });

    updateParams({
      page: '1',
      q: filter.q,
      categorySlug: filter.categorySlug,
    });
  };

  // Product search debounce
  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      q: productSearch,
      limit: PRODUCT_LIMIT,
    });

    updateParams({
      page: '1',
      q: productSearch,
    });
  }, [productSearch]);

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
        <FilterBar
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          handleApplyFilter={handleApplyFilter}
        />

        <CouponSlide />

        <section id='all-products-list' className='w-full'>
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

export default WebsiteProductPage;
