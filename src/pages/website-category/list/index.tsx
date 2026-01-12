import { useState } from 'react';
import { get } from 'lodash';
import { Avatar } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useParams } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useList } from '../hooks/useList';
import { useDetailCategory } from '../hooks/useDetailCategory';
import { useScrollToId } from '@/hooks/useScrollToId';
import Error from '@/components/ui/Error/Error';
import { ProductListSkeleton, TitleSkelelon } from '../components/Skeleton';
import ProductList from '../components/ProductList';

export interface FilterType {
  page: number;
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
  });

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setParams({ ...productParams, page: page });
    updateParams({ page: page.toString() });
    scrollToId('product-by-category-list', { offset: 150 });
  };

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

        <section id='product-by-category-list' className='w-full'>
          {loading ? (
            <ProductListSkeleton />
          ) : (
            <ProductList
              filter={filter}
              data={data}
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
