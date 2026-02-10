import { FormEvent, useEffect, useState } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useScrollToId } from '@/hooks/useScrollToId';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useList } from '@/pages/product/hooks/useList';
import Error from '@/components/ui/Error/Error';
import { ProductListSkeleton } from '@/components/ui/Skeleton';
import FilterBar from '../components/FilterBar';
import ProductList from '@/components/ui/ProductList';

export interface FilterType {
  page: number;
  q: string;
  categorySlug: string;
}

const WebsiteProductPage = () => {
  const { searchParams, updateParams } = useQueryParams();
  const scrollToId = useScrollToId();
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

  const { data, loading, error, paging, params, setParams } = useList(
    {
      page: filter.page,
      q: filter.q,
      categorySlug: filter.categorySlug,
      isActive: true,
      limit: PRODUCT_LIMIT,
    },
    {
      delayLoading: true,
      delayTime: 700,
    },
  );

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
      <div className='max-w-[1200px] mx-auto px-[20px] py-[50px] flex flex-col gap-8'>
        <FilterBar
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          handleApplyFilter={handleApplyFilter}
        />

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
