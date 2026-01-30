import { FormEvent, useEffect, useState } from 'react';
import { get } from 'lodash';
import { Avatar } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useParams } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useList } from '../hooks/useList';
import { useDetailCategory } from '../hooks/useDetailCategory';
import { useScrollToId } from '@/hooks/useScrollToId';
import Error from '@/components/ui/Error/Error';
import { TitleSkelelon } from '../components/Skeleton';
import { ProductListSkeleton } from '@/components/ui/Skeleton';
import ProductList from '@/components/ui/ProductList';
import FilterBar from '../components/FilterBar';

export interface FilterType {
  page: number;
  q: string;
}

export const WEBSITE_PRODUCT_LIMIT = 8;

const WebsiteCategoryPage = () => {
  const { config } = useAppConfig();
  const params = useParams();
  const { searchParams, updateParams } = useQueryParams();
  const scrollToId = useScrollToId();

  const slug = params?.slug ?? '';

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const { data: category, loading: categoryLoading } = useDetailCategory(slug);
  const {
    data,
    loading,
    error,
    paging,
    params: productParams,
    setParams,
  } = useList(slug, { page: page, limit: WEBSITE_PRODUCT_LIMIT });

  const [filter, setFilter] = useState<FilterType>({
    page: page,
    q: '',
  });
  const productSearch = useDebounce(filter.q, 500);

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setParams({ ...productParams, page: page });
    updateParams({ page: page.toString() });
    scrollToId('product-by-category-list', { offset: 150 });
  };

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

  const handleApplyFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('APPLY FILTER:', filter);

    setFilter({ ...filter, page: 1 });

    setParams({
      page: 1,
      q: filter.q,
      limit: WEBSITE_PRODUCT_LIMIT,
    });

    updateParams({
      page: '1',
      q: filter.q,
    });
  };

  // Product search debounce
  useEffect(() => {
    setParams({
      ...params,
      page: 1,
      q: productSearch,
      limit: WEBSITE_PRODUCT_LIMIT,
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
        <section className='w-full flex items-center justify-center'>
          {categoryLoading ? (
            <TitleSkelelon />
          ) : (
            <div className='flex items-center gap-3'>
              <Avatar src={get(category, 'imageUrl', '')} size={80} />

              <h3 style={{ color: config?.websitePrimaryColor }} className='my-0 text-[1.5rem]'>
                {get(category, 'name', '')}
              </h3>
            </div>
          )}
        </section>

        <FilterBar
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          handleApplyFilter={handleApplyFilter}
        />

        <section id='product-by-category-list' className='w-full'>
          {loading ? (
            <ProductListSkeleton />
          ) : (
            <ProductList
              filter={filter}
              data={data}
              PRODUCT_LIMIT={WEBSITE_PRODUCT_LIMIT}
              paging={paging}
              handlePageChange={handlePageChange}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default WebsiteCategoryPage;
