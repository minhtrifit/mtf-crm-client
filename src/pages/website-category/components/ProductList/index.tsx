import { get } from 'lodash';
import { Pagination } from 'antd';
import { PagingType } from '@/types';
import { Product } from '@/types/product';
import { FilterType, WEBSITE_PRODUCT_LIMIT } from '../..';
import WebsiteEmpty from '@/components/ui/WebsiteEmpty/WebsiteEmpty';
import ProductCard from '@/components/ui/ProductCard/ProductCard';

interface PropType {
  filter: FilterType;
  data: Product[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
}

const ProductList = (props: PropType) => {
  const { filter, data, paging, handlePageChange } = props;

  if (data?.length === 0) {
    return <WebsiteEmpty />;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5'>
      {data?.map((product) => {
        return <ProductCard key={get(product, 'id', '')} product={product} />;
      })}

      {get(paging, 'total_page', 1) > 1 && (
        <div className='mt-5 w-full flex items-center justify-center gap-5 col-span-full'>
          <Pagination
            showSizeChanger={false}
            current={filter.page}
            pageSize={WEBSITE_PRODUCT_LIMIT}
            total={get(paging, 'total', 0)}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
