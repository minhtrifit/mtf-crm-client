import { useMemo } from 'react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Button, Card, Pagination, Tooltip, Image, Tag, Empty } from 'antd';
import { Product } from '@/types/product';
import { PagingType } from '@/types';
import { FilterType } from '@/pages/product/pages/list';
import { formatCurrency, formatNumber } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import styles from './styles.module.scss';

interface PropType {
  filter: FilterType;
  data: Product[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  handleActionItem: (name: string, value: any) => Promise<void>;
}

const ProductDataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange, handleActionItem } = props;

  const { t } = useTranslation();

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => {
      return { ...item, key: item?.id };
    });
  }, [data]);

  return (
    <section className='block__container flex flex-col gap-[20px]'>
      {TABLE_DATA?.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className={styles.container}>
          {TABLE_DATA?.map((product) => {
            return (
              <Card
                key={get(product, 'id', '')}
                cover={
                  <Image
                    preview={false}
                    className='p-[1px] rounded-t-lg'
                    src={get(product, 'imagesUrl[0]', '')}
                  />
                }
              >
                <div className='flex flex-col gap-2'>
                  <span className='text-[1rem] min-h-[50px] line-clamp-2'>
                    {get(product, 'name', '')}
                  </span>

                  <div className='flex flex-col gap-1'>
                    <span className='text-primary text-[1.15rem] font-semibold'>
                      {formatCurrency(get(product, 'price', ''))}
                    </span>
                  </div>

                  <div className='w-full flex items-center justify-between gap-5'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Tag color={get(product, 'isActive', false) === true ? 'green' : 'red'}>
                        {get(product, 'isActive', false) === true ? t('active') : t('inactive')}
                      </Tag>

                      <span className='text-zinc-700'>
                        {t('stock')}: {formatNumber(get(product, 'stock', 0))}
                      </span>
                    </div>

                    <Tooltip title={t('add_to_cart')}>
                      <Button
                        type='primary'
                        disabled={
                          get(product, 'stock', 0) === 0 ||
                          get(product, 'isActive', false) === false
                        }
                        onClick={() => {
                          handleActionItem('add_to_cart', product);
                        }}
                      >
                        <AiOutlineShoppingCart size={20} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className='flex items-center justify-between'>
        <span>
          {get(paging, 'total_item', 0)}/{get(paging, 'total', 0)}
        </span>

        {get(paging, 'total_page', 1) > 1 && (
          <Pagination
            showSizeChanger={false}
            current={filter.page}
            pageSize={DEFAULT_PAGE_SIZE}
            total={get(paging, 'total', 0)}
            onChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default ProductDataTable;
