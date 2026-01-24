import { useMemo } from 'react';
import { get } from 'lodash';
import { Avatar, Select, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopSellingProductsFilterType } from '../../pages/DashboardPage';
import { TopSellingProductType, TopSellingType } from '@/types/stats';
import { formatCurrency, formatNumber } from '@/+core/helpers';
import { MdCategory } from 'react-icons/md';
import { FiShoppingBag } from 'react-icons/fi';

const { Column } = Table;

interface PropType {
  data: TopSellingProductType[];
  filter: TopSellingProductsFilterType;
  handleChangeFilter: (value: TopSellingType) => void;
}

const TopSellingProductDataTable = (props: PropType) => {
  const { data, filter, handleChangeFilter } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => {
      return { ...item, key: item?.product?.id };
    });
  }, [data]);

  return (
    <div className='block__container flex flex-col gap-3'>
      <div className='h-[40px] flex items-center justify-between'>
        <h3 className='text-[16px] text-[#495057] whitespace-nowrap'>{t('top_selling_product')}</h3>

        <Select
          value={filter.type}
          onChange={(value: string) => handleChangeFilter(value as TopSellingType)}
          className='w-[130px]'
          options={[
            { value: TopSellingType.WEEK, label: t('week') },
            { value: TopSellingType.MONTH, label: t('month.default') },
            { value: TopSellingType.YEAR, label: t('year') },
          ]}
        />
      </div>

      <Table
        dataSource={TABLE_DATA}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/admin/product/detail/${get(record, 'product.id', '')}`);
            },
          };
        }}
      >
        <Column
          title={t('product.name')}
          dataIndex='name'
          key='name'
          render={(_, record) => {
            return (
              <div className='flex items-center gap-3'>
                <Avatar
                  shape='square'
                  size={50}
                  src={get(record, 'product.imagesUrl[0]', '')}
                  icon={<FiShoppingBag />}
                />
                <span>{get(record, 'product.name', '')}</span>
              </div>
            );
          }}
        />
        {/* <Column
          title={t('category.default')}
          dataIndex='category'
          key='category'
          render={(_, record) => {
            return (
              <div className='flex items-center gap-3'>
                <Avatar
                  size={50}
                  src={get(record, 'product.category.imageUrl', '')}
                  icon={<MdCategory />}
                />
                <span>{get(record, 'product.category.name', '')}</span>
              </div>
            );
          }}
        /> */}
        <Column
          minWidth={100}
          title={t('price')}
          dataIndex='price'
          key='price'
          render={(_, record) => {
            return <span>{formatCurrency(get(record, 'product.price', 0))}</span>;
          }}
        />
        <Column
          minWidth={80}
          title={t('stock')}
          dataIndex='stock'
          key='stock'
          render={(_, record) => {
            return <span>{formatNumber(get(record, 'product.stock', 0))}</span>;
          }}
        />
        <Column
          minWidth={80}
          title={t('product.sold')}
          dataIndex='soldQuantity'
          key='soldQuantity'
          render={(_, record) => {
            return <span>{formatNumber(get(record, 'soldQuantity', 0))}</span>;
          }}
        />
      </Table>
    </div>
  );
};

export default TopSellingProductDataTable;
