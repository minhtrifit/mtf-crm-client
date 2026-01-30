import { useMemo } from 'react';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Pagination, Popconfirm, Rate, Table, Image } from 'antd';
import { CommentType } from '@/types/product';
import { PagingType } from '@/types';
import { FilterType } from '../../page/list';
import { formatDateTime } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { FaTrash, FaUser } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';

const { Column } = Table;

interface PropType {
  filter: FilterType;
  data: CommentType[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  handleActionItem: (name: string, value: any) => Promise<void>;
}

const DataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange, handleActionItem } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => {
      return { ...item, key: item?.id };
    });
  }, [data]);

  return (
    <section className='block__container flex flex-col gap-[20px]'>
      <Table dataSource={TABLE_DATA} pagination={false} bordered scroll={{ x: 'max-content' }}>
        <Column
          title='#'
          key='index'
          width={60}
          align='center'
          render={(_, __, index) => (filter.page - 1) * DEFAULT_PAGE_SIZE + index + 1}
        />
        <Column
          title={t('user.default')}
          dataIndex='user'
          key='user'
          render={(_, record) => {
            return (
              <div className='flex items-center gap-3'>
                <Avatar
                  size={50}
                  src={get(record, 'user.avatar', '')}
                  icon={<FaUser size={18} />}
                  className={`${!get(record, 'user.avatar', '') && 'bg-primary'}`}
                />

                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{get(record, 'user.fullName', '')}</span>
                  <span className='text-[0.75rem] text-zinc-700'>
                    {get(record, 'user.email', '')}
                  </span>
                </div>
              </div>
            );
          }}
        />
        <Column
          title={t('review.comment')}
          dataIndex='comment'
          key='comment'
          minWidth={300}
          render={(_, record) => {
            return <span>{get(record, 'comment', '')}</span>;
          }}
        />
        <Column
          title={t('product.default')}
          dataIndex='product'
          key='product'
          minWidth={250}
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
        <Column
          title={t('review.rate')}
          dataIndex='rate'
          key='rate'
          width={120}
          render={(_, record) => {
            return (
              <div className='flex items-center gap-2'>
                <Rate count={1} value={1} disabled />
                <span className='text-[0.8rem]'>{get(record, 'rating', 0)}</span>
              </div>
            );
          }}
        />
        <Column
          title={t('image')}
          dataIndex='image'
          key='image'
          width={300}
          render={(_, record) => {
            const images = get(record, 'imagesUrl', []);

            return (
              <div className='flex flex-wrap items-center gap-3'>
                {images?.map((image: string, index: number) => {
                  return (
                    <Image
                      key={`${get(record, 'productId', '')}-image-review-${index}`}
                      width={50}
                      height={50}
                      className='object-cover'
                      src={image}
                    />
                  );
                })}
              </div>
            );
          }}
        />
        <Column
          title={t('createdAt')}
          dataIndex='createdAt'
          key='createdAt'
          width={200}
          render={(_, record) => {
            return <span>{formatDateTime(get(record, 'createdAt', ''))}</span>;
          }}
        />
        <Column
          title={t('action')}
          key='action'
          width={100}
          fixed='right'
          render={(_, record) => {
            return (
              <div className='flex items-center gap-2'>
                <Popconfirm
                  title={t('confirm')}
                  description={t('review.delete_confirm')}
                  onConfirm={() => {
                    handleActionItem('delete', record);
                  }}
                  okText={t('yes')}
                  cancelText={t('cancel')}
                >
                  <Button color='danger' variant='solid' icon={<FaTrash />} />
                </Popconfirm>
              </div>
            );
          }}
        />
      </Table>

      <div className='flex items-center justify-between'>
        <span>
          {get(paging, 'total_item', 0)}/{get(paging, 'total', 0)}
        </span>

        <Pagination
          showSizeChanger={false}
          current={filter.page}
          pageSize={DEFAULT_PAGE_SIZE}
          total={get(paging, 'total', 0)}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default DataTable;
